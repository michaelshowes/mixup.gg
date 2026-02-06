import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getByStage = query({
  args: { stageId: v.id('stages') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('groups')
      .withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
      .order('asc')
      .collect();
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    stageId: v.id('stages'),
    order: v.number(),
    status: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('groups', {
      name: args.name,
      stageId: args.stageId,
      order: args.order,
      status: args.status
    });
  }
});
