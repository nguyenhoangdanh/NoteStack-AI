import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    authProvider: v.union(v.literal("credentials"), v.literal("google")),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const passwordHash = args.password 
      ? await bcrypt.hash(args.password, 12)
      : undefined;

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      image: args.image,
      authProvider: args.authProvider,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    // Create default workspace
    await ctx.db.insert("workspaces", {
      name: `${args.name}'s Workspace`,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

export const authenticateUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || user.authProvider !== "credentials" || !user.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Create session
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return { token, user: { ...user, passwordHash: undefined } };
  },
});

export const createSession = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("sessions", {
      userId: args.userId,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return token;
  },
});

export const validateSession = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    return { ...user, passwordHash: undefined };
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) return null;

    return { ...user, passwordHash: undefined };
  },
});

export const deleteSession = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});
