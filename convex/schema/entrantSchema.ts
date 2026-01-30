import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const entrants = defineTable({
  userId: v.id('users'),
  eventId: v.optional(v.id('events')),
  gamertag: v.string(),
  region: v.string(),
  checkedIn: v.boolean(),
  seedHint: v.optional(v.number())
})
  .index('by_user_id', ['userId'])
  .index('by_event_id_and_gamertag', ['eventId', 'gamertag']);
