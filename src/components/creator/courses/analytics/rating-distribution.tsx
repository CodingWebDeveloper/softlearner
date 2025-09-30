"use client";

import React, { useMemo } from "react";
import BarChartWidget from "@/components/creator/courses/analytics/widgets/bar-chart";
import { trpc } from "@/lib/trpc/client";
import { Box } from "@mui/material";

export interface RatingDistributionProps {
  courseId: string;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({ courseId }) => {
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
    <Box px={2} pt={2}>
      <BarChartWidget data={chartData} xKey="stars" yKey="count" />
    </Box>
  );
};

export default RatingDistribution;
