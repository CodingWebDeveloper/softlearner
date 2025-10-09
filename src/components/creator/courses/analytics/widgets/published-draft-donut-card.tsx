"use client";

import React from "react";
import AnalyticsCard from "../analytics-card";
import { trpc } from "@/lib/trpc/client";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22d3ee", "#64748b"]; // published, draft

const PublishedDraftDonutCard: React.FC = () => {
  // Fetch up to 1000 creator courses and compute counts client-side
  // TODO: Optimize for getting the total number of drafted and published courses
  const { data, isLoading } = trpc.courses.getCreatorCourses.useQuery({
    page: 1,
  });

  const courses = data?.data ?? [];
  const total = courses.length;
  const published = courses.filter((c) => c.is_published).length;
  const draft = total - published;

  const chartData = [
    { name: "Published", value: published },
    { name: "Draft", value: draft },
  ];

  return (
    <AnalyticsCard
      title="Courses"
      subtitle="Published vs Draft"
      loading={isLoading}
    >
      <Box sx={{ position: "relative", width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: any, n: any) => [v as number, n as string]}
            />
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Box textAlign="center">
            <Typography variant="h5">{total}</Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Box>
        </Box>
      </Box>
    </AnalyticsCard>
  );
};

export default PublishedDraftDonutCard;
