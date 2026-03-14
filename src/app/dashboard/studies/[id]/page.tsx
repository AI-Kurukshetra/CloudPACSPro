"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ItemsTableSkeleton } from "@/components/dashboard/items-table-skeleton";
import { PatientCombobox } from "@/components/shared/patient-combobox";
import { createStudySchema, type CreateStudyInput } from "@/types/schemas";
import { useDeleteStudy, useStudy, useUpdateStudy } from "@/hooks/use-studies";
import { useStudyTypes } from "@/hooks/use-study-types";
import { getErrorMessage } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function StudyDetailsPage() {
  const params = useParams<{ id: string }>();
  const studyId = params?.id ?? "";
  const router = useRouter();
  const { data: study, isLoading, isError, error } = useStudy(studyId);
  const { mutateAsync: updateStudy, isPending: isUpdating } = useUpdateStudy(
    studyId,
    study?.patient_id
  );
  const { mutateAsync: deleteStudy, isPending: isDeleting } = useDeleteStudy(
    studyId,
    study?.patient_id
  );

  const form = useForm<CreateStudyInput>({
    resolver: zodResolver(createStudySchema),
    defaultValues: study
      ? {
          patient_id: study.patient_id,
          study_type_id: study.study_type_id,
          description: study.description ?? "",
        }
      : {
          patient_id: "",
          study_type_id: "",
          description: "",
        },
    values: study
      ? {
          patient_id: study.patient_id,
          study_type_id: study.study_type_id,
          description: study.description ?? "",
        }
      : undefined,
  });

  const { data: studyTypes, isLoading: typesLoading } = useStudyTypes();

  if (isLoading) {
    return <ItemsTableSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(error, "Failed to load study details.")}
      </p>
    );
  }

  if (!study) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Study Details</h1>
        <p className="text-sm text-muted-foreground">Study not found.</p>
        <Link href="/dashboard/studies">
          <Button variant="outline">Back to studies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Study Details</h1>
        <Link href="/dashboard/studies">
          <Button variant="outline">Back to studies</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit study</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await updateStudy(values);
                toast.success("Study updated.");
              } catch (err) {
                toast.error(getErrorMessage(err, "Failed to update study."));
              }
            })}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="study-patient">Patient Name</Label>
              <Controller
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <PatientCombobox
                    id="study-patient"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isUpdating}
                    placeholder="Search patient"
                    ariaInvalid={Boolean(form.formState.errors.patient_id)}
                  />
                )}
              />
              {form.formState.errors.patient_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.patient_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-type">Study type</Label>
              <select
                id="study-type"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                disabled={isUpdating || typesLoading}
                {...form.register("study_type_id")}
              >
                <option value="">Select a study type</option>
                {(studyTypes ?? []).map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.study_type_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.study_type_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-description">Description</Label>
              <Input
                id="study-description"
                disabled={isUpdating}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" loading={isUpdating} loadingText="Saving...">
                Save changes
              </Button>
              <ConfirmDialog
                trigger={
                  <Button
                    type="button"
                    variant="destructive"
                    loading={isDeleting}
                    loadingText="Deleting..."
                    className="inline-flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete study
                  </Button>
                }
                title="Delete this study?"
                description="This action cannot be undone."
                onConfirm={async () => {
                  try {
                    await deleteStudy();
                    toast.success("Study deleted.");
                    router.push("/dashboard/studies");
                  } catch (err) {
                    toast.error(getErrorMessage(err, "Failed to delete study."));
                  }
                }}
                isPending={isDeleting}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Created at:</span>{" "}
            {new Date(study.created_at).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Study type:</span>{" "}
            {studyTypes?.find((type) => type.id === study.study_type_id)?.name ?? "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
