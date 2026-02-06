import { preloadQuery } from 'convex/nextjs';

import TournamentAdminHeader from '@/components/TournamentAdminHeader';
import ContentContainer from '@/components/layout/ContentContainer';
import { api } from '@/convex/_generated/api';

export default async function ManageTournamentLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await preloadQuery(
    api.tournaments.getTournamentWithEventsBySlug,
    { slug }
  );

  return (
    <ContentContainer className={'min-h-[calc(100%-84px)] space-y-4'}>
      <TournamentAdminHeader preloadedData={tournament} />
      <main>{children}</main>
    </ContentContainer>
  );
}
