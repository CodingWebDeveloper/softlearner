import {
  Alert,
  alpha,
  Card,
  IconButton,
  styled,
  TextField,
  Select,
  Chip,
} from "@mui/material";
import { DragIndicator } from "@mui/icons-material";

interface OptionInputCardProps {
  iscorrect?: boolean;
}

interface DeleteIconButtonProps {
  hasQuestions?: boolean;
}

export const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.dark,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.custom.background.tertiary,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.custom.accent.teal,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.custom.accent.teal,
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.custom.background.dark,
    "& fieldset": {
      borderColor: theme.palette.custom.background.tertiary,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.custom.accent.teal,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.custom.accent.teal,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.custom.text.light,
  },
}));

export const StyledQuestionInputCard = styled(Card)(({ theme }) => ({
  mb: 3,
  backgroundColor: theme.palette.custom.background.card,
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
  borderRadius: 2,
  "&:hover": {
    borderColor: theme.palette.custom.accent.teal,
    boxShadow: `0 4px 12px ${alpha(theme.palette.custom.accent.teal, 0.2)}`,
  },
  transition: "all 0.2s ease-in-out",
}));

export const OptionInputCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "iscorrect", // prevent it from reaching the DOM
})<OptionInputCardProps>(({ theme, iscorrect }) => ({
  padding: theme.spacing(2),
  backgroundColor: iscorrect
    ? theme.palette.custom.accent.green + "15"
    : theme.palette.custom.background.secondary,
  borderColor: iscorrect
    ? theme.palette.custom.accent.green
    : theme.palette.custom.background.tertiary,
  borderRadius: 1,
}));

export const AlertWarning = styled(Alert)(({ theme }) => ({
  mt: 2,
  backgroundColor: theme.palette.custom.accent.orange + "20",
  borderColor: theme.palette.custom.accent.orange,
  color: theme.palette.custom.text.white,
  "& .MuiAlert-icon": {
    color: theme.palette.custom.accent.orange,
  },
}));

export const AlertInfo = styled(Alert)(({ theme }) => ({
  mb: 2,
  backgroundColor: theme.palette.custom.accent.blue + "20",
  borderColor: theme.palette.custom.accent.blue,
  color: theme.palette.custom.text.white,
  "& .MuiAlert-icon": {
    color: theme.palette.custom.accent.blue,
  },
}));

export const DeleteIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "hasQuestions",
})<DeleteIconButtonProps>(({ theme, hasQuestions }) => ({
  color: hasQuestions
    ? theme.palette.custom.accent.red
    : theme.palette.custom.text.light,
  "&:hover": {
    backgroundColor: hasQuestions
      ? `${theme.palette.custom.accent.red}20`
      : "transparent",
  },
}));

export const StyledDragIcon = styled(DragIndicator)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  cursor: "grab",
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.green,
  color: theme.palette.custom.text.white,
  fontSize: "0.75rem",
}));
