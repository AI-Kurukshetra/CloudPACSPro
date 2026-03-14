import { z } from "zod";

export const createStudySchema = z.object({
  patient_id: z.string().uuid("Patient is required."),
  study_type_id: z.string().uuid("Study type is required."),
  description: z.string().trim().optional(),
});

export type CreateStudyInput = z.infer<typeof createStudySchema>;

export const updateStudySchema = createStudySchema.partial();

export type UpdateStudyInput = z.infer<typeof updateStudySchema>;
