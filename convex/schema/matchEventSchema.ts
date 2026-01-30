import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const matchEvents = defineTable({
  matchId: v.id('matches'),
  type: v.string(),
  payload: v.object({
    scoreA: v.optional(v.number()),
    scoreB: v.optional(v.number()),
    winnerId: v.optional(v.id('entrants'))
  })
});
