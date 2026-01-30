import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getEventsByTournament = query({
  args: { tournamentId: v.id('tournaments') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('events')
      .withIndex('by_tournament', (q) =>
        q.eq('tournamentId', args.tournamentId)
      )
      .order('desc')
      .collect();
  }
});

export const getEventById = query({
  args: { id: v.id('events') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const createEvent = mutation({
  args: {
    name: v.string(),
    tournamentId: v.id('tournaments'),
    playerCap: v.number(),
    startDate: v.number(),
    endDate: v.number()
  },
  handler: async (ctx, args) => {
    try {
      const id = await ctx.db.insert('events', {
        name: args.name,
        tournamentId: args.tournamentId,
        playerCap: args.playerCap,
        startDate: args.startDate,
        endDate: args.endDate
      });

      console.log('Added new event with id:', id);
      return {
        success: true,
        message: 'Event created successfully'
      };
    } catch (error) {
      if (error instanceof ConvexError) {
        console.error(error.message);
        return {
          success: false,
          message: error.message
        };
      }
      console.error(error);
      return {
        success: false,
        message: 'Failed to create event'
      };
    }
  }
});

export const updateEvent = mutation({
  args: {
    id: v.id('events'),
    name: v.string(),
    playerCap: v.number(),
    startDate: v.number(),
    endDate: v.number()
  },
  handler: async (ctx, args) => {
    try {
      const { id, ...updates } = args;
      await ctx.db.patch(id, updates);
      return {
        success: true,
        message: `${args.name} updated successfully`
      };
    } catch (error) {
      if (error instanceof ConvexError) {
        console.error(error.message);
        return {
          success: false,
          message: error.message
        };
      }
      console.error(error);
      return {
        success: false,
        message: 'Failed to update event'
      };
    }
  }
});

export const deleteEvent = mutation({
  args: { id: v.id('events') },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id);
      return {
        success: true,
        message: 'Event deleted successfully'
      };
    } catch (error) {
      if (error instanceof ConvexError) {
        console.error(error.message);
        return {
          success: false,
          message: error.message
        };
      }
      console.error(error);
      return {
        success: false,
        message: 'Failed to delete event'
      };
    }
  }
});
