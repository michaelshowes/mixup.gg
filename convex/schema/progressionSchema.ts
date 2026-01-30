import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const progressions = defineTable({
  fromStageId: v.id('stages'),
  toStageId: v.id('stages'),
  rules: v.object({
    qualifiersPerGroup: v.number(),
    seeding: v.string()
  })
});
