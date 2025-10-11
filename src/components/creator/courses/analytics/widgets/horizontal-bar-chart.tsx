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

export interface HorizontalBarChartProps<T extends Record<string, any>> {
  data: T[];
  xKey: keyof T; // numeric value
  yKey: keyof T; // label
  color?: string;
  height?: number;
  formatX?: (value: any, index: number) => string;
  formatY?: (value: any, index: number) => string;
}

const HorizontalBarChart = <T extends Record<string, any>>({
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
    (v: any, i: number) => (formatX ? formatX(v, i) : String(v)),
    [formatX]
  );
  const yTickFormatter = React.useCallback(
    (v: any, i: number) => (formatY ? formatY(v, i) : String(v)),
    [formatY]
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
