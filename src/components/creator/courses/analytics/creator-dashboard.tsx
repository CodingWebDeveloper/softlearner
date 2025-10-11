"use client";

import React from "react";
import { Grid } from "@mui/material";
import CurrentMonthRevenueCard from "./widgets/current-month-revenue-card";
import RevenueSeriesCard from "./widgets/revenue-series-card";
import PublishedDraftDonutCard from "./widgets/published-draft-donut-card";
import TotalRevenueCard from "./widgets/total-revenue-card";
import TopEarningCoursesCard from "./widgets/top-earning-courses-card";
import StudentsPerCourseCard from "./widgets/students-per-course-card";
import RecentReviewsCard from "./widgets/recent-reviews-card";
import AverageRatingCard from "./widgets/average-rating-card";

const CreatorDashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {/* Row 1 */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <TotalRevenueCard />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <CurrentMonthRevenueCard />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AverageRatingCard />
      </Grid>
      {/* Row 2 */}
      <Grid size={{ xs: 12, md: 8 }}>
        <RevenueSeriesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <PublishedDraftDonutCard />
      </Grid>
      {/* Row 3 */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TopEarningCoursesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <StudentsPerCourseCard />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <RecentReviewsCard />
      </Grid>
    </Grid>
  );
};

export default CreatorDashboard;
