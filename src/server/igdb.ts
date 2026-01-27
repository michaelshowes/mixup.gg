'use server';

import { IGame } from '@/types/games';

type GetGamesParams = {
  fields?: string[];
  where: string;
  exclude?: string[];
  search?: string;
  limit?: number;
  offset?: number;
  sort?: string;
};

export async function igdb({
  fields,
  where,
  exclude,
  search,
  limit,
  offset,
  sort
}: GetGamesParams) {
  // Build raw text query string for IGDB API
  const queryParts: string[] = [];

  if (fields && fields.length > 0) {
    queryParts.push(`fields ${fields.join(',')};`);
  } else {
    queryParts.push('fields *;');
  }

  if (where) {
    queryParts.push(`where ${where};`);
  }

  if (exclude && exclude.length > 0) {
    queryParts.push(`exclude ${exclude.join(',')};`);
  }

  if (search) {
    queryParts.push(`search "${search}";`);
  }

  if (limit) {
    queryParts.push(`limit ${limit};`);
  }

  if (offset) {
    queryParts.push(`offset ${offset};`);
  }

  if (sort) {
    queryParts.push(`sort ${sort};`);
  }

  const body = queryParts.join(' ');

  const res = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_APP_CLIENT_ID!,
      Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN!}`
    },
    body
  });

  return res.json() as Promise<IGame[]>;
}
