"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StudyWithPatient } from "@/hooks/use-studies";

type StudiesTableProps = {
  studies: StudyWithPatient[];
};

export function StudiesTable({ studies }: StudiesTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Study type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studies.map((study) => (
            <TableRow key={study.id}>
              <TableCell>
                {study.patient_name ? (
                  <span className="font-medium">{study.patient_name}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/studies/${study.id}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {study.study_type_name ?? "—"}
                </Link>
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {study.description ?? "—"}
              </TableCell>
              <TableCell>{format(new Date(study.created_at), "yyyy-MM-dd")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
