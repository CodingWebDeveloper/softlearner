"use client";

import { Card, CardContent, Skeleton } from "@mui/material";
import OneValueStat from "@/components/creator/courses/analytics/widgets/one-value-stat";
import { trpc } from "@/lib/trpc/client";

const ReviewsCountWidget: React.FC = () => {
  const { data, isPending, isError } = trpc.courses.getReviewsCount.useQuery();

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary", height: "100%" }}>
      <CardContent>
        {isPending ? (
          <Skeleton variant="rounded" height={48} />
        ) : isError ? (
          <OneValueStat label="Total Reviews" value={"—" as any} helpText="Given by you" />
        ) : (
          <OneValueStat label="Total Reviews" value={data ?? 0} helpText="Given by you" />
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsCountWidget;
