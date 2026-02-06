'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { StageFormInput, stageFormSchema } from './schema/stageFormSchema';

export default function CreateStageForm({
  eventId,
  setOpen
}: {
  eventId: Id<'events'>;
  setOpen: (open: boolean) => void;
}) {
  const createStage = useMutation(api.stages.create);
  const form = useForm<StageFormInput, unknown, StageFormInput>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      name: '',
      format: '',
      poolCount: 1
    }
  });

  const formats = [
    { label: 'Single Elimination', value: 'single-elimination' },
    { label: 'Double Elimination', value: 'double-elimination' },
    { label: 'Round Robin', value: 'round-robin' }
  ];

  async function onSubmit(data: StageFormInput) {
    await createStage({
      name: data.name,
      format: data.format,
      poolCount: data.poolCount,
      eventId
    });
    form.reset();
    setOpen(false);
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
                aria-invalid={fieldState.invalid}
                placeholder='e.g. Pools, Top 8, etc.'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='format'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='format'>Format</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Format' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {formats.map((format) => (
                      <SelectItem
                        key={format.value}
                        value={format.value}
                      >
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='poolCount'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='poolCount'>Pool Count</FieldLabel>
              <Input
                {...field}
                id='poolCount'
                type='number'
                min={1}
                max={64}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter className='mt-6'>
        <DialogClose asChild>
          <Button
            type='button'
            variant='outline'
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create Stage'}
        </Button>
      </DialogFooter>
    </form>
  );
}
