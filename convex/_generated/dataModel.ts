/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { GenericId } from "convex/values";

/**
 * No-op utility type.
 */
export type Id<T extends string = any> = GenericId<T>;
export type Doc<T extends string = any> = any;

export interface DataModel {
  authAccounts: any;
  authSessions: any;
  authVerificationCodes: any;
  authVerifiers: any;
  users: {
    _id: Id<"users">;
    name?: string;
    email: string;
    image?: string;
    createdAt: number;
    updatedAt: number;
  };
  workspaces: {
    _id: Id<"workspaces">;
    name: string;
    ownerId: Id<"users">;
    isDefault: boolean;
    createdAt: number;
    updatedAt: number;
  };
  notes: {
    _id: Id<"notes">;
    title: string;
    content: string;
    tags: string[];
    workspaceId: Id<"workspaces">;
    ownerId: Id<"users">;
    isDeleted: boolean;
    createdAt: number;
    updatedAt: number;
  };
  vectors: {
    _id: Id<"vectors">;
    noteId: Id<"notes">;
    chunkId: string;
    chunkContent: string;
    chunkIndex: number;
    heading?: string;
    embedding: number[];
    ownerId: Id<"users">;
    createdAt: number;
  };
  settings: {
    _id: Id<"settings">;
    ownerId: Id<"users">;
    model: string;
    maxTokens: number;
    autoReembed: boolean;
    createdAt: number;
    updatedAt: number;
  };
  usage: {
    _id: Id<"usage">;
    ownerId: Id<"users">;
    date: string;
    embeddingTokens: number;
    chatTokens: number;
    createdAt: number;
    updatedAt: number;
  };
}
