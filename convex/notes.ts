import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    workspaceId: v.optional(v.id("workspaces")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let query = ctx.db
      .query("notes")
      .withIndex("by_owner_updated", (q) => q.eq("ownerId", userId))
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .order("desc");

    if (args.workspaceId) {
      query = query.filter((q) => q.eq(q.field("workspaceId"), args.workspaceId));
    }

    if (args.limit) {
      query = query.take(args.limit);
    }

    return await query.collect();
  },
});

export const get = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.id);
    if (!note || note.ownerId !== userId || note.isDeleted) {
      return null;
    }

    return note;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify workspace ownership
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.ownerId !== userId) {
      throw new Error("Workspace not found or not owned by user");
    }

    const now = Date.now();
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      tags: args.tags,
      workspaceId: args.workspaceId,
      ownerId: userId,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    return noteId;
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.id);
    if (!note || note.ownerId !== userId || note.isDeleted) {
      throw new Error("Note not found or not owned by user");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.tags !== undefined) updates.tags = args.tags;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.id);
    if (!note || note.ownerId !== userId) {
      throw new Error("Note not found or not owned by user");
    }

    // Soft delete
    await ctx.db.patch(args.id, {
      isDeleted: true,
      updatedAt: Date.now(),
    });

    // Also remove associated vectors
    const vectors = await ctx.db
      .query("vectors")
      .withIndex("by_note", (q) => q.eq("noteId", args.id))
      .collect();

    for (const vector of vectors) {
      await ctx.db.delete(vector._id);
    }

    return args.id;
  },
});

export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const limit = args.limit || 10;

    // Search in titles
    const titleResults = await ctx.db
      .query("notes")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.query).eq("ownerId", userId).eq("isDeleted", false)
      )
      .take(limit);

    // Search in content
    const contentResults = await ctx.db
      .query("notes")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.query).eq("ownerId", userId).eq("isDeleted", false)
      )
      .take(limit);

    // Combine and deduplicate results
    const allResults = [...titleResults, ...contentResults];
    const uniqueResults = allResults.filter(
      (note, index, self) => index === self.findIndex((n) => n._id === note._id)
    );

    return uniqueResults.slice(0, limit);
  },
});
