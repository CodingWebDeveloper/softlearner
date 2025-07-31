import { styled } from "@mui/material/styles";
import { Card, CardContent, Button, Box } from "@mui/material";

export const AdminActionCard = styled(Card)(({ theme }) => ({
  height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

export const AdminActionCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(3),
}));

export const AdminActionIcon = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const AdminActionButton = styled(Button)(({ theme }) => ({
  fontSize: "0.875rem",
}));

export const AdminActionTitle = styled("h6")(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 600,
}));

export const AdminActionDescription = styled("p")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));
