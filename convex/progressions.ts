import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('progressions')
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
      .collect();
  }
});

export const create = mutation({
  args: {
    eventId: v.id('events'),
    fromStageId: v.id('stages'),
    toStageId: v.id('stages'),
    qualifiersPerGroup: v.optional(v.number()),
    seeding: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('progressions', {
      eventId: args.eventId,
      fromStageId: args.fromStageId,
      toStageId: args.toStageId,
      rules: {
        qualifiersPerGroup: args.qualifiersPerGroup ?? 1,
        seeding: args.seeding ?? 'sequential'
      }
    });
  }
});

export const update = mutation({
  args: {
    id: v.id('progressions'),
    qualifiersPerGroup: v.optional(v.number()),
    seeding: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const progression = await ctx.db.get(args.id);
    if (!progression) throw new ConvexError('Progression not found');

    await ctx.db.patch(args.id, {
      rules: {
        qualifiersPerGroup:
          args.qualifiersPerGroup ?? progression.rules.qualifiersPerGroup,
        seeding: args.seeding ?? progression.rules.seeding
      }
    });

    return { success: true, message: 'Progression updated' };
  }
});

export const remove = mutation({
  args: { id: v.id('progressions') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
