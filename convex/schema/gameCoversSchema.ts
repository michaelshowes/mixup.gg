import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const gameCovers = defineTable({
  externalId: v.number(),
  alphaChannel: v.boolean(),
  gameId: v.number(),
  height: v.number(),
  imageId: v.string(),
  url: v.string(),
  width: v.number()
});
