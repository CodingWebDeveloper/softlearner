"use client";

import { Grid, Stack } from "@mui/material";
import {} from "@/components/styles/infrastructure/layout.styles";
import EnrolledCoursesWidget from "@/components/student/widgets/enrolled-courses-widget";
import CompletedResourcesWidget from "@/components/student/widgets/completed-resources-widget";
import CompletionRateWidget from "@/components/student/widgets/completion-rate-widget";
import ActiveCoursesWidget from "@/components/student/widgets/active-courses-widget";
import ReviewsCountWidget from "@/components/student/widgets/reviews-count-widget";
import WelcomeCard from "@/components/student/widgets/welcome-card";
import ActivityHeatMapWidget from "@/components/student/widgets/activity-heatmap-widget";
import AverageTestScoreWidget from "@/components/student/widgets/average-test-score-widget";
import RecentTestResultsWidget from "@/components/student/widgets/recent-test-results-widget";

export default function StudentDashboard() {
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
