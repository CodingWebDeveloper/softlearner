"use client";

import React from "react";
import OneValueStat from "@/components/creator/courses/analytics/widgets/one-value-stat";
import { trpc } from "@/lib/trpc/client";

export interface AverageRatingProps {
  courseId: string;
}

const AverageRating: React.FC<AverageRatingProps> = ({ courseId }) => {
  const { data, isLoading } = trpc.reviews.getCourseRatingStats.useQuery(courseId, {
    enabled: Boolean(courseId),
  });

  const average = data?.average ?? 0;

  // The surrounding AnalyticsCard handles loading state UI; render placeholder value if loading
  return (
    <OneValueStat label="Average" value={isLoading ? "-" : average} helpText="Out of 5 stars" />
  );
};

export default AverageRating;
