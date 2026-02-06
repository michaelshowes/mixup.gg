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
  const event = await preloadQuery(api.events.getEventById, { id });
  const game = await preloadQuery(api.games.getById, {
    // @ts-expect-error - event is a string
    id: event?._valueJSON.game
  });
  const entrants = await preloadQuery(api.entrants.getByEvent, { eventId: id });
  const stages = await preloadQuery(api.stages.getByEvent, { eventId: id });
  const platforms = await preloadQuery(api.platforms.list);

  return (
    <div>
      <ManageEvent
        preloadedEvent={event}
        preloadedStages={stages}
        preloadedEntrants={entrants}
        preloadedGame={game}
        preloadedPlatforms={platforms}
        slug={slug}
      />
    </div>
  );
}
