import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    isDefault: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  notes: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    workspaceId: v.id("workspaces"),
    ownerId: v.id("users"),
    isDeleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_owner_updated", ["ownerId", "updatedAt"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "isDeleted"],
    })
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["ownerId", "isDeleted"],
    }),

  vectors: defineTable({
    noteId: v.id("notes"),
    chunkId: v.string(),
    chunkContent: v.string(),
    chunkIndex: v.number(),
    heading: v.optional(v.string()),
    embedding: v.array(v.number()),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_note", ["noteId"])
    .index("by_owner", ["ownerId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["ownerId"],
    }),

  settings: defineTable({
    ownerId: v.id("users"),
    model: v.string(),
    maxTokens: v.number(),
    autoReembed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  usage: defineTable({
    ownerId: v.id("users"),
    date: v.string(), // YYYY-MM-DD format
    embeddingTokens: v.number(),
    chatTokens: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_date", ["ownerId", "date"]),
});
