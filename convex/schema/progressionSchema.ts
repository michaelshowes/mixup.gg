import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const progressions = defineTable({
  eventId: v.id('events'),
  fromStageId: v.id('stages'),
  toStageId: v.id('stages'),
  rules: v.object({
    qualifiersPerGroup: v.number(),
    seeding: v.string()
  })
})
  .index('by_event', ['eventId'])
  .index('by_fromStage', ['fromStageId'])
  .index('by_toStage', ['toStageId']);
