import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const users = defineTable({
  name: v.string(),
  externalId: v.string()
}).index('byExternalId', ['externalId']);
