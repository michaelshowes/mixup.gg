import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';

import EventsTable from './components/EventsTable';
import TournamentDashboardHero from './components/TournamentDashboardHero';

export default async function ManageTournamentPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await preloadQuery(
    api.tournaments.getTournamentWithEventsBySlug,
    { slug }
  );

  return (
    <div className={'space-y-10'}>
      <TournamentDashboardHero preloadedData={tournament} />
      <div className={'space-y-4'}>
        <div>
          <h2 className='text-2xl font-bold uppercase'>Events</h2>
          <p className='text-sm text-gray-500'>
            Manage your events for the tournament
          </p>
        </div>
        <EventsTable preloadedData={tournament} />
      </div>
    </div>
  );
}
