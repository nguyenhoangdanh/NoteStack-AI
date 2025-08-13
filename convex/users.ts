import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    return await ctx.db.get(userId);
  },
});

export const createOrUpdateUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingUser = await ctx.db.get(userId);
    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(userId, {
        name: args.name || existingUser.name,
        email: args.email,
        image: args.image || existingUser.image,
        updatedAt: now,
      });
    } else {
      // Create new user and default workspace
      await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        image: args.image,
        createdAt: now,
        updatedAt: now,
      });

      await ctx.db.insert("workspaces", {
        name: "My Workspace",
        ownerId: userId,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      });

      // Create default settings
      await ctx.db.insert("settings", {
        ownerId: userId,
        model: "gpt-4o-mini",
        maxTokens: 4000,
        autoReembed: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    return userId;
  },
});
