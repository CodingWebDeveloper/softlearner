"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";

export interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
  disablePadding?: boolean;
}

/**
 * AnalyticsCard
 *
 * A reusable, opinionated card wrapper for analytics widgets.
 * It standardizes header, content spacing, optional actions and footers.
 */
const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  subtitle,
  action,
  footer,
  loading = false,
  children,
  disablePadding = false,
}) => {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={600} component="div">
              {title}
            </Typography>
          </Box>
        }
        subheader={subtitle}
        action={action}
        sx={{ pb: 0.5 }}
      />

      <Divider />

      <CardContent sx={{ p: disablePadding ? 0 : 2 }}>
        {loading ? (
          <Box>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={140} sx={{ mt: 1 }} />
          </Box>
        ) : (
          children
        )}
      </CardContent>

      {footer && (
        <>
          <Divider />
          <CardActions sx={{ px: 2, py: 1 }}>{footer}</CardActions>
        </>
      )}
    </Card>
  );
};

export default AnalyticsCard;
