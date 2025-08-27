import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Paper,
  RadioGroup,
} from "@mui/material";

export const FormContainer = styled("div")(({ theme }) => ({
  maxWidth: "800px",
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(3),
  },
}));

export const ResourceList = styled(List)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: theme.spacing(2),
}));

export const ResourceItem = styled(ListItem)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.custom.background.card,
  borderRadius: theme.spacing(1),
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

export const TypeContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

export const TypeOption = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.custom.background.card,
  borderRadius: theme.spacing(1),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  border: `2px solid transparent`,
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
  },
  "&.selected": {
    borderColor: theme.palette.custom.accent.teal,
    backgroundColor: `${theme.palette.custom.accent.teal}10`,
  },
}));

export const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const AddResourceButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.custom.accent.teal,
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },
  transition: "all 0.2s ease-in-out",
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.custom.accent.red,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease-in-out",
}));
