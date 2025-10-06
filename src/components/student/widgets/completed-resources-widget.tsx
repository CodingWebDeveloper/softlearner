"use client";

import { Card, CardContent, Skeleton } from "@mui/material";
import OneValueStat from "@/components/creator/courses/analytics/widgets/one-value-stat";
import { trpc } from "@/lib/trpc/client";

const CompletedResourcesWidget: React.FC = () => {
  const { data, isPending, isError } = trpc.courses.getCompletedResourcesCount.useQuery();

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary", height: "100%" }}>
      <CardContent>
        {isPending ? (
          <Skeleton variant="rounded" height={64} />
        ) : isError ? (
          <OneValueStat label="Completed Resources" value="—" helpText="Failed to load" />
        ) : (
          <OneValueStat label="Completed Resources" value={data ?? 0} helpText="Videos/files completed" />
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedResourcesWidget;
