import { getAuthUserId } from "@convex-dev/auth/server";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { chunkText, embedChunks, embedQuery, maximalMarginalRelevance, buildContextWithCitations } from "./lib/rag";

export const processNoteForRAG = action({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the note
    const note = await ctx.runQuery(api.notes.get, { id: args.noteId });
    if (!note) throw new Error("Note not found");

    // Remove existing vectors for this note
    await ctx.runMutation(api.vectors.deleteByNote, { noteId: args.noteId });

    // Skip processing if note is empty
    if (!note.content.trim()) return;

    // Chunk the content
    const chunks = chunkText(note.content, args.noteId);
    if (chunks.length === 0) return;

    // Generate embeddings
    const embeddedChunks = await embedChunks(chunks);

    // Store vectors in batches
    for (const chunk of embeddedChunks) {
      await ctx.runMutation(api.vectors.create, {
        noteId: args.noteId,
        chunkId: chunk.id,
        chunkContent: chunk.content,
        chunkIndex: chunk.index,
        heading: chunk.heading,
        embedding: chunk.embedding,
      });
    }

    // Update usage tracking
    const today = new Date().toISOString().split('T')[0];
    const totalTokens = embeddedChunks.reduce((sum, chunk) => 
      sum + Math.ceil(chunk.content.length / 4), 0
    );
    
    await ctx.runMutation(api.vectors.updateUsage, {
      date: today,
      embeddingTokens: totalTokens,
    });
  },
});

export const create = mutation({
  args: {
    noteId: v.id("notes"),
    chunkId: v.string(),
    chunkContent: v.string(),
    chunkIndex: v.number(),
    heading: v.optional(v.string()),
    embedding: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("vectors", {
      noteId: args.noteId,
      chunkId: args.chunkId,
      chunkContent: args.chunkContent,
      chunkIndex: args.chunkIndex,
      heading: args.heading,
      embedding: args.embedding,
      ownerId: userId,
      createdAt: Date.now(),
    });
  },
});

export const deleteByNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const vectors = await ctx.db
      .query("vectors")
      .withIndex("by_note", (q) => q.eq("noteId", args.noteId))
      .filter((q) => q.eq(q.field("ownerId"), userId))
      .collect();

    for (const vector of vectors) {
      await ctx.db.delete(vector._id);
    }
  },
});

export const semanticSearch = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const limit = args.limit || 8;

    // Generate query embedding
    const queryEmbedding = await embedQuery(args.query);

    // Vector search
    const results = await ctx.vectorSearch("vectors", "by_embedding", {
      vector: queryEmbedding,
      limit: limit * 2, // Get more results for MMR filtering
      filter: (q) => q.eq("ownerId", userId),
    });

    // Apply MMR for diversity
    const diverseResults = maximalMarginalRelevance(
      queryEmbedding,
      results.map(r => ({ ...r._doc, similarity: r._score })),
      limit,
      0.7
    );

    // Get note titles for context
    const enrichedResults = [];
    for (const result of diverseResults) {
      const note = await ctx.runQuery(api.notes.get, { id: result.noteId });
      if (note) {
        enrichedResults.push({
          ...result,
          noteTitle: note.title,
        });
      }
    }

    return enrichedResults;
  },
});

export const buildChatContext = action({
  args: {
    query: v.string(),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const maxTokens = args.maxTokens || 3000;

    // Get relevant chunks via semantic search
    const relevantChunks = await ctx.runAction(api.vectors.semanticSearch, {
      query: args.query,
      limit: 8,
    });

    // Build context with citations
    const { context, citations } = buildContextWithCitations(
      relevantChunks.map(chunk => ({
        content: chunk.chunkContent,
        heading: chunk.heading,
        noteTitle: chunk.noteTitle,
      })),
      maxTokens
    );

    return { context, citations };
  },
});

export const updateUsage = mutation({
  args: {
    date: v.string(),
    embeddingTokens: v.optional(v.number()),
    chatTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("usage")
      .withIndex("by_owner_date", (q) => 
        q.eq("ownerId", userId).eq("date", args.date)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        embeddingTokens: existing.embeddingTokens + (args.embeddingTokens || 0),
        chatTokens: existing.chatTokens + (args.chatTokens || 0),
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("usage", {
        ownerId: userId,
        date: args.date,
        embeddingTokens: args.embeddingTokens || 0,
        chatTokens: args.chatTokens || 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
