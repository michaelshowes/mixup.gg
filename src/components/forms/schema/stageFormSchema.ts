import { z } from 'zod';

export const stageFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  format: z.string().min(1, 'Format is required')
});

export type StageFormInput = z.infer<typeof stageFormSchema>;
