import { styled } from "@mui/material/styles";
import { ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";

export const AdminActionButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const AdminActionIcon = styled(ListItemIcon)(() => ({
  color: "inherit",
}));

export const AdminActionText = styled(ListItemText)(() => ({
  "& .MuiListItemText-primary": {
    fontWeight: "bold",
  },
}));

export const AdminSubItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

export const AdminSubItemText = styled(ListItemText)(() => ({
  "& .MuiListItemText-secondary": {
    fontSize: "0.75rem",
    lineHeight: 1.2,
  },
}));

export const AdminMenuContainer = styled(Box)(() => ({
  // Container for admin menu items
}));
