"use client";

import React from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";

export interface GaugeStatProps {
  label: string;
  value: number; // 0 - 100
  suffix?: string; // e.g. "%"
  helpText?: string;
}

const GaugeStat: React.FC<GaugeStatProps> = ({ label, value, suffix = "%", helpText }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <Stack spacing={1} alignItems="center" textAlign="center">
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={clamped} size={96} thickness={5} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" component="div" fontWeight={700}>{`${Math.round(
            clamped
          )}${suffix}`}</Typography>
        </Box>
      </Box>
      {helpText && (
        <Typography variant="body2" color="text.secondary">
          {helpText}
        </Typography>
      )}
    </Stack>
  );
};

export default GaugeStat;
