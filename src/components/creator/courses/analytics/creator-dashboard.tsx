"use client";

import React from "react";
import { Grid } from "@mui/material";
import CurrentMonthRevenueCard from "./widgets/current-month-revenue-card";
import RevenueSeriesCard from "./widgets/revenue-series-card";
import PublishedDraftDonutCard from "./widgets/published-draft-donut-card";
import TotalRevenueCard from "./widgets/total-revenue-card";

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
      {/* Row 2 */}
      <Grid size={{ xs: 12, md: 8 }}>
        <RevenueSeriesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <PublishedDraftDonutCard />
      </Grid>
    </Grid>
  );
};

export default CreatorDashboard;
