import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const updateUserRoleSchema = z.object({
  role: z.enum([ROLES.CLINIC_ADMIN, ROLES.RADIOLOGIST]),
});

export type UpdateUserRoleValues = z.infer<typeof updateUserRoleSchema>;
