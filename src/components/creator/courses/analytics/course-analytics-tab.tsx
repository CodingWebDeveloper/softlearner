"use client";

import React, { useMemo, useState } from "react";
import { Grid, Box, Typography, Stack, Chip } from "@mui/material";
import AnalyticsCard from "@/components/creator/courses/analytics/analytics-card";
import OneValueStat from "@/components/creator/courses/analytics/widgets/one-value-stat";
import TwoValueStat from "@/components/creator/courses/analytics/widgets/two-value-stat";
import GaugeStat from "@/components/creator/courses/analytics/widgets/gauge-stat";
import AreaChartWidget from "@/components/creator/courses/analytics/widgets/area-chart";
import BarChartWidget from "@/components/creator/courses/analytics/widgets/bar-chart";

export interface CourseAnalyticsTabProps {
  courseId: string;
  loading?: {
    totalEarnings?: boolean;
    salesAvg?: boolean;
    students?: boolean;
    earningsSeries?: boolean;
    completion?: boolean;
    averageRating?: boolean;
    ratingDistribution?: boolean;
    recentReviews?: boolean;
  };
}

// Placeholder mock data; replace with real data via tRPC in implementation phase
type PeriodKey = "7d" | "30d" | "1y" | "all";

const buildRevenueSeries = (period: PeriodKey) => {
  switch (period) {
    case "7d": {
      // Daily for last 7 days
      return [
        { period: "D-6", amount: 120 },
        { period: "D-5", amount: 180 },
        { period: "D-4", amount: 90 },
        { period: "D-3", amount: 240 },
        { period: "D-2", amount: 160 },
        { period: "D-1", amount: 300 },
        { period: "Today", amount: 210 },
      ];
    }
    case "30d": {
      // Weekly buckets for last ~5 weeks
      return [
        { period: "W1", amount: 420 },
        { period: "W2", amount: 530 },
        { period: "W3", amount: 380 },
        { period: "W4", amount: 760 },
        { period: "W5", amount: 610 },
      ];
    }
    case "1y": {
      // Monthly for last 12 months
      return [
        { period: "Oct", amount: 1200 },
        { period: "Nov", amount: 980 },
        { period: "Dec", amount: 1430 },
        { period: "Jan", amount: 1580 },
        { period: "Feb", amount: 1310 },
        { period: "Mar", amount: 1760 },
        { period: "Apr", amount: 1210 },
        { period: "May", amount: 1650 },
        { period: "Jun", amount: 1510 },
        { period: "Jul", amount: 1620 },
        { period: "Aug", amount: 1710 },
        { period: "Sep", amount: 1820 },
      ];
    }
    case "all":
    default: {
      // Quarterly over multiple years (mock)
      return [
        { period: "2023-Q1", amount: 2100 },
        { period: "2023-Q2", amount: 2680 },
        { period: "2023-Q3", amount: 2440 },
        { period: "2023-Q4", amount: 3120 },
        { period: "2024-Q1", amount: 3340 },
        { period: "2024-Q2", amount: 3590 },
        { period: "2024-Q3", amount: 3720 },
        { period: "2024-Q4", amount: 4100 },
      ];
    }
  }
};

const ratingDistribution = [
  { stars: "1★", count: 2 },
  { stars: "2★", count: 4 },
  { stars: "3★", count: 6 },
  { stars: "4★", count: 18 },
  { stars: "5★", count: 30 },
];

const recentReviews = [
  { id: "r1", rating: 5, content: "Great course!", createdAt: "2025-09-01" },
  { id: "r2", rating: 4, content: "Very informative.", createdAt: "2025-09-05" },
  { id: "r3", rating: 3, content: "Good, but could be shorter.", createdAt: "2025-09-12" },
];

const currency = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const CourseAnalyticsTab: React.FC<CourseAnalyticsTabProps> = ({ courseId, loading }) => {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const revenueSeries = useMemo(() => buildRevenueSeries(period), [period]);
  return (
    <Box>
      <Grid container spacing={2}>
        {/* Top stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard title="Total Earnings" subtitle="All time" loading={!!loading?.totalEarnings}>
            <OneValueStat
              label="Revenue"
              value={currency(18540)}
              delta={{ value: "+12%", direction: "up", tooltip: "vs last 30 days" }}
              helpText="Completed orders only"
            />
          </AnalyticsCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard title="Sales & Avg Price" subtitle="All time" loading={!!loading?.salesAvg}>
            <TwoValueStat labelLeft="Total Sales" valueLeft={342} labelRight="Avg Price" valueRight={currency(54)} />
          </AnalyticsCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard title="Students" subtitle="Enrollment" loading={!!loading?.students}>
            <TwoValueStat labelLeft="Total Students" valueLeft={298} labelRight="New (30d)" valueRight={42} />
          </AnalyticsCard>
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsCard
            title="Earnings Over Time"
            subtitle={
              period === "7d"
                ? "Last 7 days"
                : period === "30d"
                ? "Last 30 days"
                : period === "1y"
                ? "Last 12 months"
                : "All time"
            }
            disablePadding
            loading={!!loading?.earningsSeries}
            action={
              <Stack direction="row" spacing={1}>
                {([
                  { key: "7d", label: "7d" },
                  { key: "30d", label: "30d" },
                  { key: "1y", label: "1y" },
                  { key: "all", label: "All" },
                ] as { key: PeriodKey; label: string }[]).map((p) => (
                  <Chip
                    key={p.key}
                    label={p.label}
                    size="small"
                    color={period === p.key ? "primary" : "default"}
                    variant={period === p.key ? "filled" : "outlined"}
                    onClick={() => setPeriod(p.key)}
                  />
                ))}
              </Stack>
            }
          >
            <AreaChartWidget data={revenueSeries} xKey="period" yKey="amount" formatY={(v) => `$${v}`} />
          </AnalyticsCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard title="Completion Rate" subtitle="Course-wide" loading={!!loading?.completion}>
            <GaugeStat label="Completion" value={64} helpText="Percentage of enrolled students who completed the course" />
          </AnalyticsCard>
        </Grid>

        {/* Feedback */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard title="Average Rating" subtitle="All reviews" loading={!!loading?.averageRating}>
            <OneValueStat label="Average" value={4.6} helpText="Out of 5 stars" />
          </AnalyticsCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard title="Rating Distribution" subtitle="Count by stars" disablePadding loading={!!loading?.ratingDistribution}>
            <Box px={2} pt={2}>
              <BarChartWidget data={ratingDistribution} xKey="stars" yKey="count" />
            </Box>
          </AnalyticsCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard title="Recent Reviews" subtitle="Latest 3" loading={!!loading?.recentReviews}>
            <Stack spacing={1}>
              {recentReviews.map((r) => (
                <Box key={r.id}>
                  <Typography variant="subtitle2">{`${r.rating}★ • ${r.createdAt}`}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.content}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </AnalyticsCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseAnalyticsTab;
