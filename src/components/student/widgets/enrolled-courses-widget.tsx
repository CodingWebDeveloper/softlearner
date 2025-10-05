"use client";

import { Card, CardContent, Skeleton } from "@mui/material";
import OneValueStat from "@/components/creator/courses/analytics/widgets/one-value-stat";
import { trpc } from "@/lib/trpc/client";

const EnrolledCoursesWidget: React.FC = () => {
  const { data, isPending, isError } = trpc.courses.getTotalEnrolledCourses.useQuery();

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary", height: "100%" }}>
      <CardContent>
        {isPending ? (
          <Skeleton variant="rounded" height={64} />
        ) : isError ? (
          <OneValueStat label="Total Enrolled" value="—" helpText="Failed to load" />
        ) : (
          <OneValueStat label="Total Enrolled" value={data ?? 0} helpText="Courses you own" />
        )}
      </CardContent>
    </Card>
  );
};

export default EnrolledCoursesWidget;
