"use client";

import { Card, CardContent, Box, Typography, Skeleton } from "@mui/material";
import { PieChart, Pie, Cell } from "recharts";
import { trpc } from "@/lib/trpc/client";

const CompletionRateWidget: React.FC = () => {
  const { data, isPending, isError } = trpc.courses.getOverallCompletionRate.useQuery();
  const percent = Math.max(0, Math.min(100, Number(data ?? 0)));

  const chartData = [
    { name: "completed", value: percent },
    { name: "remaining", value: 100 - percent },
  ];

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "custom.text.white", mb: 1 }}>
          Overall Completion
        </Typography>
        <Typography variant="body2" sx={{ color: "custom.text.light" }}>
          Completed content across enrolled courses
        </Typography>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 3 }}>
          {isPending ? (
            <Skeleton variant="circular" width={160} height={160} />
          ) : (
            <Box sx={{ position: "relative", width: 160, height: 160 }}>
              <PieChart width={160} height={160}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={55}
                  outerRadius={70}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? "#22d3ee" : "rgba(255,255,255,0.12)"}
                    />
                  ))}
                </Pie>
              </PieChart>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" sx={{ color: "custom.text.white" }}>
                  {isError ? "—" : `${Math.round(percent)}%`}
                </Typography>
              </Box>
            </Box>
          )}
          <Box>
            <Typography variant="subtitle2" sx={{ color: "custom.text.white" }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ color: "custom.text.light" }}>
              {isError ? "Failed to load" : `${Math.round(percent)}% completed`}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompletionRateWidget;
