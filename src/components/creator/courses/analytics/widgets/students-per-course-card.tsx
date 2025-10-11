"use client";

import React, { useMemo } from "react";
import AnalyticsCard from "../analytics-card";
import BarChartWidget from "./bar-chart";
import { trpc } from "@/lib/trpc/client";

const StudentsPerCourseCard: React.FC = () => {
  const { data, isPending } = trpc.ordersKpi.getStudentsByCourse.useQuery({
    limit: 10,
  });

  const chartData = useMemo(() => {
    const items = data || [];
    return items.map((c) => ({
      label: c.name,
      students: Number(c.count || 0),
    }));
  }, [data]);

  return (
    <AnalyticsCard
      title="Students per Course"
      subtitle="By enrollments"
      disablePadding
      loading={isPending}
    >
      <BarChartWidget
        data={chartData}
        xKey="label"
        yKey="students"
        formatY={(v: number) => String(v)}
      />
    </AnalyticsCard>
  );
};

export default StudentsPerCourseCard;
