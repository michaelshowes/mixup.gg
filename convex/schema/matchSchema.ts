import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const matches = defineTable({
  groupId: v.id('groups'),
  round: v.number(),
  bracket: v.string(),
  slotA: v.nullable(v.id('entrants')),
  slotB: v.nullable(v.id('entrants')),
  bestOf: v.number(),
  status: v.string(),
  station: v.optional(v.string()),
  winnerId: v.optional(v.id('entrants')),
  scoreA: v.optional(v.number()),
  scoreB: v.optional(v.number())
});
