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

export interface BarChartWidgetProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string;
  height?: number;
  formatY?: (value: number) => string | number;
  formatX?: (value: ChartValue) => string | number;
}

const BarChartWidget = <T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  color,
  height = 220,
  formatY,
  formatX,
}: BarChartWidgetProps<T>) => {
  const theme = useTheme();
  const fillColor = color || theme.palette.primary.main;
  return (
    <Box sx={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey as string} tickFormatter={formatX} />
          <YAxis tickFormatter={formatY} />
          <Tooltip
            formatter={(value: ChartValue) =>
              formatY ? formatY(Number(value)) : String(value ?? "")
            }
          />
          <Bar
            dataKey={yKey as string}
            fill={fillColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartWidget;
