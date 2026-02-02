import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const stages = defineTable({
  name: v.string(),
  eventId: v.id('events'),
  format: v.string(),
  order: v.number(),
  settings: v.object({
    poolCount: v.number()
  })
}).index('by_event', ['eventId']);
