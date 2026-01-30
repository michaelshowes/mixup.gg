/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as events from "../events.js";
import type * as http from "../http.js";
import type * as schema_entrantSchema from "../schema/entrantSchema.js";
import type * as schema_eventsSchema from "../schema/eventsSchema.js";
import type * as schema_groupSchema from "../schema/groupSchema.js";
import type * as schema_matchEventSchema from "../schema/matchEventSchema.js";
import type * as schema_matchSchema from "../schema/matchSchema.js";
import type * as schema_progressionSchema from "../schema/progressionSchema.js";
import type * as schema_stageSchema from "../schema/stageSchema.js";
import type * as schema_tournamentsSchema from "../schema/tournamentsSchema.js";
import type * as schema_usersSchema from "../schema/usersSchema.js";
import type * as tournaments from "../tournaments.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  events: typeof events;
  http: typeof http;
  "schema/entrantSchema": typeof schema_entrantSchema;
  "schema/eventsSchema": typeof schema_eventsSchema;
  "schema/groupSchema": typeof schema_groupSchema;
  "schema/matchEventSchema": typeof schema_matchEventSchema;
  "schema/matchSchema": typeof schema_matchSchema;
  "schema/progressionSchema": typeof schema_progressionSchema;
  "schema/stageSchema": typeof schema_stageSchema;
  "schema/tournamentsSchema": typeof schema_tournamentsSchema;
  "schema/usersSchema": typeof schema_usersSchema;
  tournaments: typeof tournaments;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
