"use client";

import React from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";

export interface TwoValueStatProps {
  labelLeft: string;
  valueLeft: string | number;
  labelRight: string;
  valueRight: string | number;
  helpText?: string;
}

const TwoValueStat: React.FC<TwoValueStatProps> = ({
  labelLeft,
  valueLeft,
  labelRight,
  valueRight,
  helpText,
}) => {
  return (
    <Stack spacing={1}>
      <Box display="flex" alignItems="stretch" gap={2}>
        <Box flex={1}>
          <Typography variant="caption" color="text.secondary">
            {labelLeft}
          </Typography>
          <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
            {valueLeft}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box flex={1}>
          <Typography variant="caption" color="text.secondary">
            {labelRight}
          </Typography>
          <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
            {valueRight}
          </Typography>
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

export default TwoValueStat;
