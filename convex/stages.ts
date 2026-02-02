import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    name: v.string(),
    eventId: v.id('events'),
    format: v.string()
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert('stages', {
        name: args.name,
        eventId: args.eventId,
        format: args.format,
        order: 0,
        settings: {
          poolCount: 0
        }
      });
      return {
        success: true,
        message: 'Stage created successfully'
      };
    } catch (error) {
      if (error instanceof ConvexError) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to create stage'
      };
    }
  }
});

export const get = query({
  args: { id: v.id('stages') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('stages')
      .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
      .order('asc')
      .collect();
  }
});

export const remove = mutation({
  args: { id: v.id('stages') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
