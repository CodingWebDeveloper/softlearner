import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const MorePageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: theme.palette.custom.background.dark,
  minHeight: "100vh",
  "& .MuiListItemButton-root": {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    color: theme.palette.custom.text.light,
    "&:hover": {
      backgroundColor: theme.palette.custom.background.tertiary,
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.custom.text.light,
  },
  "& .MuiDivider-root": {
    borderColor: theme.palette.custom.background.tertiary,
  },
}));
