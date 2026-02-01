'use client';

import Image from 'next/image';

import { Preloaded, usePreloadedQuery, useQuery } from 'convex/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

import EventSettings from './tabs/EventSettings';
import Overview from './tabs/Overview';

type Props = {
  preloadedData: Preloaded<typeof api.events.getEventById>;
  slug: string;
};

export default function ManageEvent({ preloadedData, slug }: Props) {
  const event = usePreloadedQuery(preloadedData) as Doc<'events'> | null;
  const game = useQuery(api.games.getById, event ? { id: event.game } : 'skip');
  const platforms = useQuery(api.platforms.list);

  if (!event) {
    return null;
  }

  const tabs = [
    {
      title: 'Overview',
      slug: 'overview',
      description: 'View details about the event.',
      component: <Overview event={event} />
    },
    {
      title: 'Analytics',
      slug: 'analytics',
      description:
        'Track performance and user engagement metrics. Monitor trends and identify growth opportunities.',
      component: <div>Analytics</div>
    },
    {
      title: 'Reports',
      slug: 'reports',
      description:
        'Generate and download your detailed reports. Export data in multiple formats for analysis.',
      component: <div>Reports</div>
    },
    {
      title: 'Settings',
      slug: 'settings',
      description: 'Manage your event settings.',
      component: (
        <EventSettings
          event={event}
          slug={slug}
        />
      )
    }
  ];

  return (
    <div className={'mx-auto max-w-[800px] space-y-10'}>
      <div className={'flex gap-4 border border-gray-200 bg-white p-2'}>
        <div className={'aspect-9/12 max-w-[200px]'}>
          {game ? (
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.imageId}.jpg`}
              alt={event?.name ?? 'Event Image'}
              width={game?.cover?.width ?? 100}
              height={game?.cover?.height ?? 100}
              unoptimized
            />
          ) : (
            <Skeleton className={'aspect-9/12 w-[200px]'} />
          )}
        </div>
        <div className={'w-full'}>
          <h2 className='text-2xl font-bold'>{event?.name}</h2>
          <div className={'flex gap-2'}>
            {event.eventPlatforms.map((platformId) => (
              <span
                key={platformId}
                className={'rounded-full bg-gray-200 px-2 text-xs font-medium'}
              >
                {platforms?.find((p) => p.id === platformId)?.name ?? 'Unknown'}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue='overview'>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.slug}
              value={tab.slug}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.slug}
            value={tab.slug}
          >
            <Card>
              <CardContent>
                <CardTitle>{tab.title}</CardTitle>
                <CardDescription>{tab.description}</CardDescription>
                {tab.component}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
