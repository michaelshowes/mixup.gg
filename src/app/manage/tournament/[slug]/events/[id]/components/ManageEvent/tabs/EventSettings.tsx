'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';

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
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';

type Props = {
  event: Doc<'events'>;
  slug: string;
};

export default function EventSettings({ event, slug }: Props) {
  const deleteEvent = useMutation(api.events.deleteEvent);
  const router = useRouter();

  async function handleDelete(id: Id<'events'>) {
    const res = await deleteEvent({ id });
    if (res.success) {
      toast.success(res.message);

      router.push(`/manage/tournament/${slug}/events`);
    } else {
      toast.error(res.message);
    }
  }
  return (
    <div>
      <div
        className={
          'border-destructive flex flex-col flex-wrap items-center justify-between gap-1 border-2 bg-white p-4 md:flex-row'
        }
      >
        <div className={'flex-1'}>
          <h3 className={'text-destructive text-lg font-bold'}>Delete Event</h3>
          <p className={'text-sm text-gray-500'}>
            This action cannot be undone. This will permanently delete the event
            from the tournament.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={'destructive'}>Delete Event</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {`Delete ${event.name} event?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                event from the tournament.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant={'destructive'}
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
