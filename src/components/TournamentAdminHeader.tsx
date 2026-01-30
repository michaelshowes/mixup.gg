'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { TournamentProps } from '@/convex/schema/tournamentsSchema';
import { formatDate } from '@/helpers/formatDate';

type Props = {
  preloadedData: Preloaded<
    typeof api.tournaments.getTournamentWithEventsBySlug
  >;
};

export default function TournamentAdminHeader({ preloadedData }: Props) {
  const tournament = usePreloadedQuery(preloadedData) as TournamentProps;

  return (
    <header className={'border border-gray-300 bg-gray-200'}>
      <div className={'p-4'}>
        <h1 className={'text-2xl font-bold'}>{tournament.name}</h1>
        <p className={'text-sm'}>
          {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
        </p>
      </div>
    </header>
  );
}
