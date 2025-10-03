"use client";

import React from "react";
import OneValueStat from "@/components/creator/courses/analytics/widgets/one-value-stat";
import AnalyticsCard from "@/components/creator/courses/analytics/analytics-card";
import { trpc } from "@/lib/trpc/client";

export interface AverageRatingProps {
  courseId: string;
  loading?: boolean;
}

const AverageRating: React.FC<AverageRatingProps> = ({ courseId, loading }) => {
  const { data, isLoading } = trpc.reviews.getCourseRatingStats.useQuery(
    courseId,
    {
      enabled: Boolean(courseId),
    }
  );

  const average = data?.average ?? 0;

  return (
    <AnalyticsCard
      title="Average Rating"
      subtitle="All reviews"
      loading={!!loading || isLoading}
    >
      <OneValueStat
        label="Average"
        value={isLoading ? "-" : average}
        helpText="Out of 5 stars"
      />
    </AnalyticsCard>
  );
};

export default AverageRating;
