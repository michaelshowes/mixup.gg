import type { UserJSON } from '@clerk/nextjs/server';
import { Validator, v } from 'convex/values';

import { QueryCtx, internalMutation, query } from './_generated/server';

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  }
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('users').collect();
  }
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const profileImageUrl = data.public_metadata?.image_url as
      | string
      | undefined;

    const userAttributes = {
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
      fullName: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
      email: data.email_addresses[0].email_address,
      imageUrl: profileImageUrl ? profileImageUrl : data.image_url,
      gamertag: data.public_metadata?.gamertag as string | undefined
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert('users', userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  }
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  }
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byExternalId', (q) => q.eq('externalId', externalId))
    .unique();
}
