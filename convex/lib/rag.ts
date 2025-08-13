import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

export interface TextChunk {
  id: string;
  content: string;
  index: number;
  heading?: string;
}

export interface EmbeddedChunk extends TextChunk {
  embedding: number[];
}

// Simple tokenizer approximation (1 token ≈ 4 characters for English)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Chunk text into smaller pieces while preserving context
export function chunkText(
  content: string,
  noteId: string,
  options = { maxTokens: 500, overlap: 50 }
): TextChunk[] {
  const chunks: TextChunk[] = [];
  const lines = content.split('\n');
  
  let currentChunk = '';
  let currentHeading = '';
  let chunkIndex = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Detect markdown headings
    if (trimmedLine.startsWith('#')) {
      // If we have a current chunk, save it before starting new one
      if (currentChunk.trim()) {
        chunks.push({
          id: `${noteId}_chunk_${chunkIndex}`,
          content: currentChunk.trim(),
          index: chunkIndex,
          heading: currentHeading || undefined,
        });
        chunkIndex++;
        currentChunk = '';
      }
      
      currentHeading = trimmedLine.replace(/^#+\s*/, '');
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
      
      // Check if chunk is getting too large
      if (estimateTokens(currentChunk) > options.maxTokens) {
        // Try to split at sentence boundary
        const sentences = currentChunk.split(/[.!?]+/);
        if (sentences.length > 1) {
          const splitPoint = Math.floor(sentences.length / 2);
          const firstPart = sentences.slice(0, splitPoint).join('.') + '.';
          const secondPart = sentences.slice(splitPoint).join('.');
          
          chunks.push({
            id: `${noteId}_chunk_${chunkIndex}`,
            content: firstPart.trim(),
            index: chunkIndex,
            heading: currentHeading || undefined,
          });
          chunkIndex++;
          
          // Add overlap
          const overlapWords = firstPart.split(' ').slice(-options.overlap).join(' ');
          currentChunk = overlapWords + ' ' + secondPart;
        } else {
          // Force split if no sentence boundaries
          chunks.push({
            id: `${noteId}_chunk_${chunkIndex}`,
            content: currentChunk.trim(),
            index: chunkIndex,
            heading: currentHeading || undefined,
          });
          chunkIndex++;
          currentChunk = '';
        }
      }
    }
  }
  
  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      id: `${noteId}_chunk_${chunkIndex}`,
      content: currentChunk.trim(),
      index: chunkIndex,
      heading: currentHeading || undefined,
    });
  }
  
  return chunks.filter(chunk => chunk.content.length > 10); // Filter out tiny chunks
}

// Generate embeddings for chunks
export async function embedChunks(chunks: TextChunk[]): Promise<EmbeddedChunk[]> {
  if (chunks.length === 0) return [];
  
  const contents = chunks.map(chunk => chunk.content);
  
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: contents,
  });
  
  return chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index],
  }));
}

// Generate single embedding for search queries
export async function embedQuery(query: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });
  
  return embedding;
}

// Maximal Marginal Relevance (MMR) for diverse results
export function maximalMarginalRelevance(
  queryEmbedding: number[],
  chunks: { embedding: number[]; [key: string]: any }[],
  k: number = 5,
  lambda: number = 0.7
): typeof chunks {
  if (chunks.length === 0) return [];
  
  const similarities = chunks.map(chunk => ({
    ...chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  
  // Sort by similarity
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  const selected: typeof similarities = [];
  const remaining = [...similarities];
  
  // Select first item (most similar)
  if (remaining.length > 0) {
    selected.push(remaining.shift()!);
  }
  
  // Select remaining items using MMR
  while (selected.length < k && remaining.length > 0) {
    let bestScore = -1;
    let bestIndex = -1;
    
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      
      // Calculate max similarity to already selected items
      const maxSimilarityToSelected = Math.max(
        ...selected.map(sel => cosineSimilarity(candidate.embedding, sel.embedding))
      );
      
      // MMR score: λ * sim(query, doc) - (1-λ) * max(sim(doc, selected))
      const mmrScore = lambda * candidate.similarity - (1 - lambda) * maxSimilarityToSelected;
      
      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIndex = i;
      }
    }
    
    if (bestIndex >= 0) {
      selected.push(remaining.splice(bestIndex, 1)[0]);
    }
  }
  
  return selected;
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

// Build context for AI chat with citations
export function buildContextWithCitations(
  chunks: { content: string; heading?: string; noteTitle: string }[],
  maxTokens: number = 3000
): { context: string; citations: { title: string; heading?: string }[] } {
  let context = '';
  const citations: { title: string; heading?: string }[] = [];
  let tokenCount = 0;
  
  for (const chunk of chunks) {
    const chunkTokens = estimateTokens(chunk.content);
    
    if (tokenCount + chunkTokens > maxTokens) break;
    
    context += `--- ${chunk.noteTitle}${chunk.heading ? ` > ${chunk.heading}` : ''} ---\n`;
    context += chunk.content + '\n\n';
    
    citations.push({
      title: chunk.noteTitle,
      heading: chunk.heading,
    });
    
    tokenCount += chunkTokens + 20; // +20 for separator tokens
  }
  
  return { context, citations };
}
