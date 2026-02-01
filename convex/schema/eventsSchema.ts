import { WithoutSystemFields, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { Doc } from '../_generated/dataModel';

export const events = defineTable({
  name: v.string(),
  tournamentId: v.id('tournaments'),
  game: v.object({
    id: v.id('games'),
    name: v.string(),
    cover: v.object({
      imageId: v.string(),
      height: v.number(),
      width: v.number()
    }),
    platforms: v.array(
      v.object({
        name: v.string(),
        slug: v.string()
      })
    )
  }),
  playerCap: v.number(),
  startDate: v.number(),
  endDate: v.number()
}).index('by_tournament', ['tournamentId']);

export type EventProps = WithoutSystemFields<Doc<'events'>>;
