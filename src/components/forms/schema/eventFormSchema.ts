import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  game: z.object({
    id: z.string().min(1, 'Game is required'),
    name: z.string().min(1, 'Name is required'),
    cover: z.object({
      imageId: z.string().min(1, 'Cover is required'),
      height: z.coerce.number().min(1, 'Height is required'),
      width: z.coerce.number().min(1, 'Width is required')
    }),
    platforms: z.array(
      z.object({
        id: z.string().min(1, 'Platform is required'),
        name: z.string().min(1, 'Name is required'),
        slug: z.string().min(1, 'Slug is required')
      })
    )
  }),
  playerCap: z.coerce.number().min(2, 'Must have at least 2 players'),
  startDate: z.date({ message: 'Start date is required' }),
  endDate: z.date({ message: 'End date is required' })
});

export type EventFormInput = z.input<typeof eventFormSchema>;
export type EventFormOutput = z.output<typeof eventFormSchema>;
