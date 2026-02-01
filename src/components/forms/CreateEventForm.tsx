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
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor
} from '@/components/ui/combobox';
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
import { Doc, Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

import { api } from '../../../convex/_generated/api';
import { Textarea } from '../ui/textarea';
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
  const [platformSearch, setPlatformSearch] = useState('');

  const games = useQuery(api.games.list);
  const platforms = useQuery(api.platforms.list);
  const createEvent = useMutation(api.events.createEvent);
  const router = useRouter();
  const anchor = useComboboxAnchor();

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
      eventPlatforms: [],
      entrantCap: null,
      startDate: undefined
    }
  });

  async function onSubmit(data: EventFormOutput) {
    const selectedGame = games?.find((g) => g.id === data.game);
    if (!selectedGame) return;

    await createEvent({
      name: data.name || selectedGame.name,
      tournamentId,
      game: selectedGame.id,
      description: data.description || undefined,
      eventPlatforms: data.eventPlatforms,
      entrantCap: data.entrantCap,
      startDate: data.startDate.getTime()
    });

    router.push(`/manage/tournament/${slug}/events`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {!selectedGame && (
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
                      filteredGames.find((g) => g.id === value) ?? null
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
                          {filteredGames.find((g) => g.id === field.value)
                            ?.name ?? 'Select a game'}
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
                      {filteredGames.map((game) => (
                        <ComboboxItem
                          key={game._id}
                          value={game.id}
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
                                {game.platforms.map((platformId) => {
                                  const platform = platforms?.find(
                                    (p) => p.id === platformId
                                  );
                                  return (
                                    <div
                                      key={platformId}
                                      className={
                                        'rounded-full bg-gray-100 px-2 text-xs'
                                      }
                                    >
                                      {platform?.name ?? ''}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {selectedGame && (
          <div
            className={
              'flex flex-col items-center gap-x-4 border border-gray-200 bg-white p-2 md:flex-row md:items-start'
            }
          >
            <div className={'aspect-9/12 max-w-[300px] md:max-w-[160px]'}>
              <Image
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${selectedGame.cover.imageId}.jpg`}
                alt={selectedGame.name}
                width={selectedGame.cover.width}
                height={selectedGame.cover.height}
                unoptimized
              />
            </div>
            <div className={'w-full space-y-8'}>
              <div>
                <h3 className={'text-2xl font-bold'}>{selectedGame.name}</h3>
                <button
                  className={'text-xs'}
                  onClick={() => {
                    setSelectedGame(null);
                    form.setValue('game', 0);
                  }}
                >
                  Change Game
                </button>
              </div>
              <Controller
                name='eventPlatforms'
                control={form.control}
                render={({ field, fieldState }) => {
                  const gamePlatformIds = selectedGame.platforms.map((id) =>
                    String(id)
                  );
                  const platformItems = (platforms ?? [])
                    .filter((p) => gamePlatformIds.includes(String(p.id)))
                    .map((p) => ({
                      id: String(p.id),
                      name: p.name,
                      slug: p.slug
                    }));
                  const selectedIds = (field.value ?? []).map((v: number) =>
                    String(v)
                  );
                  const availablePlatforms = platformItems.filter(
                    (p) => !selectedIds.includes(p.id)
                  );
                  const filteredPlatforms = platformSearch
                    ? availablePlatforms.filter((p) =>
                        p.name
                          .toLowerCase()
                          .includes(platformSearch.toLowerCase())
                      )
                    : availablePlatforms;
                  return (
                    <Field
                      data-invalid={fieldState.invalid}
                      className={'gap-1'}
                    >
                      <FieldLabel htmlFor='platforms'>Platforms</FieldLabel>
                      <FieldDescription className={'text-xs'}>
                        The platform the event will be played on. Select
                        multiple if the event will be played on multiple
                        platforms.
                      </FieldDescription>
                      <Combobox
                        multiple
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setPlatformSearch('');
                        }}
                      >
                        <ComboboxChips
                          ref={anchor}
                          className='w-full bg-white'
                        >
                          <ComboboxValue>
                            {(field.value ?? []).map((item: number) => (
                              <ComboboxChip key={item}>
                                {platforms?.find((p) => p.id === item)?.name ??
                                  'Unknown'}
                              </ComboboxChip>
                            ))}
                          </ComboboxValue>
                          <ComboboxChipsInput
                            placeholder='Add platform'
                            value={platformSearch}
                            onChange={(e) => setPlatformSearch(e.target.value)}
                          />
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxList>
                            {filteredPlatforms.map((platform) => (
                              <ComboboxItem
                                key={platform.id}
                                value={Number(platform.id)}
                                className={'cursor-pointer'}
                              >
                                {platform.name}
                              </ComboboxItem>
                            ))}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </div>
        )}

        <Controller
          name='name'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='name'>Event Name</FieldLabel>
              <FieldDescription className={'text-xs'}>
                The name of the event. If left blank, the game name will be
                used.
              </FieldDescription>
              <Input
                {...field}
                id='name'
                placeholder='e.g. Street Fighter 6 Weekly'
                aria-invalid={fieldState.invalid}
                className={'bg-white'}
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
              <FieldDescription className={'text-xs'}>
                A description of the event.
              </FieldDescription>
              <Textarea
                {...field}
                id='description'
                placeholder='Describe your event...'
                aria-invalid={fieldState.invalid}
                className={'bg-white'}
              />
              <FieldDescription className={'text-xs'}>
                Optional
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='entrantCap'
          control={form.control}
          render={({ field, fieldState }) => {
            const { onChange, onBlur, name, ref } = field;
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='entrantCap'>Player Cap</FieldLabel>
                <FieldDescription className={'text-xs'}>
                  The maximum number of players allowed to participate in the
                  event. Must be at least 2 players.
                </FieldDescription>
                <Input
                  id='entrantCap'
                  name={name}
                  type='number'
                  min={2}
                  placeholder='16'
                  aria-invalid={fieldState.invalid}
                  value={String(field.value ?? '')}
                  onChange={(e) =>
                    onChange(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  onBlur={onBlur}
                  ref={ref}
                  className={'bg-white'}
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
