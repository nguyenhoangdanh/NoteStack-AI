import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CategorySuggestionDto } from './dto/categories.dto';
import * as natural from 'natural';
import compromise from 'compromise';

@Injectable()
export class CategoriesService {
  private tokenizer = new natural.WordTokenizer();
  private stemmer = natural.PorterStemmer;

  constructor(
    private prisma: PrismaService,
    @InjectQueue('smart-categorization') private categorizationQueue: Queue,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        ownerId: userId,
      },
      include: {
        noteCategories: {
          include: {
            note: {
              select: { id: true, title: true },
            },
          },
        },
        _count: {
          select: { noteCategories: true },
        },
      },
    });
  }

  async findAll(userId: string, includeAuto: boolean = true) {
    const where = {
      ownerId: userId,
      ...(includeAuto ? {} : { isAuto: false }),
    };

    return this.prisma.category.findMany({
      where,
      include: {
        noteCategories: {
          include: {
            note: {
              select: { id: true, title: true },
            },
          },
        },
        _count: {
          select: { noteCategories: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, ownerId: userId },
      include: {
        noteCategories: {
          include: {
            note: {
              select: { id: true, title: true, content: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    await this.findOne(id, userId);
    
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: { noteCategories: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    
    // Remove all note-category associations first
    await this.prisma.noteCategory.deleteMany({
      where: { categoryId: id },
    });
    
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async suggestCategories(content: string, userId: string): Promise<CategorySuggestionDto[]> {
    const userCategories = await this.prisma.category.findMany({
      where: { ownerId: userId },
      select: { id: true, name: true, keywords: true },
    });

    if (userCategories.length === 0) {
      // Generate new category suggestions using AI
      return this.generateNewCategorySuggestions(content);
    }

    const suggestions: CategorySuggestionDto[] = [];
    const processedContent = this.preprocessText(content);

    for (const category of userCategories) {
      const confidence = this.calculateCategoryConfidence(processedContent, category.keywords);
      
      if (confidence > 0.3) {
        const matchingKeywords = category.keywords.filter(keyword =>
          processedContent.toLowerCase().includes(keyword.toLowerCase())
        );

        suggestions.push({
          name: category.name,
          confidence,
          matchingKeywords,
          exists: true,
          existingCategoryId: category.id,
        });
      }
    }

    // Add AI-generated suggestions if confidence is low
    if (suggestions.length === 0 || Math.max(...suggestions.map(s => s.confidence)) < 0.6) {
      const aiSuggestions = await this.generateNewCategorySuggestions(content);
      suggestions.push(...aiSuggestions);
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  async autoCategorizeNote(noteId: string, userId: string, threshold: number = 0.7) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, ownerId: userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const suggestions = await this.suggestCategories(note.content + ' ' + note.title, userId);
    const applicableSuggestions = suggestions.filter(s => s.confidence >= threshold);

    const results = [];

    for (const suggestion of applicableSuggestions) {
      if (suggestion.exists && suggestion.existingCategoryId) {
        // Assign to existing category
        try {
          await this.prisma.noteCategory.create({
            data: {
              noteId,
              categoryId: suggestion.existingCategoryId,
              confidence: suggestion.confidence,
              isAuto: true,
            },
          });
          results.push({ ...suggestion, assigned: true });
        } catch (error) {
          // Category already assigned
          results.push({ ...suggestion, assigned: false, reason: 'Already assigned' });
        }
      } else if (suggestion.confidence >= 0.8) {
        // Create new category for high-confidence suggestions
        const newCategory = await this.prisma.category.create({
          data: {
            name: suggestion.name,
            keywords: suggestion.matchingKeywords,
            ownerId: userId,
            isAuto: true,
            confidence: suggestion.confidence,
          },
        });

        await this.prisma.noteCategory.create({
          data: {
            noteId,
            categoryId: newCategory.id,
            confidence: suggestion.confidence,
            isAuto: true,
          },
        });

        results.push({ ...suggestion, assigned: true, categoryId: newCategory.id });
      }
    }

    return results;
  }

  async queueAutoCategorization(noteId: string, userId: string, threshold?: number) {
    await this.categorizationQueue.add(
      'auto-categorize-note',
      { noteId, userId, threshold },
      {
        delay: 2000, // 2 second delay to allow note to be fully processed
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );
  }

  async getNoteCategories(noteId: string, userId: string) {
    return this.prisma.noteCategory.findMany({
      where: {
        noteId,
        note: { ownerId: userId },
      },
      include: {
        category: true,
      },
      orderBy: { confidence: 'desc' },
    });
  }

  async assignCategory(noteId: string, categoryId: string, userId: string) {
    // Verify note ownership
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, ownerId: userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // Verify category ownership
    const category = await this.findOne(categoryId, userId);

    try {
      return await this.prisma.noteCategory.create({
        data: {
          noteId,
          categoryId,
          isAuto: false,
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Note is already assigned to this category');
      }
      throw error;
    }
  }

  async unassignCategory(noteId: string, categoryId: string, userId: string) {
    // Verify note ownership
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, ownerId: userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.prisma.noteCategory.delete({
      where: {
        noteId_categoryId: {
          noteId,
          categoryId,
        },
      },
    });
  }

  private preprocessText(text: string): string {
    // Remove markdown formatting
    let processed = text
      .replace(/[#*_`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();

    // Extract meaningful phrases using compromise
    const doc = compromise(processed);
    const nouns = doc.nouns().out('array');
    const topics = doc.topics().out('array');
    
    processed += ' ' + [...nouns, ...topics].join(' ');

    return processed;
  }

  private calculateCategoryConfidence(content: string, keywords: string[]): number {
    if (keywords.length === 0) {
      return 0;
    }

    const contentLower = content.toLowerCase();
    const tokens = this.tokenizer.tokenize(contentLower) || [];
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));

    let score = 0;
    let keywordMatches = 0;

    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      const keywordTokens = this.tokenizer.tokenize(keywordLower) || [];
      const stemmedKeyword = keywordTokens.map(token => this.stemmer.stem(token));

      // Exact phrase match (highest score)
      if (contentLower.includes(keywordLower)) {
        score += 2.0;
        keywordMatches++;
      }
      // Stemmed word match
      else if (stemmedKeyword.some(stem => stemmedTokens.includes(stem))) {
        score += 1.0;
        keywordMatches++;
      }
      // Fuzzy match using natural distance
      else if (tokens.length > 0) {
        const distances = tokens.map(token => 
          natural.JaroWinklerDistance(token, keywordLower, { dj: 0.8 })
        );
        const bestMatch = distances.length > 0 ? Math.max(...distances) : 0;
        if (bestMatch > 0.8) {
          score += bestMatch;
          keywordMatches++;
        }
      }
    }

    // Normalize score
    const maxScore = keywords.length * 2.0;
    const confidence = Math.min(score / maxScore, 1.0);

    // Boost confidence if multiple keywords match
    const keywordMatchRatio = keywordMatches / keywords.length;
    return confidence * (0.7 + (keywordMatchRatio * 0.3));
  }

  private async generateNewCategorySuggestions(content: string): Promise<CategorySuggestionDto[]> {
    // Extract key topics and themes from content
    const doc = compromise(content);
    const nouns = doc.nouns().out('array');
    const topics = doc.topics().out('array');
    const people = doc.people().out('array');
    const places = doc.places().out('array');

    const suggestions: CategorySuggestionDto[] = [];

    // Technology/Programming keywords
    const techKeywords = ['code', 'programming', 'development', 'software', 'api', 'database', 'algorithm'];
    if (techKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      suggestions.push({
        name: 'Technology',
        confidence: 0.8,
        matchingKeywords: techKeywords.filter(k => content.toLowerCase().includes(k)),
        exists: false,
      });
    }

    // Business/Work keywords
    const businessKeywords = ['meeting', 'project', 'business', 'client', 'deadline', 'budget', 'strategy'];
    if (businessKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      suggestions.push({
        name: 'Work',
        confidence: 0.8,
        matchingKeywords: businessKeywords.filter(k => content.toLowerCase().includes(k)),
        exists: false,
      });
    }

    // Personal/Life keywords
    const personalKeywords = ['family', 'friend', 'personal', 'life', 'health', 'hobby', 'travel'];
    if (personalKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      suggestions.push({
        name: 'Personal',
        confidence: 0.7,
        matchingKeywords: personalKeywords.filter(k => content.toLowerCase().includes(k)),
        exists: false,
      });
    }

    // Learning/Education keywords
    const learningKeywords = ['learn', 'study', 'course', 'tutorial', 'book', 'research', 'knowledge'];
    if (learningKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      suggestions.push({
        name: 'Learning',
        confidence: 0.8,
        matchingKeywords: learningKeywords.filter(k => content.toLowerCase().includes(k)),
        exists: false,
      });
    }

    // Create category suggestions based on extracted topics
    for (const topic of topics.slice(0, 3)) {
      if (topic.length > 2 && !suggestions.some(s => s.name.toLowerCase() === topic.toLowerCase())) {
        suggestions.push({
          name: this.capitalizeFirst(topic),
          confidence: 0.6,
          matchingKeywords: [topic],
          exists: false,
        });
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
