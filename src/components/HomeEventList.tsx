'use client';

import EventCard from './shared/EventCard';

export default function HomeEventList({ events }: { events: any }) {
  return (
    <div
      className={
        'mx-auto grid max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'
      }
    >
      {events.map((event: any) => (
        <div key={event.id}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}
