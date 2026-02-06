import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  game: z.number('You must select a game').min(1, 'Game is required'),
  eventPlatforms: z.array(
    z
      .number('You must select at least one platform')
      .min(1, 'At least one platform is required')
  ),
  description: z.string().optional(),
  entrantCap: z.coerce.number().min(2, 'Must have at least 2 players'),
  startDate: z.date({ message: 'Start date is required' })
});

export type EventFormInput = z.input<typeof eventFormSchema>;
export type EventFormOutput = z.output<typeof eventFormSchema>;
