import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';

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
    <div>
      <h2 className={'text-2xl font-bold uppercase'}>Dashboard</h2>
    </div>
  );
}
