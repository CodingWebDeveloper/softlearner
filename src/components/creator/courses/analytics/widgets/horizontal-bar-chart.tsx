"use client";

import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartValue = string | number | boolean | null | undefined;

export interface HorizontalBarChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T; // numeric value
  yKey: keyof T; // label
  color?: string;
  height?: number;
  formatX?: (value: ChartValue, index: number) => string;
  formatY?: (value: ChartValue, index: number) => string;
}

const HorizontalBarChart = <T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  color,
  height = 260,
  formatX,
  formatY,
}: HorizontalBarChartProps<T>) => {
  const theme = useTheme();
  const fillColor = color || theme.palette.primary.main;
  const xTickFormatter = React.useCallback(
    (value: ChartValue, index: number) =>
      formatX ? formatX(value, index) : String(value ?? ""),
    [formatX],
  );
  const yTickFormatter = React.useCallback(
    (value: ChartValue, index: number) =>
      formatY ? formatY(value, index) : String(value ?? ""),
    [formatY],
  );

  return (
    <Box sx={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={xTickFormatter} />
          <YAxis
            type="category"
            dataKey={yKey as string}
            tickFormatter={yTickFormatter}
            width={140}
          />
          <Tooltip />
          <Bar
            dataKey={xKey as string}
            fill={fillColor}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default HorizontalBarChart;
