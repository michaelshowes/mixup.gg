'use client';

import Image from 'next/image';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { CopyIcon } from 'lucide-react';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

type Props = {
  preloadedData: Preloaded<typeof api.tournaments.getTournamentBySlug>;
};

export default function TournamentDashboardHero({ preloadedData }: Props) {
  const tournament = usePreloadedQuery(preloadedData) as Doc<'tournaments'>;
  const { CopyButton } = useCopyToClipboard();

  return (
    <section
      className={
        'flex flex-col gap-4 border border-gray-200 bg-white p-4 lg:flex-row'
      }
    >
      <div>
        <Image
          src={'https://placehold.co/420x260?text=Tournament+Image'}
          alt={tournament.name}
          width={420}
          height={260}
          unoptimized
        />
      </div>
      <div className={'flex-1'}>
        <h2 className={'font-semibold'}>{tournament.name}</h2>
        <div className={'flex items-center gap-2'}>
          <p className={'text-sm text-gray-500'}>
            https://mixup.gg/tournament/{tournament.slug}
          </p>
          <CopyButton
            text={`https://mixup.gg/tournament/${tournament.slug}`}
            className={'text-sm text-gray-500'}
          >
            <CopyIcon size={12} />
          </CopyButton>
        </div>
      </div>
    </section>
  );
}
