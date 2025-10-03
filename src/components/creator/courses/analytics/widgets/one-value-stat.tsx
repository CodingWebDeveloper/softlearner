"use client";

import React from "react";
import { Box, Typography, Chip, Stack, Tooltip } from "@mui/material";

export interface OneValueStatProps {
  label?: string;
  value: string | number;
  helpText?: string;
  delta?: { value: string; direction: "up" | "down" | "neutral"; tooltip?: string };
}

const colorByDirection = {
  up: "success" as const,
  down: "error" as const,
  neutral: "default" as const,
};

const OneValueStat: React.FC<OneValueStatProps> = ({ label, value, helpText, delta }) => {
  return (
    <Stack spacing={0.5}>
      {label && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
          {value}
        </Typography>
        {delta && (
          <Tooltip title={delta.tooltip || ""}>
            <Chip size="small" color={colorByDirection[delta.direction]} label={delta.value} />
          </Tooltip>
        )}
      </Box>
      {helpText && (
        <Typography variant="body2" color="text.secondary">
          {helpText}
        </Typography>
      )}
    </Stack>
  );
};

export default OneValueStat;
