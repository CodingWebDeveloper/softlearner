"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import AnalyticsCard from "@/components/creator/courses/analytics/analytics-card";
import { trpc } from "@/lib/trpc/client";

export interface RecentReviewsProps {
  courseId: string;
  loading?: boolean;
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ courseId, loading }) => {
  const { data, isLoading } = trpc.reviews.getCourseReviews.useQuery(
    {
      courseId,
      page: 1,
      pageSize: 3,
      sortBy: "created",
      sortDir: "desc",
    },
    { enabled: Boolean(courseId) }
  );

  const reviews = data?.reviews ?? [];

  return (
    <AnalyticsCard
      title="Recent Reviews"
      subtitle="Latest 3"
      loading={!!loading || isLoading}
    >
      {isLoading ? (
        <Stack spacing={1}>
          {[0, 1, 2].map((i) => (
            <Box key={i}>
              <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
                —
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ opacity: 0.6 }}
              >
                Loading...
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : !reviews.length ? (
        <Typography variant="body2" color="text.secondary">
          No reviews yet.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {reviews.map((r) => (
            <Box key={r.id}>
              <Typography variant="subtitle2">
                {`${r.rating}★ • ${new Date(
                  r.updated_at || r.created_at
                ).toLocaleDateString()}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {r.content}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </AnalyticsCard>
  );
}
;

export default RecentReviews;
