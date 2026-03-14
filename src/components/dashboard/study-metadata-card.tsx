"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleGuard } from "@/components/shared/role-guard";
import { ModalityBadge } from "@/components/shared/modality-badge";
import { StudyStatusBadge } from "@/components/dashboard/study-status-badge";
import { StudyStatusControl } from "@/components/dashboard/study-status-control";
import { AssignRadiologistDialog } from "@/components/dashboard/assign-radiologist-dialog";
import { ROLES } from "@/constants/roles";
import type { Patient, Study } from "@/types/database";

interface StudyMetadataCardProps {
  study: Study & {
    study_type_name?: string | null;
    assigned_to_name?: string | null;
  };
  patient: Patient | null;
}

function toModality(value?: string | null) {
  const normalized = value?.toUpperCase().replace("-", "") ?? "";
  if (normalized.includes("XRAY") || normalized.includes("X-RAY")) return "XRAY";
  if (normalized.includes("MRI")) return "MRI";
  if (normalized.includes("CT")) return "CT";
  if (normalized.includes("US") || normalized.includes("ULTRASOUND")) return "US";
  return null;
}

export function StudyMetadataCard({ study, patient }: StudyMetadataCardProps) {
  const modality = toModality(study.study_type_name);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Patient</p>
            {patient ? (
              <Link
                href={`/dashboard/patients/${patient.id}`}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {patient.name}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">Unknown</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Modality</p>
            {modality ? (
              <ModalityBadge modality={modality} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {study.study_type_name ?? "—"}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Study date</p>
            <p className="text-sm font-medium">
              {format(new Date(study.created_at), "MMMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
            <div className="flex items-center gap-2">
              <StudyStatusBadge status={study.status} />
              <RoleGuard allowedRoles={[ROLES.CLINIC_ADMIN]}>
                <StudyStatusControl
                  studyId={study.id}
                  currentStatus={study.status}
                />
              </RoleGuard>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Assigned to:</span>
          {study.assigned_to_name ? (
            <span className="font-medium">{study.assigned_to_name}</span>
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          )}
          <RoleGuard allowedRoles={[ROLES.CLINIC_ADMIN]}>
            <AssignRadiologistDialog
              studyId={study.id}
              currentAssigneeId={study.assigned_to ?? null}
            />
          </RoleGuard>
        </div>

        {study.description && (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            {study.description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
