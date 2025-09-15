import { styled, alpha } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.custom.background.card,
    borderRadius: theme.spacing(1),
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.custom.background.card,
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.tertiary,
  color: theme.palette.custom.text.white,
  fontSize: "1.2rem",
  fontWeight: 500,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),

  "& .MuiFormControl-root": {
    marginBottom: theme.spacing(2),
  },
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.light,
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
    "&.Mui-focused": {
      color: theme.palette.custom.accent.teal,
    },
  },
  "& .MuiFormHelperText-root": {
    color: theme.palette.custom.accent.red,
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(0.5),
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
  "&.MuiButton-disabled": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: alpha(theme.palette.custom.background.tertiary, 0.3),
  },
}));

export const ButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));
