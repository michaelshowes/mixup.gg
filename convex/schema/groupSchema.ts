import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const groups = defineTable({
  name: v.string(),
  stageId: v.id('stages'),
  order: v.number(),
  status: v.string()
}).index('by_stage', ['stageId']);
