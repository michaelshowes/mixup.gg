'use client';

import { useState } from 'react';

import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery
} from 'convex/react';
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';

import CreateStageForm from '@/components/forms/CreateStageForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

type Entrant = Doc<'entrants'> & {
  user: { fullName: string; imageUrl: string } | null;
};

function snakeSeed(entrants: Entrant[], poolCount: number): Entrant[][] {
  const pools: Entrant[][] = Array.from({ length: poolCount }, () => []);

  for (let i = 0; i < entrants.length; i++) {
    const round = Math.floor(i / poolCount);
    const forward = round % 2 === 0;
    const posInRound = i % poolCount;
    const poolIndex = forward ? posInRound : poolCount - 1 - posInRound;
    pools[poolIndex].push(entrants[i]);
  }

  return pools;
}

const POOL_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500'
];

function PoolCard({
  group,
  entrants,
  colorIndex
}: {
  group: Doc<'groups'>;
  entrants: Entrant[];
  colorIndex: number;
}) {
  const color = POOL_COLORS[colorIndex % POOL_COLORS.length];

  return (
    <div className='overflow-hidden rounded-lg border border-gray-200'>
      <div className={cn('px-3 py-2 text-sm font-semibold text-white', color)}>
        {group.name}
      </div>
      <div className='divide-y divide-gray-100'>
        {entrants.length === 0 ? (
          <div className='px-3 py-2 text-sm text-gray-400'>No entrants</div>
        ) : (
          entrants.map((entrant) => (
            <div
              key={entrant._id}
              className='flex items-center gap-3 px-3 py-1.5 text-sm'
            >
              <span className='w-6 text-right text-xs text-gray-400'>
                {entrant.seedHint ?? '-'}
              </span>
              <span className='truncate font-medium'>{entrant.gamertag}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PoolCountEditor({ stage }: { stage: Doc<'stages'> }) {
  const updatePoolCount = useMutation(api.stages.updatePoolCount);
  const poolCount = stage.settings.poolCount;

  async function handleChange(delta: number) {
    const newCount = poolCount + delta;
    if (newCount < 1 || newCount > 64) return;
    await updatePoolCount({ id: stage._id, poolCount: newCount });
  }

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-gray-500'>Pools:</span>
      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='icon'
          className='size-7'
          onClick={() => handleChange(-1)}
          disabled={poolCount <= 1}
        >
          <MinusIcon className='size-3' />
        </Button>
        <span className='w-8 text-center text-sm font-medium'>{poolCount}</span>
        <Button
          variant='outline'
          size='icon'
          className='size-7'
          onClick={() => handleChange(1)}
          disabled={poolCount >= 64}
        >
          <PlusIcon className='size-3' />
        </Button>
      </div>
    </div>
  );
}

function DeleteStageButton({ stageId }: { stageId: Id<'stages'> }) {
  const removeStage = useMutation(api.stages.remove);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='text-destructive hover:bg-destructive/10'
        >
          <Trash2Icon className='size-4' />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Stage</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this stage and all its pools. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => removeStage({ id: stageId })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function StageCard({
  stage,
  entrants
}: {
  stage: Doc<'stages'>;
  entrants: Entrant[];
}) {
  const [open, setOpen] = useState(false);
  const groups = useQuery(api.groups.getByStage, { stageId: stage._id });
  const pools =
    groups && groups.length > 0 ? snakeSeed(entrants, groups.length) : [];

  return (
    <div className='border border-gray-200'>
      <button
        className='w-full bg-gray-100 p-2'
        onClick={() => setOpen(!open)}
      >
        <h3 className='text-lg font-semibold'>{stage.name}</h3>
        <p className='text-sm text-gray-600'>{stage.format}</p>
      </button>
      <div
        className={cn('grid opacity-0 transition-all duration-300', {
          'opacity-100': open
        })}
        style={{
          gridTemplateRows: open ? '1fr' : '0fr'
        }}
      >
        <div className='overflow-hidden'>
          <div className='border-t border-gray-200 p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <PoolCountEditor stage={stage} />
              <DeleteStageButton stageId={stage._id} />
            </div>
            {groups && groups.length > 0 && (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {groups.map((group, i) => (
                  <PoolCard
                    key={group._id}
                    group={group}
                    entrants={pools[i] ?? []}
                    colorIndex={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  preloadedStages: Preloaded<typeof api.stages.getByEvent>;
  preloadedEntrants: Preloaded<typeof api.entrants.getByEvent>;
  eventId: Id<'events'>;
};

export default function Bracketing({
  preloadedStages,
  preloadedEntrants,
  eventId
}: Props) {
  const [open, setOpen] = useState(false);
  const stages = usePreloadedQuery(preloadedStages);
  const entrants = usePreloadedQuery(preloadedEntrants) as Entrant[];

  return (
    <div>
      <h4 className='mb-2 font-semibold'>Stages</h4>
      <div className='space-y-2'>
        <div className='flex flex-col gap-2'>
          {stages?.map((stage) => (
            <StageCard
              key={stage._id}
              stage={stage}
              entrants={entrants}
            />
          ))}
        </div>
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant='outline'
              className='w-full border-2 border-dashed py-8'
            >
              <PlusIcon />
              <span className='text-base font-semibold'>Add Stage</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-sm'>
            <DialogHeader>
              <DialogTitle>Add Stage</DialogTitle>
              <DialogDescription>
                Add a new stage to your event.
              </DialogDescription>
            </DialogHeader>
            <CreateStageForm
              eventId={eventId}
              setOpen={setOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
