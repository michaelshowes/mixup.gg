import { z } from 'zod';

export const tournamentFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.date({ message: 'Start date is required' }),
  endDate: z.date({ message: 'End date is required' })
});

export type TournamentFormInput = z.input<typeof tournamentFormSchema>;
export type TournamentFormOutput = z.output<typeof tournamentFormSchema>;
