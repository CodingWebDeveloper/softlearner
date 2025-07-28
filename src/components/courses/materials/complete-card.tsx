"use client";

import { FC } from "react";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { trpc } from "@/lib/trpc/client";
import { styled } from "@mui/material/styles";

interface CompleteCardProps {
  resourceId: string;
}

const CompleteButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  padding: theme.spacing(1, 2),
  gap: theme.spacing(1),
  backgroundColor: theme.palette.custom.background.secondary,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.background.secondary,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.success.main,
  },
}));

const CompleteCard: FC<CompleteCardProps> = ({ resourceId }) => {
  const utils = trpc.useUtils();

  const { data: isCompleted, isPending: isPendingCompletion } =
    trpc.resources.getResourceCompletionStatus.useQuery({ resourceId });

  const { mutate: toggleCompletion, isPending: isPendingToggle } =
    trpc.resources.toggleResourceCompletion.useMutation({
      onSuccess: () => {
        utils.resources.getResourceMaterialsByCourseId.invalidate();
        utils.resources.getResourceCompletionStatus.invalidate({ resourceId });
      },
    });

  const handleToggleCompletion = () => {
    if (!isPendingToggle) {
      toggleCompletion({ resourceId });
    }
  };

  if (isPendingCompletion) {
    return <></>;
  }

  return (
    <CompleteButton
      onClick={handleToggleCompletion}
      disabled={isPendingToggle}
      startIcon={
        isCompleted ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />
      }
    >
      {isCompleted ? "Completed" : "Mark as Complete"}
    </CompleteButton>
  );
};

export default CompleteCard;
