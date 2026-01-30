import { defineSchema } from 'convex/server';

import { entrants } from './schema/entrantSchema';
import { events } from './schema/eventsSchema';
import { groups } from './schema/groupSchema';
import { matchEvents } from './schema/matchEventSchema';
import { matches } from './schema/matchSchema';
import { progressions } from './schema/progressionSchema';
import { stages } from './schema/stageSchema';
import { tournaments } from './schema/tournamentsSchema';
import { users } from './schema/usersSchema';

export default defineSchema({
  users,
  tournaments,
  events,
  entrants,
  groups,
  stages,
  matches,
  matchEvents,
  progressions
});
