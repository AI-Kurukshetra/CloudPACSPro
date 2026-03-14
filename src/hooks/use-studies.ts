"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Study } from "@/types/database";
import type { CreateStudyInput, UpdateStudyInput } from "@/types/schemas";

export type StudyWithPatient = Study & {
  patient_name?: string | null;
  study_type_name?: string | null;
};

export function useStudies() {
  return useQuery({
    queryKey: QUERY_KEYS.studies.all,
    queryFn: () => apiGet<StudyWithPatient[]>("/studies"),
  });
}

export function usePatientStudies(patientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.studies.byPatient(patientId),
    queryFn: () => apiGet<StudyWithPatient[]>(`/studies?patientId=${patientId}`),
    enabled: Boolean(patientId),
  });
}

export function useStudy(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.studies.detail(id),
    queryFn: () => apiGet<Study>(`/studies/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateStudy(inputPatientId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStudyInput) => {
      return apiPost<Study>("/studies", input);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies.all });
      const patientId = inputPatientId ?? data.patient_id;
      if (patientId) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.studies.byPatient(patientId),
        });
      }
    },
  });
}

export function useUpdateStudy(studyId: string, patientId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateStudyInput) => {
      return apiPatch<Study>(`/studies/${studyId}`, input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies.detail(studyId) });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies.all });
      if (patientId) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.studies.byPatient(patientId),
        });
      }
    },
  });
}

export function useDeleteStudy(studyId: string, patientId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiDelete(`/studies/${studyId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies.all });
      if (patientId) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.studies.byPatient(patientId),
        });
      }
    },
  });
}
