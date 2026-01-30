'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

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
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

import { api } from '../../../convex/_generated/api';
import {
  EventFormInput,
  EventFormOutput,
  eventFormSchema
} from './schema/eventFormSchema';

interface CreateEventFormProps {
  tournamentId: Id<'tournaments'>;
  slug: string;
}

export function CreateEventForm({ tournamentId, slug }: CreateEventFormProps) {
  const createEvent = useMutation(api.events.createEvent);
  const router = useRouter();

  const form = useForm<EventFormInput, unknown, EventFormOutput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      playerCap: 8,
      startDate: undefined,
      endDate: undefined
    }
  });

  async function onSubmit(data: EventFormOutput) {
    await createEvent({
      name: data.name,
      tournamentId,
      playerCap: data.playerCap,
      startDate: data.startDate.getTime(),
      endDate: data.endDate.getTime()
    });

    router.push(`/manage/tournament/${slug}/events`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name='name'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='name'>Name</FieldLabel>
              <Input
                {...field}
                id='name'
                placeholder='e.g. Street Fighter 6'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='playerCap'
          control={form.control}
          render={({ field, fieldState }) => {
            const { onChange, onBlur, name, ref } = field;
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='playerCap'>Player Cap</FieldLabel>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                    disabled={(date) => {
                      const startDate = form.getValues('startDate');
                      return startDate ? date < startDate : date < new Date();
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create Event'}
        </Button>
      </FieldGroup>
    </form>
  );
}
