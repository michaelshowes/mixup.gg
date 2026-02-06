import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    name: v.string(),
    eventId: v.id('events'),
    format: v.string(),
    poolCount: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const poolCount = args.poolCount ?? 1;

    try {
      const existingStages = await ctx.db
        .query('stages')
        .withIndex('by_event', (q) => q.eq('eventId', args.eventId))
        .collect();

      const order = existingStages.length;

      const stageId = await ctx.db.insert('stages', {
        name: args.name,
        eventId: args.eventId,
        format: args.format,
        order,
        settings: {
          poolCount
        }
      });

      for (let i = 0; i < poolCount; i++) {
        await ctx.db.insert('groups', {
          name: `Pool ${i + 1}`,
          stageId,
          order: i,
          status: 'pending'
        });
      }

      // Auto-create progression from previous stage if one exists
      if (order > 0) {
        const previousStage = existingStages.find((s) => s.order === order - 1);
        if (previousStage) {
          await ctx.db.insert('progressions', {
            eventId: args.eventId,
            fromStageId: previousStage._id,
            toStageId: stageId,
            rules: {
              qualifiersPerGroup: 1,
              seeding: 'sequential'
            }
          });
        }
      }

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

export const updatePoolCount = mutation({
  args: {
    id: v.id('stages'),
    poolCount: v.number()
  },
  handler: async (ctx, args) => {
    const stage = await ctx.db.get(args.id);
    if (!stage) throw new ConvexError('Stage not found');

    const existingGroups = await ctx.db
      .query('groups')
      .withIndex('by_stage', (q) => q.eq('stageId', args.id))
      .order('asc')
      .collect();

    const currentCount = existingGroups.length;
    const newCount = args.poolCount;

    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        await ctx.db.insert('groups', {
          name: `Pool ${i + 1}`,
          stageId: args.id,
          order: i,
          status: 'pending'
        });
      }
    } else if (newCount < currentCount) {
      const toRemove = existingGroups.slice(newCount);
      await Promise.all(toRemove.map((g) => ctx.db.delete(g._id)));
    }

    await ctx.db.patch(args.id, {
      settings: { poolCount: newCount }
    });

    return { success: true, message: 'Pool count updated' };
  }
});

export const remove = mutation({
  args: { id: v.id('stages') },
  handler: async (ctx, args) => {
    const stage = await ctx.db.get(args.id);
    if (!stage) throw new ConvexError('Stage not found');

    // Delete groups belonging to this stage
    const groups = await ctx.db
      .query('groups')
      .withIndex('by_stage', (q) => q.eq('stageId', args.id))
      .collect();

    await Promise.all(groups.map((group) => ctx.db.delete(group._id)));

    // Find progressions involving this stage
    const fromProgressions = await ctx.db
      .query('progressions')
      .withIndex('by_fromStage', (q) => q.eq('fromStageId', args.id))
      .collect();

    const toProgressions = await ctx.db
      .query('progressions')
      .withIndex('by_toStage', (q) => q.eq('toStageId', args.id))
      .collect();

    // If this is a middle stage (has both incoming and outgoing), re-link
    if (toProgressions.length === 1 && fromProgressions.length === 1) {
      const incoming = toProgressions[0];
      const outgoing = fromProgressions[0];

      await ctx.db.insert('progressions', {
        eventId: stage.eventId,
        fromStageId: incoming.fromStageId,
        toStageId: outgoing.toStageId,
        rules: incoming.rules
      });
    }

    // Delete all progressions involving this stage
    await Promise.all([
      ...fromProgressions.map((p) => ctx.db.delete(p._id)),
      ...toProgressions.map((p) => ctx.db.delete(p._id))
    ]);

    // Delete the stage
    await ctx.db.delete(args.id);

    // Reindex order values for remaining stages
    const remainingStages = await ctx.db
      .query('stages')
      .withIndex('by_event', (q) => q.eq('eventId', stage.eventId))
      .order('asc')
      .collect();

    // Sort by current order to maintain relative ordering
    remainingStages.sort((a, b) => a.order - b.order);

    await Promise.all(
      remainingStages.map((s, i) => {
        if (s.order !== i) {
          return ctx.db.patch(s._id, { order: i });
        }
      })
    );

    return { success: true, message: 'Stage deleted' };
  }
});
