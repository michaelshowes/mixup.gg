import { WithoutSystemFields, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Doc } from '../_generated/dataModel';

export const events = defineTable({
  name: v.string(),
  tournamentId: v.id('tournaments'),
  playerCap: v.number(),
  startDate: v.number(),
  endDate: v.number()
}).index('by_tournament', ['tournamentId']);

export type EventProps = WithoutSystemFields<Doc<'events'>>;
