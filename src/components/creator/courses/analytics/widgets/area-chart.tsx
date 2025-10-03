"use client";

import React, { useId } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface AreaChartWidgetProps<T extends Record<string, any>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string; // override; defaults to theme.palette.primary.main
  height?: number;
  formatY?: (value: number) => string | number;
  formatX?: (value: any) => string | number;
}

const AreaChartWidget = <T extends Record<string, any>>({
  data,
  xKey,
  yKey,
  color,
  height = 220,
  formatY,
  formatX,
}: AreaChartWidgetProps<T>) => {
  const theme = useTheme();
  const strokeColor = color || theme.palette.primary.main;
  const gradientId = useId();
  return (
    <Box sx={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey as string} tickFormatter={formatX} />
          <YAxis tickFormatter={formatY} />
          <Tooltip formatter={(v: any) => (formatY ? formatY(Number(v)) : v)} />
          <Area type="monotone" dataKey={yKey as string} stroke={strokeColor} fillOpacity={1} fill={`url(#${gradientId})`} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AreaChartWidget;
