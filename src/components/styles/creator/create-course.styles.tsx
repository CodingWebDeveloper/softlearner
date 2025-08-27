import { styled } from "@mui/material/styles";
import { Box, Paper, Button } from "@mui/material";

export const UploadContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.custom.background.secondary,
  border: `2px dashed ${theme.palette.custom.background.tertiary}`,
  borderRadius: theme.spacing(2),
  minHeight: 200,
  cursor: "pointer",
  marginBottom: theme.spacing(4),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.custom.accent.teal,
    transform: "scale(1.01)",
  },
}));

export const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  padding: theme.spacing(1.5, 4),
  backgroundColor: "transparent",
  border: `2px solid ${theme.palette.custom.accent.teal}`,
  color: theme.palette.custom.accent.teal,
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.teal,
    color: theme.palette.custom.text.white,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 20px ${theme.palette.custom.accent.teal}40`,
  },
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover .MuiSvgIcon-root": {
    transform: "translateY(-2px)",
  },
}));

export const PreviewContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.card,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(4),
}));

export const PurchaseTypeContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

export const PurchaseTypeOption = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.custom.background.card,
  borderRadius: theme.spacing(1),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
  },
  "&.selected": {
    borderColor: theme.palette.custom.accent.teal,
    borderWidth: 2,
    borderStyle: "solid",
  },
}));

export const MainDetailsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  padding: theme.spacing(1.5, 4),
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
}));
