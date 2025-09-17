"use client";

import React, { useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { useTheme } from "@mui/material/styles";
import { trpc } from "@/lib/trpc/client";

interface CourseChecklistProps {
  courseId: string;
  setIsPublished: (value: boolean) => void;
}

export default function CourseChecklist({
  courseId,
  setIsPublished,
}: CourseChecklistProps) {
  const theme = useTheme();

  const { data: status, isPending: progressStatusPending } =
    trpc.courses.getCourseProgressStatus.useQuery(courseId!, {
      enabled: Boolean(courseId),
    });

  const colors = {
    bg: theme.palette.custom.background.card,
    border: theme.palette.custom.background.tertiary,
    textPrimary: theme.palette.custom.text.white,
    textSecondary: theme.palette.custom.text.light,
    success: theme.palette.custom.accent.green,
    pending: theme.palette.custom.accent.gray,
  } as const;

  // Effects
  useEffect(() => {
    if (status) {
      setIsPublished(status.publish);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (progressStatusPending || !Boolean(status)) {
    return <Skeleton variant="rectangular" width={300} height={300} />;
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        p: 2.5,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1.5 }}
      >
        Course Checklist
      </Typography>

      <List sx={{ p: 0 }}>
        <ListItem sx={{ px: 0 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {status?.general ? (
              <CheckCircleRoundedIcon htmlColor={colors.success} />
            ) : (
              <RadioButtonUncheckedRoundedIcon htmlColor={colors.pending} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                Add Course Details
              </Typography>
            }
            secondary={
              <Typography sx={{ color: colors.textSecondary }}>
                Course Name, Description, Thumbnail
              </Typography>
            }
          />
        </ListItem>

        <ListItem sx={{ px: 0 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {status?.resources ? (
              <CheckCircleRoundedIcon htmlColor={colors.success} />
            ) : (
              <RadioButtonUncheckedRoundedIcon htmlColor={colors.pending} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                Upload Course Resources (Optional)
              </Typography>
            }
            secondary={
              <Typography sx={{ color: colors.textSecondary }}>
                e.g., videos, PDFs
              </Typography>
            }
          />
        </ListItem>

        <ListItem sx={{ px: 0 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {status?.tags ? (
              <CheckCircleRoundedIcon htmlColor={colors.success} />
            ) : (
              <RadioButtonUncheckedRoundedIcon htmlColor={colors.pending} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                Add Tags (Optional)
              </Typography>
            }
            secondary={
              <Typography sx={{ color: colors.textSecondary }}>
                Improve discoverability with relevant tags
              </Typography>
            }
          />
        </ListItem>

        <ListItem sx={{ px: 0 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {status?.quizzes ? (
              <CheckCircleRoundedIcon htmlColor={colors.success} />
            ) : (
              <RadioButtonUncheckedRoundedIcon htmlColor={colors.pending} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                Create a Quiz (Optional)
              </Typography>
            }
          />
        </ListItem>

        <ListItem sx={{ px: 0 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {status?.publish ? (
              <CheckCircleRoundedIcon htmlColor={colors.success} />
            ) : (
              <RadioButtonUncheckedRoundedIcon htmlColor={colors.pending} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                Adjust Settings & Publish
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Box>
  );
}
