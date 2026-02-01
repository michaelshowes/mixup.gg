import { WithoutSystemFields, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Doc } from '../_generated/dataModel';

export const events = defineTable({
  name: v.string(),
  tournamentId: v.id('tournaments'),
  game: v.number(),
  description: v.optional(v.string()),
  eventPlatforms: v.array(v.number()),
  entrantCap: v.number(),
  startDate: v.number()
}).index('by_tournament', ['tournamentId']);

export type EventProps = WithoutSystemFields<Doc<'events'>>;
