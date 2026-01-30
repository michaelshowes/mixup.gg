import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const users = defineTable({
  firstName: v.string(),
  lastName: v.string(),
  fullName: v.string(),
  externalId: v.string(),
  email: v.string(),
  imageUrl: v.optional(v.string()),
  gamertag: v.optional(v.string())
}).index('byExternalId', ['externalId']);
