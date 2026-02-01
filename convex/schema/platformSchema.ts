import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const platforms = defineTable({
  id: v.number(),
  name: v.string(),
  slug: v.string()
});
