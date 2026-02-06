import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const addEntrant = mutation({
  args: {
    eventId: v.id('events'),
    userId: v.id('users'),
    gamertag: v.string()
  },
  handler: async (ctx, { eventId, userId, gamertag }) => {
    const entrants = await ctx.db
      .query('entrants')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect();
    const initialSeed = entrants.length + 1;

    try {
      return await ctx.db.insert('entrants', {
        userId,
        gamertag,
        eventId,
        seedHint: initialSeed
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add entrant');
    }
  }
});

export const getByEvent = query({
  args: { eventId: v.id('events') },
  handler: async (ctx, { eventId }) => {
    const entrants = await ctx.db
      .query('entrants')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect();

    // Join with user data
    const entrantsWithUsers = await Promise.all(
      entrants.map(async (entrant) => {
        const user = await ctx.db.get(entrant.userId);
        return {
          ...entrant,
          user: user
            ? {
                fullName: user.fullName,
                imageUrl: user.imageUrl
              }
            : null
        };
      })
    );

    // Sort by seedHint (nulls last)
    return entrantsWithUsers.sort((a, b) => {
      if (a.seedHint === undefined && b.seedHint === undefined) return 0;
      if (a.seedHint === undefined) return 1;
      if (b.seedHint === undefined) return -1;
      return a.seedHint - b.seedHint;
    });
  }
});

export const updateSeeding = mutation({
  args: {
    seeds: v.array(
      v.object({
        entrantId: v.id('entrants'),
        seedHint: v.number()
      })
    )
  },
  handler: async (ctx, { seeds }) => {
    await Promise.all(
      seeds.map(({ entrantId, seedHint }) =>
        ctx.db.patch(entrantId, { seedHint })
      )
    );

    return { success: true, message: 'Seeding updated successfully' };
  }
});

export const clearSeeding = mutation({
  args: { eventId: v.id('events') },
  handler: async (ctx, { eventId }) => {
    const entrants = await ctx.db
      .query('entrants')
      .withIndex('by_event', (q) => q.eq('eventId', eventId))
      .collect();

    await Promise.all(
      entrants.map((entrant) =>
        ctx.db.patch(entrant._id, { seedHint: undefined })
      )
    );

    return { success: true, message: 'Seeding cleared successfully' };
  }
});

export const removeEntrant = mutation({
  args: { entrantId: v.id('entrants') },
  handler: async (ctx, { entrantId }) => {
    await ctx.db.delete(entrantId);
    return { success: true, message: 'Entrant removed successfully' };
  }
});
