"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  LightText,
  WhiteText,
} from "@/components/styles/infrastructure/layout.styles";
import EnrolledCoursesWidget from "@/components/student/widgets/enrolled-courses-widget";
import CompletedResourcesWidget from "@/components/student/widgets/completed-resources-widget";
import CompletionRateWidget from "@/components/student/widgets/completion-rate-widget";
import ActiveCoursesWidget from "@/components/student/widgets/active-courses-widget";
import ReviewsCountWidget from "@/components/student/widgets/reviews-count-widget";
import WelcomeCard from "@/components/student/widgets/welcome-card";
import { PieChart, Pie, Cell } from "recharts";
import ActivityHeatMapWidget from "@/components/student/widgets/activity-heatmap-widget";
import AverageTestScoreWidget from "@/components/student/widgets/average-test-score-widget";
import RecentTestResultsWidget from "@/components/student/widgets/recent-test-results-widget";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h6" sx={{ color: "custom.text.white", mb: 1 }}>
    {children}
  </Typography>
);

const SubtleText = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" sx={{ color: "custom.text.light" }}>
    {children}
  </Typography>
);

// Donut chart using Recharts
function CompletionDonut({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent || 0));
  const data = [
    { name: "completed", value: clamped },
    { name: "remaining", value: 100 - clamped },
  ];
  return (
    <Box sx={{ position: "relative", width: 160, height: 160 }}>
      <PieChart width={160} height={160}>
        <Pie
          data={data}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          innerRadius={55}
          outerRadius={70}
          stroke="none"
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? "#22d3ee" : "rgba(255,255,255,0.12)"}
            />
          ))}
        </Pie>
      </PieChart>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "custom.text.white" }}>
          {Math.round(clamped)}%
        </Typography>
      </Box>
    </Box>
  );
}

//

export default function StudentDashboard() {
  // TODO: Replace placeholders with real queries. Examples (pseudo):
  // - Average test score: AVG(user_tests.score)
  // - Recent test results: latest N user_tests

  // Placeholders to keep UI functional now
  const overallCompletionPct = 0; // 0-100
  const totalEnrolledCourses = 0; // count of SUCCEEDED orders for user
  const totalCompletedResources = 0; // count of completed resources
  const totalReviews = 0; // count of reviews by user
  const topCourses = [
    { id: "1", name: "Course A", progress: 0.35 },
    { id: "2", name: "Course B", progress: 0.6 },
    { id: "3", name: "Course C", progress: 0.1 },
  ];
  const avgTestScore = null as null | number; // 0-100
  const recentTests: Array<{
    id: string;
    title: string;
    score: number;
    createdAt: string;
  }> = [];

  // Placeholder values for the last ~105 days (0..6 counts)
  // Activity heatmap now fetched via tRPC in ActivityHeatMapWidget

  return (
    <Stack spacing={3}>
      <WelcomeCard />
      {/* Stats row */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnrolledCoursesWidget />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CompletedResourcesWidget />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReviewsCountWidget />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ActiveCoursesWidget />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CompletionRateWidget />
        </Grid>
      </Grid>
      {/* Test performance */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AverageTestScoreWidget />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <RecentTestResultsWidget />
        </Grid>
      </Grid>

      {/* Activity heatmap */}
      <ActivityHeatMapWidget />
    </Stack>
  );
}
