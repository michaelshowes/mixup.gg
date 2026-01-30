import { fetchQuery } from 'convex/nextjs';

import { CreateEventForm } from '@/components/forms/CreateEventForm';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default async function CreateEventPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await fetchQuery(api.tournaments.getTournamentBySlug, {
    slug
  });

  return (
    <div className='mx-auto max-w-2xl py-8'>
      <h1 className='mb-8 text-2xl font-bold'>Create Event</h1>
      <CreateEventForm tournamentId={tournament?._id as Id<'tournaments'>} slug={slug} />
    </div>
  );
}
