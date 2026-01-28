import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';

import ManageTournamentPageClient from './page.client';

export default async function ManageTournamentPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await preloadQuery(api.tournaments.getTournamentBySlug, {
    slug
  });

  return (
    <div className={'px-4'}>
      <ManageTournamentPageClient preloadedData={tournament} />
    </div>
  );
}
