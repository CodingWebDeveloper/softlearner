"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Grid, Box } from "@mui/material";
import CompletionRate from "@/components/creator/courses/analytics/completion-rate";
import { trpc } from "@/lib/trpc/client";
import { detectUserCurrency, fetchRates, Rates } from "@/utils/currency";
import TotalEarnings from "./total-earnings";
import AverageSales from "./average-sales";
import Enrollment from "./enrollment";
import EarningsOverTime from "./earnings-over-time";
import AverageRating from "./average-rating";
import RatingDistribution from "./rating-distribution";
import RecentReviews from "./recent-reviews";

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

const CourseAnalyticsTab: React.FC<CourseAnalyticsTabProps> = ({
  courseId,
  loading,
}) => {
  const userCurrency = useMemo(() => detectUserCurrency(), []);
  const [rates, setRates] = useState<Rates | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  // Fetch FX rates with base USD so we can convert any currency to userCurrency
  useEffect(() => {
    let mounted = true;
    setRatesLoading(true);
    fetchRates("USD")
      .then((r) => {
        if (mounted) setRates(r);
      })
      .catch(() => {
        if (mounted) setRates(null);
      })
      .finally(() => mounted && setRatesLoading(false));
    return () => {
      mounted = false;
    };
  }, [userCurrency]);

  // Orders for earnings
  const ordersQuery = trpc.orders.getOrdersByCourseId.useQuery(courseId, {
    enabled: Boolean(courseId),
  });

  // Completion rate handled in CompletionRate component

  const totalEarningsLoading =
    ordersQuery.isLoading || ratesLoading || !!loading?.totalEarnings;

  // Sales and average price (converted)
  const salesAvgLoading =
    ordersQuery.isLoading || ratesLoading || !!loading?.salesAvg;

  const studentsLoading = ordersQuery.isLoading || !!loading?.students;

  const earningsSeriesLoading =
    ordersQuery.isLoading || ratesLoading || !!loading?.earningsSeries;

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Top stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TotalEarnings
            rates={rates}
            userCurrency={userCurrency}
            orders={ordersQuery.data ?? []}
            isLoading={totalEarningsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AverageSales
            rates={rates}
            userCurrency={userCurrency}
            orders={ordersQuery.data ?? []}
            isLoading={salesAvgLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Enrollment
            orders={ordersQuery.data ?? []}
            isLoading={studentsLoading}
          />
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, md: 8 }}>
          <EarningsOverTime
            orders={ordersQuery.data ?? []}
            isLoading={earningsSeriesLoading}
            userCurrency={userCurrency}
            rates={rates}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CompletionRate courseId={courseId} loading={!!loading?.completion} />
        </Grid>
        {/* Feedback */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AverageRating
            courseId={courseId}
            loading={!!loading?.averageRating}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RatingDistribution
            courseId={courseId}
            loading={!!loading?.ratingDistribution}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentReviews
            courseId={courseId}
            loading={!!loading?.recentReviews}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default CourseAnalyticsTab;
