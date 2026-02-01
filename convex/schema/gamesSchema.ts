import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const games = defineTable({
  gameId: v.number(),
  name: v.string(),
  cover: v.object({
    imageId: v.string(),
    height: v.number(),
    width: v.number()
  }),
  platforms: v.array(v.number())
});
