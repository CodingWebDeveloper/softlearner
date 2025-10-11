"use client";

import React, { useMemo } from "react";
import AnalyticsCard from "../analytics-card";
import { trpc } from "@/lib/trpc/client";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import { AvatarImage } from "@/components/profile/avatar-image";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}
const RecentReviewsCard: React.FC = () => {
  const { data, isPending } = trpc.reviewsKpi.getCreatorRecentReviews.useQuery({
    page: 1,
    pageSize: 4,
  });

  const items = useMemo(() => data?.data ?? [], [data]);

  return (
    <AnalyticsCard
      title="Recent Reviews"
      subtitle="Latest across your courses"
      loading={isPending}
    >
      {items.length === 0 && !isPending ? (
        <Typography variant="body2" color="text.secondary">
          No recent reviews.
        </Typography>
      ) : (
        <List disablePadding>
          {items.map((r, idx) => (
            <React.Fragment key={r.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <AvatarImage
                    size="small"
                    avatarUrl={r.user.avatar_url}
                    alt={r.user.full_name ?? "Anonymous"}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      flexWrap="wrap"
                    >
                      <Typography variant="subtitle2" component="span">
                        {r.user.full_name || "Anonymous"}
                      </Typography>
                      <Rating
                        size="small"
                        value={Number(r.rating) || 0}
                        readOnly
                        precision={0.5}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="span"
                      >
                        on {formatDate(r.created_at)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.primary">
                      {r.content}
                    </Typography>
                  }
                />
              </ListItem>
              {idx < items.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </AnalyticsCard>
  );
};

export default RecentReviewsCard;
