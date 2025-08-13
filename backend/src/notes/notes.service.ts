import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorsService } from '../vectors/vectors.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private vectorsService: VectorsService,
  ) {}

  async findAll(userId: string, workspaceId?: string, limit?: number) {
    const where = {
      ownerId: userId,
      isDeleted: false,
      ...(workspaceId && { workspaceId }),
    };

    const query = this.prisma.note.findMany({
      where,
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      ...(limit && { take: limit }),
    });

    return query;
  }

  async findOne(id: string, userId: string) {
    const note = await this.prisma.note.findFirst({
      where: {
        id,
        ownerId: userId,
        isDeleted: false,
      },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async create(createNoteDto: CreateNoteDto, userId: string) {
    // Verify workspace ownership
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: createNoteDto.workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found or not owned by user');
    }

    const note = await this.prisma.note.create({
      data: {
        ...createNoteDto,
        ownerId: userId,
      },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
    });

    // Process for RAG in background
    this.processForRAG(note.id, userId);

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string) {
    const existingNote = await this.findOne(id, userId);
    
    const note = await this.prisma.note.update({
      where: {
        id,
        ownerId: userId,
      },
      data: updateNoteDto,
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
    });

    // Reprocess for RAG if content changed
    if (updateNoteDto.content !== undefined) {
      this.processForRAG(note.id, userId);
    }

    return note;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check existence and ownership

    // Soft delete
    await this.prisma.note.update({
      where: {
        id,
        ownerId: userId,
      },
      data: {
        isDeleted: true,
      },
    });

    // Remove vectors
    await this.vectorsService.deleteByNote(id, userId);
  }

  async search(query: string, userId: string, limit: number = 10) {
    return this.prisma.note.findMany({
      where: {
        ownerId: userId,
        isDeleted: false,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              hasSome: [query],
            },
          },
        ],
      },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });
  }

  async processForRAG(noteId: string, userId: string) {
    try {
      await this.vectorsService.processNoteForRAG(noteId, userId);
    } catch (error) {
      console.error(`Failed to process note ${noteId} for RAG:`, error);
    }
  }
}
