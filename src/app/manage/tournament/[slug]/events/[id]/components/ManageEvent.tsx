'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  EventFormInput,
  EventFormOutput,
  eventFormSchema
} from '@/components/forms/schema/eventFormSchema';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

type Props = {
  preloadedData: Preloaded<typeof api.events.getEventById>;
  slug: string;
};

export default function ManageEvent({ preloadedData, slug }: Props) {
  const event = usePreloadedQuery(preloadedData) as Doc<'events'>;
  const updateEvent = useMutation(api.events.updateEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const router = useRouter();
  const form = useForm<EventFormInput, unknown, EventFormOutput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name ?? '',
      playerCap: event?.playerCap ?? 8,
      startDate: event?.startDate ? new Date(event.startDate) : undefined,
      endDate: event?.endDate ? new Date(event.endDate) : undefined
    }
  });

  async function handleDelete(id: Id<'events'>) {
    const res = await deleteEvent({ id });
    if (res.success) {
      toast.success(res.message);
      router.push(`/manage/tournament/${slug}/events`);
    } else {
      toast.error(res.message);
    }
  }

  async function onSubmit(data: EventFormOutput) {
    const res = await updateEvent({
      id: event._id,
      name: data.name,
      playerCap: data.playerCap,
      startDate: data.startDate.getTime(),
      endDate: data.endDate.getTime()
    });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className={'mx-auto max-w-[800px] space-y-10'}>
      <h2 className='text-2xl font-bold uppercase'>{event?.name}</h2>
      <div className={'border border-gray-200 bg-white p-2'}>
        <Image
          src={'https://placehold.co/90x120?text=Game+Cover'}
          alt={event?.name ?? 'Event Image'}
          width={90}
          height={120}
          unoptimized
        />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className={'flex-row border border-gray-200 bg-white p-4'}
              >
                <FieldLabel
                  htmlFor='name'
                  className={'font-semibold'}
                >
                  Name
                </FieldLabel>
                <Input
                  {...field}
                  id='name'
                  placeholder='e.g. Street Fighter 6'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='playerCap'
            control={form.control}
            render={({ field, fieldState }) => {
              const { onChange, onBlur, name, ref } = field;
              return (
                <Field
                  data-invalid={fieldState.invalid}
                  className={'flex-row border border-gray-200 bg-white p-4'}
                >
                  <FieldLabel
                    htmlFor='playerCap'
                    className={'font-semibold'}
                  >
                    Player Cap
                  </FieldLabel>
                  <Input
                    id='playerCap'
                    name={name}
                    type='number'
                    min={2}
                    placeholder='8'
                    aria-invalid={fieldState.invalid}
                    value={String(field.value ?? '')}
                    onChange={(e) =>
                      onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    onBlur={onBlur}
                    ref={ref}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name='startDate'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='startDate'>Start Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='startDate'
                      variant='outline'
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 size-4' />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='endDate'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='endDate'>End Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='endDate'
                      variant='outline'
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 size-4' />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type='submit'
            className={'ml-auto w-fit'}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </FieldGroup>
      </form>

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
