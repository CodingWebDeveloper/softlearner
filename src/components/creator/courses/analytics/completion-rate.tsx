"use client";

import React from "react";
import GaugeStat from "@/components/creator/courses/analytics/widgets/gauge-stat";
import AnalyticsCard from "@/components/creator/courses/analytics/analytics-card";
import { trpc } from "@/lib/trpc/client";

export interface CompletionRateProps {
  courseId: string;
  loading?: boolean;
}

const CompletionRate: React.FC<CompletionRateProps> = ({ courseId, loading }) => {
  const { data, isLoading } = trpc.courses.getCourseCompletionRate.useQuery(
    courseId,
    { enabled: Boolean(courseId) }
  );

  const value = isLoading ? 0 : data ?? 0;

  return (
    <AnalyticsCard
      title="Completion Rate"
      subtitle="Course-wide"
      loading={!!loading || isLoading}
    >
      <GaugeStat
        label="Completion"
        value={value}
        helpText="Percentage of enrolled students who completed the course"
      />
    </AnalyticsCard>
  );
};

export default CompletionRate;
