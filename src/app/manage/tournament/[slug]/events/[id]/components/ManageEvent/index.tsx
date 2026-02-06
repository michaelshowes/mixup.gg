'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

import Bracketing from './tabs/Bracketing';
import Entrants from './tabs/Entrants';
import Overview from './tabs/Overview';
import Seeding from './tabs/Seeding';
import Settings from './tabs/Settings';

type Props = {
  preloadedEvent: Preloaded<typeof api.events.getEventById>;
  preloadedStages: Preloaded<typeof api.stages.getByEvent>;
  preloadedEntrants: Preloaded<typeof api.entrants.getByEvent>;
  preloadedGame: Preloaded<typeof api.games.getById>;
  slug: string;
};

const validTabs = ['overview', 'entrants', 'seeding', 'bracketing', 'settings'];

export default function ManageEvent({
  preloadedEvent,
  preloadedStages,
  preloadedEntrants,
  preloadedGame,
  slug
}: Props) {
  const event = usePreloadedQuery(preloadedEvent) as Doc<'events'> | null;
  const stages = usePreloadedQuery(preloadedStages) as Doc<'stages'>[];
  const game = usePreloadedQuery(preloadedGame) as Doc<'games'> | null;
  const entrants = usePreloadedQuery(preloadedEntrants) as Doc<'entrants'>[];
  // const game = useQuery(api.games.getById, event ? { id: event.game } : 'skip');
  const platforms = useQuery(api.platforms.list);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab =
    tabParam && validTabs.includes(tabParam) ? tabParam : 'overview';

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  if (!event) return null;

  const tabs = [
    {
      title: 'Overview',
      slug: 'overview',
      description: 'View details about the event.',
      component: <Overview event={event} />
    },
    {
      title: 'Entrants',
      slug: 'entrants',
      description: 'Manage your event entrants.',
      component: <Entrants preloadedEntrants={preloadedEntrants} />
    },
    {
      title: 'Seeding',
      slug: 'seeding',
      description: 'Manage your event seeding and rankings.',
      component: <Seeding preloadedEntrants={preloadedEntrants} />
    },
    {
      title: 'Bracketing',
      slug: 'bracketing',
      description: 'Manage your event brackets and schedule.',
      component: (
        <Bracketing
          preloadedStages={preloadedStages}
          eventId={event._id}
        />
      )
    },
    {
      title: 'Settings',
      slug: 'settings',
      description: 'Manage your event settings.',
      component: (
        <Settings
          event={event}
          slug={slug}
        />
      )
    }
  ];

  return (
    <div className={'mx-auto max-w-[1600px] space-y-10'}>
      <div
        className={
          'grid min-h-[calc(100%-90px)] items-start gap-4 md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]'
        }
      >
        <div
          className={
            'gap-2 border border-gray-200 bg-white max-md:flex md:mt-11'
          }
        >
          {game ? (
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.imageId}.jpg`}
              alt={event?.name ?? 'Event Image'}
              width={game?.cover?.width ?? 100}
              height={game?.cover?.height ?? 100}
              unoptimized
              className={'max-md:max-w-[100px]'}
            />
          ) : (
            <Skeleton className={'aspect-9/12 w-[200px]'} />
          )}
          <div className={'px-4 py-2'}>
            <h2 className='font-bold lg:text-xl'>{event?.name}</h2>
            <p className={'mb-2 text-sm text-gray-500'}>{game?.name}</p>
            <div className={'flex gap-2'}>
              {event.eventPlatforms.map((platformId) => (
                <span
                  key={platformId}
                  className={
                    'rounded-full bg-gray-200 px-2 text-xs font-medium'
                  }
                >
                  {platforms?.find((p) => p.id === platformId)?.name ??
                    'Unknown'}
                </span>
              ))}
            </div>
            <div>
              <p className={'text-sm font-semibold'}>
                Entries: {entrants.length}/{event.entrantCap}
              </p>
            </div>
          </div>
        </div>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className={'mx-auto'}>
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
                    <div className={'mb-4'}>
                      <CardTitle className={'text-lg'}>{tab.title}</CardTitle>
                      <CardDescription>{tab.description}</CardDescription>
                    </div>
                    {tab.component}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
