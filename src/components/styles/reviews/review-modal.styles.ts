import { styled } from "@mui/material/styles";
import { Dialog, Box, Typography } from "@mui/material";

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.custom.background.card,
    borderRadius: 12,
    border: `1px solid ${theme.palette.custom.background.tertiary}`,
  },
}));

export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  borderBottom: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontWeight: 600,
  fontSize: 18,
}));

export const Content = styled(Box)(() => ({
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const Actions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: 20,
  borderTop: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const HelperText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  fontSize: 12,
}));
