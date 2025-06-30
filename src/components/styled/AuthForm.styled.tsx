import { styled } from "@mui/material/styles";
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  TypographyProps,
} from "@mui/material";

export const AuthFormPaper = styled(Paper)(() => ({
  backgroundColor: "#252730",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "32px",
  maxWidth: 400,
  margin: "0 auto",
  marginTop: "24px",
  color: "#ffffff",
  "& .MuiTextField-root": {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1a1b23",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "8px",
      color: "#ffffff",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "2px solid #4ecdc4",
      },
      "&.Mui-error fieldset": {
        border: "2px solid #ef4444",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#9ca3af",
      "&.Mui-focused": {
        color: "#4ecdc4",
      },
      "&.Mui-error": {
        color: "#ef4444",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "#9ca3af",
      "&.Mui-error": {
        color: "#ef4444",
      },
    },
  },
}));

export const AuthFormTitle = styled(Typography)<TypographyProps>(() => ({
  marginBottom: "16px",
  textAlign: "center",
  color: "#ffffff",
  fontSize: "1.5rem",
  fontWeight: 600,
}));

export const AlertContainer = styled(Alert)(() => ({
  marginBottom: "16px",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  "& .MuiAlert-icon": {
    color: "#4ecdc4",
  },
  "& .MuiAlert-message": {
    color: "#ffffff",
  },
  "&.MuiAlert-standardError": {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    "& .MuiAlert-icon": {
      color: "#ef4444",
    },
  },
  "&.MuiAlert-standardSuccess": {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    "& .MuiAlert-icon": {
      color: "#10b981",
    },
  },
}));

export const FormContainer = styled(Box)(() => ({
  marginTop: "16px",
}));

export const SubmitButton = styled(Button)(() => ({
  marginTop: "24px",
  marginBottom: "16px",
  backgroundColor: "#4ecdc4",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "#45b7af",
  },
  "&:disabled": {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)",
  },
}));
