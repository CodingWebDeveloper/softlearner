"use client";

import { useMemo } from "react";
import { Box, Card, CardContent, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HeatMap from "@uiw/react-heat-map";
import { trpc } from "@/lib/trpc/client";

function aggregateByDate(items: Array<{ completed_at: string }>) {
  const counts = new Map<string, number>();
  for (const it of items) {
    const d = new Date(it.completed_at);
    // Use yyyy-mm-dd as key
    const key = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    )
      .toISOString()
      .slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}

export default function ActivityHeatMapWidget({ year }: { year?: number }) {
  const theme = useTheme();
  const currentYear = useMemo(() => year ?? new Date().getFullYear(), [year]);

  const { data, isLoading, isError, error } =
    trpc.resources.getUserCompletedResourcesByYear.useQuery({
      year: currentYear,
    });

  console.log(data);

  const { startDate, endDate } = useMemo(() => {
    const start = new Date(Date.UTC(currentYear, 0, 1));
    const end = new Date(Date.UTC(currentYear, 11, 31));
    return { startDate: start, endDate: end };
  }, [currentYear]);

  const values = useMemo(() => {
    if (!data) return [] as { date: string; count: number }[];
    return aggregateByDate(data).map((v) => ({ ...v }));
  }, [data]);

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary" }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "custom.text.white", mb: 1 }}>
          Activity
        </Typography>
        <Typography variant="body2" sx={{ color: "custom.text.light" }}>
          Daily learning activity in {currentYear}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {isLoading ? (
            <Typography variant="body2" sx={{ color: "custom.text.light" }}>
              Loading activity...
            </Typography>
          ) : isError ? (
            <Typography variant="body2" sx={{ color: "custom.accent.red" }}>
              {error instanceof Error
                ? error.message
                : "Failed to load activity"}
            </Typography>
          ) : (
            <HeatMap
              value={values}
              startDate={startDate}
              endDate={endDate}
              width="100%"
              rectSize={12}
              legendCellSize={10}
              space={2}
              style={{ color: theme.palette.custom.text.light }}
              panelColors={{
                0: theme.palette.custom.background.card,
                1: theme.palette.custom.accent.teal,
                2: theme.palette.custom.accent.tealDark,
                3: theme.palette.custom.accent.green,
                4: theme.palette.custom.accent.blue,
                5: theme.palette.custom.accent.yellow,
                6: theme.palette.custom.accent.red,
              }}
              rectRender={(props, data) => {
                // if (!data.count) return <rect {...props} />;
                return (
                  <Tooltip
                    placement="top"
                    title={`count: ${data.count || 0}`}
                  >
                    <rect {...props} />
                  </Tooltip>
                );
              }}
              rectProps={{ rx: 2, ry: 2 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
