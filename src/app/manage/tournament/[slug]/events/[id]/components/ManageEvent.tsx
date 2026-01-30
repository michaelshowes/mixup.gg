'use client';

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
import { Doc } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

type Props = {
  preloadedData: Preloaded<typeof api.events.getEventById>;
};

export default function ManageEvent({ preloadedData }: Props) {
  const event = usePreloadedQuery(preloadedData) as Doc<'events'>;
  const updateEvent = useMutation(api.events.updateEvent);

  const form = useForm<EventFormInput, unknown, EventFormOutput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name ?? '',
      playerCap: event?.playerCap ?? 8,
      startDate: event?.startDate ? new Date(event.startDate) : undefined,
      endDate: event?.endDate ? new Date(event.endDate) : undefined
    }
  });

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
    <div className={'mx-auto max-w-[700px] space-y-10'}>
      <h2 className='text-2xl font-bold uppercase'>Event: {event?.name}</h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className={
                  'flex-row rounded-md border border-gray-200 bg-white p-4'
                }
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
                  className={
                    'flex-row rounded-md border border-gray-200 bg-white p-4'
                  }
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
