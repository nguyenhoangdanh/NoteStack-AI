import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("settings")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();
  },
});

export const update = mutation({
  args: {
    model: v.optional(v.string()),
    maxTokens: v.optional(v.number()),
    autoReembed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    const now = Date.now();

    if (existing) {
      const updates: any = { updatedAt: now };
      if (args.model !== undefined) updates.model = args.model;
      if (args.maxTokens !== undefined) updates.maxTokens = args.maxTokens;
      if (args.autoReembed !== undefined) updates.autoReembed = args.autoReembed;

      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      return await ctx.db.insert("settings", {
        ownerId: userId,
        model: args.model || "gpt-4o-mini",
        maxTokens: args.maxTokens || 4000,
        autoReembed: args.autoReembed ?? true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const getUsage = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const days = args.days || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateString = startDate.toISOString().split('T')[0];

    return await ctx.db
      .query("usage")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .filter((q) => q.gte(q.field("date"), startDateString))
      .collect();
  },
});
