import { styled } from "@mui/material/styles";
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  TypographyProps,
} from "@mui/material";

export const AuthFormPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.secondary,
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "32px",
  maxWidth: 400,
  margin: "0 auto",
  marginTop: "24px",
  color: theme.palette.custom.text.white,
  "& .MuiTextField-root": {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.custom.background.dark,
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "8px",
      color: theme.palette.custom.text.white,
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: `2px solid ${theme.palette.custom.accent.teal}`,
      },
      "&.Mui-error fieldset": {
        border: `2px solid ${theme.palette.custom.status.error}`,
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.custom.text.light,
      "&.Mui-focused": {
        color: theme.palette.custom.accent.teal,
      },
      "&.Mui-error": {
        color: theme.palette.custom.status.error,
      },
    },
    "& .MuiFormHelperText-root": {
      color: theme.palette.custom.text.light,
      "&.Mui-error": {
        color: theme.palette.custom.status.error,
      },
    },
  },
}));

export const AuthFormTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: "16px",
  textAlign: "center",
  color: theme.palette.custom.text.white,
  fontSize: "1.5rem",
  fontWeight: 600,
}));

export const AlertContainer = styled(Alert)(({ theme }) => ({
  marginBottom: "16px",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  "& .MuiAlert-icon": {
    color: theme.palette.custom.accent.teal,
  },
  "& .MuiAlert-message": {
    color: theme.palette.custom.text.white,
  },
  "&.MuiAlert-standardError": {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    "& .MuiAlert-icon": {
      color: theme.palette.custom.status.error,
    },
  },
  "&.MuiAlert-standardSuccess": {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    "& .MuiAlert-icon": {
      color: theme.palette.custom.status.success,
    },
  },
}));

export const FormContainer = styled(Box)(() => ({
  marginTop: "16px",
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: "24px",
  marginBottom: "16px",
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
  "&:disabled": {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)",
  },
}));
