"use client";

import React, { useMemo } from "react";
import BarChartWidget from "@/components/creator/courses/analytics/widgets/bar-chart";
import AnalyticsCard from "@/components/creator/courses/analytics/analytics-card";
import { trpc } from "@/lib/trpc/client";

export interface RatingDistributionProps {
  courseId: string;
  loading?: boolean;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({
  courseId,
  loading,
}) => {
  const { data } = trpc.reviews.getCourseRatingStats.useQuery(courseId, {
    enabled: Boolean(courseId),
  });

  const chartData = useMemo(() => {
    const breakdown = data?.breakdown || [0, 0, 0, 0, 0]; // [5,4,3,2,1]
    return [
      { stars: "1★", count: breakdown[4] ?? 0 },
      { stars: "2★", count: breakdown[3] ?? 0 },
      { stars: "3★", count: breakdown[2] ?? 0 },
      { stars: "4★", count: breakdown[1] ?? 0 },
      { stars: "5★", count: breakdown[0] ?? 0 },
    ];
  }, [data?.breakdown]);

  return (
    <AnalyticsCard
      title="Rating Distribution"
      subtitle="Count by stars"
      disablePadding
      loading={!!loading}
    >
      <BarChartWidget data={chartData} xKey="stars" yKey="count" />
    </AnalyticsCard>
  );
};

export default RatingDistribution;
