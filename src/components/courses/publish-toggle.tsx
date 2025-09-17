import { useState } from "react";
import { Switch, FormControlLabel, Typography, Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";

interface PublishToggleProps {
  courseId: string;
  initialIsPublished: boolean;
}

const PublishToggle = ({
  courseId,
  initialIsPublished,
}: PublishToggleProps) => {
  // General hooks
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const utils = trpc.useUtils();

  // States
  const [isPublished, setIsPublished] = useState(initialIsPublished);

  // Handlers
  const { mutate: togglePublish, isPending: togglePublishPending } =
    trpc.courses.togglePublishStatus.useMutation({
      onSuccess: (data) => {
        setIsPublished(data.isPublished);
        enqueueSnackbar(data.message, {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });

        utils.courses.getCourseDataById.invalidate(courseId);
        utils.courses.getCreatorCourses.invalidate();
      },
      onError: (error) => {
        // Revert the state if the mutation fails
        setIsPublished(!isPublished);
        enqueueSnackbar(`Failed to update course: ${error.message}`, {
          variant: "error",
          autoHideDuration: 4000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      },
    });

  const handleToggle = () => {
    const newStatus = !isPublished;
    // Optimistically update the UI
    setIsPublished(newStatus);

    togglePublish({
      courseId,
      isPublished: newStatus,
    });
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <FormControlLabel
        control={
          <Switch
            checked={isPublished}
            onChange={handleToggle}
            disabled={togglePublishPending}
            color="primary"
            size="medium"
          />
        }
        label={
          <Typography
            variant="body2"
            color={theme.palette.custom.text.white}
            fontWeight={500}
          >
            {isPublished ? "Published" : "Draft"}
          </Typography>
        }
        labelPlacement="start"
      />
      <Chip
        label={isPublished ? "Live" : "Draft"}
        color={isPublished ? "success" : "default"}
        size="small"
        variant={isPublished ? "filled" : "outlined"}
        sx={{
          fontWeight: 600,
          fontSize: "0.75rem",
        }}
      />
    </Box>
  );
};

export default PublishToggle;
