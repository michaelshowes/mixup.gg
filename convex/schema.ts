import { defineSchema } from 'convex/server';

import { tournaments } from './schema/tournamentsSchema';
import { users } from './schema/usersSchema';

export default defineSchema({
  users,
  tournaments
});
