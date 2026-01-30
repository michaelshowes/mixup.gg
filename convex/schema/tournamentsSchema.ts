import { WithoutSystemFields, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Doc } from '../_generated/dataModel';

export const tournaments = defineTable({
  name: v.string(),
  userId: v.id('users'),
  slug: v.string(),
  description: v.optional(v.string()),
  startDate: v.number(),
  endDate: v.number()
}).index('by_slug', ['slug']);

export type TournamentProps = WithoutSystemFields<Doc<'tournaments'>>;
