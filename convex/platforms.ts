import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('platforms').collect();
  }
});

export const add = mutation({
  args: {
    id: v.number(),
    name: v.string(),
    slug: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('platforms', {
      id: args.id,
      name: args.name,
      slug: args.slug
    });
  }
});

export const update = mutation({
  args: {
    id: v.id('platforms'),
    name: v.string(),
    slug: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      name: args.name,
      slug: args.slug
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('platforms')
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
