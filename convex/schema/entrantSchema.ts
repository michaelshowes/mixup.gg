import { WithoutSystemFields, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Doc } from '../_generated/dataModel';

export const entrants = defineTable({
  userId: v.id('users'),
  eventId: v.id('events'),
  gamertag: v.string(),
  seedHint: v.optional(v.number())
})
  .index('by_user_id', ['userId'])
  .index('by_event_id_and_gamertag', ['eventId', 'gamertag'])
  .index('by_event', ['eventId']);

export type EntrantProps = WithoutSystemFields<Doc<'entrants'>>;
