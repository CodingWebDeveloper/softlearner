import { styled } from "@mui/material/styles";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.custom.background.dark,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.custom.background.tertiary}`,
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.custom.background.dark,
  "& .MuiTextField-root": {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.custom.background.secondary,
      "&:hover fieldset": {
        borderColor: theme.palette.custom.accent.teal,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.custom.accent.teal,
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.custom.text.light,
      "&.Mui-focused": {
        color: theme.palette.custom.accent.teal,
      },
    },
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.dark,
  color: theme.palette.custom.text.light,
  padding: theme.spacing(3),
  fontSize: "1.5rem",
  fontWeight: 600,
  borderBottom: `1px solid ${theme.palette.custom.background.tertiary}`,
}));
