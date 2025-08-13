/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules } from "convex/server";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as http from "../http.js";
import type * as notes from "../notes.js";
import type * as schema from "../schema.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";
import type * as vectors from "../vectors.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api: ApiFromModules<{
  auth: typeof auth;
  chat: typeof chat;
  http: typeof http;
  notes: typeof notes;
  schema: typeof schema;
  settings: typeof settings;
  users: typeof users;
  vectors: typeof vectors;
  workspaces: typeof workspaces;
}> = {} as any;
