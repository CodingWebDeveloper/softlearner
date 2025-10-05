"use client";

import { Card, CardContent, Skeleton } from "@mui/material";
import OneValueStat from "@/components/creator/courses/analytics/widgets/one-value-stat";
import { trpc } from "@/lib/trpc/client";

const AverageTestScoreWidget: React.FC = () => {
  const { data, isPending, isError } = trpc.tests.getAverageTestScoreByUser.useQuery();

  const value =
    data === null || data === undefined
      ? "—"
      : `${Math.round(Math.max(0, Math.min(100, data)))}%`;

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary", height: "100%" }}>
      <CardContent>
        {isPending ? (
          <Skeleton variant="rounded" height={48} />
        ) : isError ? (
          <OneValueStat label="Average Test Score" value={"—"} helpText="Across all tests" />
        ) : (
          <OneValueStat label="Average Test Score" value={value} helpText="Across all tests" />
        )}
      </CardContent>
    </Card>
  );
};

export default AverageTestScoreWidget;
