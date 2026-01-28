import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const tournaments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tournaments').order('desc').collect();
  }
});

export const getTournamentBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('tournaments')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
  }
});

export const createTournament = mutation({
  // Validators for arguments.
  args: {
    name: v.string(),
    userId: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number()
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    const baseSlug = args.slug;
    let slug = baseSlug;
    let existing = await ctx.db
      .query('tournaments')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();

    if (existing) {
      let i = 1;
      while (existing) {
        slug = `${baseSlug}-${i}`;
        existing = await ctx.db
          .query('tournaments')
          .withIndex('by_slug', (q) => q.eq('slug', slug))
          .unique();
        i++;
      }
    }

    const id = await ctx.db.insert('tournaments', {
      name: args.name,
      userId: args.userId,
      slug,
      description: args.description,
      startDate: args.startDate,
      endDate: args.endDate
    });

    console.log('Added new tournament with id:', id);
    return id;
  }
});
