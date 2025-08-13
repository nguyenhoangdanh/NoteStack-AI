import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user;
  },
});

export const createUser = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      image: args.image,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create default workspace
    await ctx.db.insert("workspaces", {
      name: "My Workspace",
      ownerId: userId,
      isDefault: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create default settings
    await ctx.db.insert("settings", {
      ownerId: userId,
      model: "gpt-4o-mini",
      maxTokens: 4000,
      autoReembed: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(userId, {
      ...args,
      updatedAt: Date.now(),
    });

    return userId;
  },
});
