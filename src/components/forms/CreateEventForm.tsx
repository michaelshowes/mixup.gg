'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue
} from '@/components/ui/combobox';
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
import { Doc, Id } from '@/convex/_generated/dataModel';
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
  const [selectedGame, setSelectedGame] = useState<Doc<'games'> | null>(null);
  const [gameSearch, setGameSearch] = useState('');

  const games = useQuery(api.games.list);
  const platforms = useQuery(api.platforms.list);
  const createEvent = useMutation(api.events.createEvent);
  const router = useRouter();

  console.log(selectedGame);

  const filteredGames = gameSearch
    ? (games?.filter((game) =>
        game.name.toLowerCase().includes(gameSearch.toLowerCase())
      ) ?? [])
    : (games ?? []);

  const form = useForm<EventFormInput, unknown, EventFormOutput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      game: undefined,
      playerCap: 8,
      startDate: undefined,
      endDate: undefined
    }
  });

  async function onSubmit(data: EventFormOutput) {
    const selectedGame = games?.find((g) => g.name === data.game.name);
    if (!selectedGame) return;

    await createEvent({
      name: data.name,
      tournamentId,
      game: {
        id: selectedGame._id,
        name: selectedGame.name,
        cover: selectedGame.cover,
        platforms: selectedGame.platforms.map((item) => {
          const platform = platforms?.find((p) => p.id === item);
          return {
            name: platform?.name ?? '',
            slug: platform?.slug ?? ''
          };
        })
      },
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
                placeholder='e.g. Street Fighter 6 Weekly'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='game'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='game'>Game</FieldLabel>
              <Combobox
                value={field.value ?? null}
                onValueChange={(value) => {
                  field.onChange(value ?? undefined);
                  setGameSearch('');
                  setSelectedGame(
                    filteredGames.find((g) => g.name === value?.name) ?? null
                  );
                }}
              >
                <ComboboxTrigger
                  render={
                    <Button
                      variant='outline'
                      className='w-64 justify-between font-normal'
                    >
                      <ComboboxValue placeholder='Select a game'>
                        {field.value?.name}
                      </ComboboxValue>
                    </Button>
                  }
                />
                <ComboboxContent>
                  <ComboboxInput
                    showTrigger={false}
                    placeholder='Search'
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                  />
                  <ComboboxList>
                    {filteredGames.map((game) => {
                      const gameValue = {
                        id: game._id,
                        name: game.name,
                        cover: game.cover,
                        platforms: game.platforms.map((platformId) => {
                          const platform = platforms?.find(
                            (p) => p.id === platformId
                          );
                          return {
                            id: String(platformId),
                            name: platform?.name ?? '',
                            slug: platform?.slug ?? ''
                          };
                        })
                      };
                      return (
                        <ComboboxItem
                          key={game._id}
                          value={gameValue}
                        >
                          <div
                            className={
                              'flex w-full cursor-pointer items-center gap-2'
                            }
                          >
                            <div className={'aspect-9/12 max-w-[40px]'}>
                              <Image
                                src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.imageId}.jpg`}
                                alt={game.name}
                                width={game.cover.width}
                                height={game.cover.height}
                                unoptimized
                              />
                            </div>
                            <div>
                              {game.name}
                              <div className={'flex gap-1'}>
                                {gameValue.platforms.map((platform) => (
                                  <div
                                    key={platform.id}
                                    className={
                                      'rounded-full bg-gray-100 px-2 text-xs'
                                    }
                                  >
                                    {platform.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </ComboboxItem>
                      );
                    })}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
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

        <div
          className={
            'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4'
          }
        >
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
                      disabled={(date) => {
                        const startDate = form.getValues('startDate');
                        return startDate ? date < startDate : date < new Date();
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

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
