import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";

export const ReviewDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.custom.background.card,
    color: theme.palette.custom.text.white,
    borderRadius: theme.spacing(2),
  },
}));

export const ReviewDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.secondary,
  borderBottom: `1px solid ${theme.palette.custom.background.tertiary}`,
  "& .MuiTypography-root": {
    color: theme.palette.custom.text.white,
    fontWeight: 600,
  },
}));

export const ReviewDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.card,
  color: theme.palette.custom.text.white,
  padding: theme.spacing(3),
}));

export const ReviewDialogActions = styled(DialogActions)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.secondary,
  borderTop: `1px solid ${theme.palette.custom.background.tertiary}`,
  padding: theme.spacing(2, 3),
}));

export const InfoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.custom.background.secondary,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  fontSize: "0.875rem",
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontSize: "0.875rem",
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

export const AdminNotesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.custom.accent.orange,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.custom.accent.orange}`,
  opacity: 0.9,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
}));

export const ApproveButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.custom.status.success,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.status.success,
    opacity: 0.9,
  },
  "&:disabled": {
    backgroundColor: theme.palette.custom.accent.gray,
    color: theme.palette.custom.text.light,
  },
}));

export const RejectButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.custom.status.error,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.status.error,
    opacity: 0.9,
  },
  "&:disabled": {
    backgroundColor: theme.palette.custom.accent.gray,
    color: theme.palette.custom.text.light,
  },
}));

export const CancelButton = styled(ActionButton)(({ theme }) => ({
  borderColor: theme.palette.custom.text.light,
  color: theme.palette.custom.text.light,
  "&:hover": {
    borderColor: theme.palette.custom.text.white,
    color: theme.palette.custom.text.white,
  },
}));

export const CloseButton = styled(Button)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  "&:hover": {
    color: theme.palette.custom.text.white,
  },
}));

export const PortfolioChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.tertiary,
  color: theme.palette.custom.text.white,
  borderColor: theme.palette.custom.background.tertiary,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.blue,
    color: theme.palette.custom.text.white,
  },
}));

export const ExperienceChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  borderColor: theme.palette.custom.accent.teal,
}));

export const StatusChip = styled(Chip)(() => ({
  fontWeight: 600,
}));

export const LogEntry = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.custom.background.secondary,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const LogAction = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontWeight: 600,
  fontSize: "0.875rem",
}));

export const LogMeta = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  fontSize: "0.75rem",
}));

export const LogNotes = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontSize: "0.875rem",
  marginTop: theme.spacing(1),
}));

export const NotesTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.custom.background.secondary,
    color: theme.palette.custom.text.white,
    "& fieldset": {
      borderColor: theme.palette.custom.background.tertiary,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.custom.accent.blue,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.custom.accent.blue,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.custom.text.light,
    "&.Mui-focused": {
      color: theme.palette.custom.accent.blue,
    },
  },
  "& .MuiInputBase-input": {
    color: theme.palette.custom.text.white,
  },
}));

export const SectionDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.tertiary,
  margin: theme.spacing(2, 0),
}));
