'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

type Props = {
  preloadedData: Preloaded<typeof api.tournaments.getTournamentBySlug>;
};

export default function ManageTournamentPageClient({ preloadedData }: Props) {
  const tournament = usePreloadedQuery(preloadedData);

  function formatDate(date: number) {
    return new Date(date).toLocaleDateString();
  }

  return (
    <div>
      <h1 className={'text-2xl font-bold'}>{tournament?.name}</h1>
      <p>{tournament?.description}</p>
      <p>{formatDate(tournament?.startDate || 0)}</p>
    </div>
  );
}
