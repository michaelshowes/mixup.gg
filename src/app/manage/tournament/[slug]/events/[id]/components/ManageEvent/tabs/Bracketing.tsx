'use client';

import { useState } from 'react';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { PlusIcon } from 'lucide-react';

import CreateStageForm from '@/components/forms/CreateStageForm';
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

function StageCard({ stage }: { stage: Doc<'stages'> }) {
  return (
    <div className={'border border-gray-200 bg-gray-100 p-2'}>
      <h3 className={'text-lg font-semibold'}>{stage.name}</h3>
      <p className={'text-sm text-gray-600'}>{stage.format}</p>
    </div>
  );
}

type Props = {
  preloadedStages: Preloaded<typeof api.stages.getByEvent>;
  eventId: Id<'events'>;
};

export default function Bracketing({ preloadedStages, eventId }: Props) {
  const [open, setOpen] = useState(false);
  const stages = usePreloadedQuery(preloadedStages);

  return (
    <div>
      <h4 className={'mb-2 font-semibold'}>Stages</h4>
      <div className={'space-y-2'}>
        <div className={'flex flex-col gap-2'}>
          {stages?.map((stage) => (
            <StageCard
              key={stage._id}
              stage={stage}
            />
          ))}
        </div>
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant={'outline'}
              className={'w-full border-2 border-dashed py-8'}
            >
              <PlusIcon />
              <span className={'text-base font-semibold'}>Add Stage</span>
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
