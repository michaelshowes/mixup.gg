import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const tournaments = defineTable({
  name: v.string(),
  userId: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  startDate: v.number(),
  endDate: v.number()
}).index('by_slug', ['slug']);
