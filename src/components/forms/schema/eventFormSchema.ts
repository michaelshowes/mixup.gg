import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  playerCap: z.coerce.number().min(2, 'Must have at least 2 players'),
  startDate: z.date({ message: 'Start date is required' }),
  endDate: z.date({ message: 'End date is required' })
});

export type EventFormInput = z.input<typeof eventFormSchema>;
export type EventFormOutput = z.output<typeof eventFormSchema>;
