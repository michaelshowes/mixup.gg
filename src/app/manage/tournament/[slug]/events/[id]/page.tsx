import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import ManageEvent from './components/ManageEvent';

export default async function TournamentEventPage({
  params
}: {
  params: Promise<{ slug: string; id: Id<'events'> }>;
}) {
  const { slug, id } = await params;
  const data = await preloadQuery(api.events.getEventById, { id });

  return (
    <div>
      <ManageEvent
        preloadedData={data}
        slug={slug}
      />
    </div>
  );
}
