/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as entrants from "../entrants.js";
import type * as events from "../events.js";
import type * as games from "../games.js";
import type * as http from "../http.js";
import type * as platforms from "../platforms.js";
import type * as schema_entrantSchema from "../schema/entrantSchema.js";
import type * as schema_eventsSchema from "../schema/eventsSchema.js";
import type * as schema_gameCoversSchema from "../schema/gameCoversSchema.js";
import type * as schema_gamesSchema from "../schema/gamesSchema.js";
import type * as schema_groupSchema from "../schema/groupSchema.js";
import type * as schema_matchEventSchema from "../schema/matchEventSchema.js";
import type * as schema_matchSchema from "../schema/matchSchema.js";
import type * as schema_platformSchema from "../schema/platformSchema.js";
import type * as schema_progressionSchema from "../schema/progressionSchema.js";
import type * as schema_stageSchema from "../schema/stageSchema.js";
import type * as schema_tournamentsSchema from "../schema/tournamentsSchema.js";
import type * as schema_usersSchema from "../schema/usersSchema.js";
import type * as stages from "../stages.js";
import type * as tournaments from "../tournaments.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  entrants: typeof entrants;
  events: typeof events;
  games: typeof games;
  http: typeof http;
  platforms: typeof platforms;
  "schema/entrantSchema": typeof schema_entrantSchema;
  "schema/eventsSchema": typeof schema_eventsSchema;
  "schema/gameCoversSchema": typeof schema_gameCoversSchema;
  "schema/gamesSchema": typeof schema_gamesSchema;
  "schema/groupSchema": typeof schema_groupSchema;
  "schema/matchEventSchema": typeof schema_matchEventSchema;
  "schema/matchSchema": typeof schema_matchSchema;
  "schema/platformSchema": typeof schema_platformSchema;
  "schema/progressionSchema": typeof schema_progressionSchema;
  "schema/stageSchema": typeof schema_stageSchema;
  "schema/tournamentsSchema": typeof schema_tournamentsSchema;
  "schema/usersSchema": typeof schema_usersSchema;
  stages: typeof stages;
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
