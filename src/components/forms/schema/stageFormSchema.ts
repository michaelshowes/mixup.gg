import { z } from 'zod';

export const stageFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  format: z.string().min(1, 'Format is required'),
  poolCount: z.coerce.number().min(1).max(64)
});

export type StageFormInput = z.infer<typeof stageFormSchema>;
