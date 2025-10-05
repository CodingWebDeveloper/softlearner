"use client";

import { Card, CardContent, List, ListItem, ListItemText, Skeleton, Typography } from "@mui/material";
import { trpc } from "@/lib/trpc/client";

const ActiveCoursesWidget: React.FC = () => {
  const { data, isPending, isError } = trpc.courses.getCourseProgressData.useQuery({ page: 1, pageSize: 3 });

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "custom.text.white", mb: 1 }}>
          Active Courses
        </Typography>
        <Typography variant="body2" sx={{ color: "custom.text.light", mb: 2 }}>
          Top 3 by progress (completed resources)
        </Typography>
        {isPending ? (
          <>
            <Skeleton variant="rounded" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={24} />
          </>
        ) : isError || !data ? (
          <Typography variant="body2" sx={{ color: "custom.text.light" }}>Failed to load</Typography>
        ) : data.data.length === 0 ? (
          <Typography variant="body2" sx={{ color: "custom.text.light" }}>No courses yet</Typography>
        ) : (
          <List dense>
            {data.data.map((item, idx) => (
              <ListItem key={idx} sx={{ px: 0 }}>
                <ListItemText
                  primaryTypographyProps={{ sx: { color: "custom.text.white" } }}
                  secondaryTypographyProps={{ sx: { color: "custom.text.light" } }}
                  primary={`Course #${item.id.slice(0, 8)}`}
                  secondary={`${item.resourcesCompletedCount}/${item.resourceCount} completed`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveCoursesWidget;
