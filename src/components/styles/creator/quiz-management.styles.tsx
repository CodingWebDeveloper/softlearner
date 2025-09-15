import { styled } from "@mui/material/styles";
import { Button, Box } from "@mui/material";

export const AddButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textTransform: "none",
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

export const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "200px",
});
