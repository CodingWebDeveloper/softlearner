import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogContentText,
  Divider,
  DialogContent,
  DialogTitle,
  
} from "@mui/material";

export const ConfirmDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    alignItems: "flex-end",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    background: theme.palette.custom.background.card,
    boxShadow: "unset",
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.custom.background.tertiary}`,
    color: theme.palette.custom.text.light,
  },
  color: theme.palette.custom.text.light,
}));

export const StyledDialogText = styled(DialogContentText)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.custom.text.light,
  padding: theme.spacing(2),
  wordBreak: "break-word",
}));

export const ConfirmDialogButton = styled(Button)(({ theme }) => ({
  width: "100%",
  margin: "auto",
  background: theme.palette.error.main,
  color: theme.palette.custom.text.white,
  "&:hover": {
    background: theme.palette.error.dark,
  },
  textTransform: "none",
}));

export const CloseDialogButton = styled(Button)(({ theme }) => ({
  width: "100%",
  margin: "auto",
  background: theme.palette.custom.accent.gray,
  color: theme.palette.custom.text.white,
  "&:hover": {
    background: theme.palette.custom.accent.gray,
    opacity: 0.85,
  },
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  height: "5px",
  background: theme.palette.custom.background.secondary,
}));

export const StyledDividerWithSpace = styled(Divider)(({ theme }) => ({
  height: "5px",
  background: theme.palette.custom.background.secondary,
  margin: theme.spacing(2, 0),
}));

export const TopLevelDialog = styled(Dialog)(({ theme }) => ({
  zIndex: 1301,
  "& .MuiDialog-paper": {
    background: theme.palette.custom.background.card,
    color: theme.palette.custom.text.light,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    border: `1px solid ${theme.palette.custom.background.tertiary}`,
  },
}));

export const MaxContentButton = styled(Button)(({ theme }) => ({
  width: "max-content",
  background: theme.palette.error.main,
  color: theme.palette.custom.text.white,
  "&:hover": {
    background: theme.palette.error.dark,
  },
  textTransform: "none",
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: theme.palette.custom.background.card,
    color: theme.palette.custom.text.light,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    border: `1px solid ${theme.palette.custom.background.tertiary}`,
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.custom.background.card,
  color: theme.palette.custom.text.light,
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 700,
  textAlign: "center",
  color: theme.palette.custom.text.light,
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  margin: "auto",
  height: "50px",
  marginTop: "7px",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  borderRadius: "10px",
  color: theme.palette.custom.text.white,
  backgroundColor: theme.palette.custom.background.tertiary,
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
  },
  textTransform: "none",
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const CancelConfirmAlertButton = styled(Button)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  color: theme.palette.custom.text.white,
  backgroundColor: theme.palette.custom.background.tertiary,
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
  },
  textTransform: "none",
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
}));
