"use client";

import { useItems } from "@/hooks/use-items";
import { usePatients } from "@/hooks/use-patients";
import { useStudies } from "@/hooks/use-studies";
import { ItemsList } from "@/components/dashboard/items-list";
import { ItemsListSkeleton } from "@/components/dashboard/items-list-skeleton";
import { SeedButton } from "@/components/dashboard/seed-button";
import { getErrorMessage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: patients } = usePatients();
  const patientCount = patients?.length ?? 0;
  const { data: studies } = useStudies();
  const studyCount = studies?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{patientCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{studyCount}</div>
          </CardContent>
        </Card>
      </div>
     
      {/* {isLoading && <ItemsListSkeleton />} */}
      {/* {isError && (
        <p className="text-sm text-destructive">
          {getErrorMessage(error, "Failed to load items.")}
        </p>
      )} */}
     
    </div>
  );
}
