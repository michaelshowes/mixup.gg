'use client';

import { useEffect, useRef, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { Info, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import SeedingEmptyState from './seeding/SeedingEmptyState';
import SeedingItem from './seeding/SeedingItem';

type Props = {
  preloadedEntrants: Preloaded<typeof api.entrants.getByEvent>;
};

type EntrantWithUser = {
  _id: Id<'entrants'>;
  gamertag: string;
  seedHint?: number;
  user: {
    fullName: string;
    imageUrl?: string;
  } | null;
};

export default function Seeding({ preloadedEntrants }: Props) {
  const entrants: EntrantWithUser[] = usePreloadedQuery(preloadedEntrants);
  const updateSeeding = useMutation(api.entrants.updateSeeding);

  const [localOrder, setLocalOrder] = useState<EntrantWithUser[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const pendingUpdate = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Sync server data to local state when not mid-update
  useEffect(() => {
    if (entrants && !pendingUpdate.current) {
      setLocalOrder(entrants);
    }
  }, [entrants]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localOrder.findIndex((item) => item._id === active.id);
      const newIndex = localOrder.findIndex((item) => item._id === over.id);
      const newOrder = arrayMove(localOrder, oldIndex, newIndex);

      // Optimistically update local state
      setLocalOrder(newOrder);
      pendingUpdate.current = true;

      const seeds = newOrder.map((entrant, index) => ({
        entrantId: entrant._id,
        seedHint: index + 1
      }));

      try {
        await updateSeeding({ seeds });
      } catch {
        // Revert to server state on error
        if (entrants) {
          setLocalOrder(entrants);
        }
        toast.error('Failed to update seeding. Please try again.');
      } finally {
        pendingUpdate.current = false;
      }
    }
  }

  if (!entrants) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='size-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900' />
      </div>
    );
  }

  if (entrants.length === 0) {
    return <SeedingEmptyState />;
  }

  // Use localOrder for rendering, fall back to entrants before first sync
  const displayOrder = localOrder.length > 0 ? localOrder : entrants;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <Info className='size-4' />
          <span>Drag entrants to reorder seeding. Top position = Seed 1.</span>
        </div>
        <Button
          variant={isLocked ? 'outline' : 'default'}
          size='sm'
          onClick={() => setIsLocked(!isLocked)}
        >
          {isLocked ? (
            <>
              <Lock className='size-4' />
              Unlock to Edit
            </>
          ) : (
            <>
              <Unlock className='size-4' />
              Lock Seeding
            </>
          )}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={displayOrder.map((e) => e._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className='space-y-2'>
            {displayOrder.map((entrant, index) => (
              <SeedingItem
                key={entrant._id}
                id={entrant._id}
                seed={index + 1}
                gamertag={entrant.gamertag}
                user={entrant.user}
                disabled={isLocked}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
