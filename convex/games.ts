import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('games').order('desc').collect();
  }
});

export const add = mutation({
  args: {
    gameId: v.number(),
    name: v.string(),
    cover: v.object({
      imageId: v.string(),
      height: v.number(),
      width: v.number()
    }),
    platforms: v.array(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('games', {
      gameId: args.gameId,
      name: args.name,
      cover: args.cover,
      platforms: args.platforms
    });
  }
});

export const getGameById = query({
  args: { id: v.id('games') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});
