"use client";

import React from "react";
import AnalyticsCard from "../analytics-card";
import { trpc } from "@/lib/trpc/client";
import { Box, Typography, Rating } from "@mui/material";

const AverageRatingCard: React.FC = () => {
  const { data, isPending } = trpc.reviewsKpi.getCreatorAverageRating.useQuery();
  const avg = typeof data === "number" ? data : null;

  return (
    <AnalyticsCard
      title="Average Rating"
      subtitle="Across all your courses"
      loading={isPending}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h3" component="div" fontWeight={700}>
          {avg !== null ? avg.toFixed(2) : "-"}
        </Typography>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Rating value={avg ?? 0} readOnly precision={0.1} />
          <Typography variant="caption" color="text.secondary">
            out of 5
          </Typography>
        </Box>
      </Box>
    </AnalyticsCard>
  );
};

export default AverageRatingCard;
