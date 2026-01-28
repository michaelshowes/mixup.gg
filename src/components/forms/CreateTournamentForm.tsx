'use client';

import { useRouter } from 'next/navigation';

import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Field,
  FieldDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { generateSlug } from '@/helpers/generateSlug';
import { cn } from '@/lib/utils';

import { api } from '../../../convex/_generated/api';
import {
  TournamentFormInput,
  TournamentFormOutput,
  tournamentFormSchema
} from './schema/tournamentFormSchema';

export function CreateTournamentForm() {
  const router = useRouter();
  const createTournament = useMutation(api.tournaments.createTournament);
  const user = useQuery(api.users.current);

  const form = useForm<TournamentFormInput, unknown, TournamentFormOutput>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: undefined,
      endDate: undefined
    }
  });

  async function onSubmit(data: TournamentFormOutput) {
    const slug = generateSlug(data.name);
    await createTournament({
      name: data.name,
      userId: user?._id as string,
      slug,
      description: data.description || undefined,
      startDate: data.startDate.getTime(),
      endDate: data.endDate.getTime()
    });

    router.push(`/manage/tournament/${slug}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name='name'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='name'>Tournament Name</FieldLabel>
              <Input
                {...field}
                id='name'
                placeholder='My Tournament'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='description'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='description'>Description</FieldLabel>
              <Textarea
                {...field}
                id='description'
                placeholder='Describe your tournament...'
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>Optional</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
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
          {form.formState.isSubmitting ? 'Creating...' : 'Create Tournament'}
        </Button>
      </FieldGroup>
    </form>
  );
}
