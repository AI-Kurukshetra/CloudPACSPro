import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { ROLES } from "@/constants/roles";
import { sendSuccess, sendError } from "@/lib/utils/api";
import { createStudySchema } from "@/types/schemas";
import type { Study } from "@/types/database";
import type { StudyWithPatient } from "@/hooks/use-studies";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth) {
    return sendError("Unauthorized", 401);
  }

  const url = new URL(request.url);
  const patientId = url.searchParams.get("patientId");

  const supabase = await createClient();
  let query = supabase
    .from("studies")
    .select("id, patient_id, study_type_id, description, created_by, created_at, patients(name), study_types(name)")
    .order("created_at", { ascending: false });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;
  if (error) {
    return sendError(error.message, 500);
  }

  const shaped = (data ?? []).map((row) => ({
    ...row,
    patient_name:
      "patients" in row && row.patients && typeof row.patients === "object"
        ? (row.patients as { name?: string | null }).name ?? null
        : null,
    study_type_name:
      "study_types" in row && row.study_types && typeof row.study_types === "object"
        ? (row.study_types as { name?: string | null }).name ?? null
        : null,
  }));

  return sendSuccess<StudyWithPatient[]>((shaped ?? []) as StudyWithPatient[]);
}

export async function POST(request: NextRequest) {
  const auth = await requireRole([ROLES.CLINIC_ADMIN]);
  if (!auth) {
    return sendError("Forbidden", 403);
  }

  const parsed = createStudySchema.safeParse(await request.json());
  if (!parsed.success) {
    return sendError("Validation failed", 400, parsed.error.flatten());
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studies")
    .insert({
      patient_id: parsed.data.patient_id,
      study_type_id: parsed.data.study_type_id,
      description: parsed.data.description?.trim() || null,
      created_by: auth.user.id,
    })
    .select("id, patient_id, study_type_id, description, created_by, created_at")
    .single();

  if (error) {
    return sendError(error.message, 500);
  }

  return sendSuccess<Study>(data as Study, 201, { message: "Study created." });
}
