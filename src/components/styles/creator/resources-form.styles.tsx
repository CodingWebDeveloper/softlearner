import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  IconButton,
  ListItem,
  Paper,
  RadioGroup,
  Typography,
} from "@mui/material";

export const FormContainer = styled("div")(({ theme }) => ({
  maxWidth: "800px",
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(3),
  },
}));

export const ResourceList = styled("div")(({ theme }) => ({
  minHeight: 100,
  transition: "background-color 0.2s ease",
  "&[data-rbd-droppable-state='hover']": {
    backgroundColor: theme.palette.action.hover,
  },
  width: "100%",
  marginTop: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const DraggableWrapper = styled("div")<{ isDragging: boolean }>(
  ({ theme, isDragging }) => ({
    width: "100%",
    padding: theme.spacing(1),
    background: isDragging ? theme.palette.background.paper : "transparent",
    borderRadius: theme.shape.borderRadius,
    boxShadow: isDragging ? theme.shadows[3] : "none",
  })
);

export const DragHandleWrapper = styled("div")({
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    opacity: 0.7,
  },
});

export const ResourceWrapper = styled("div")({
  flexGrow: 1,
});

export const ResourceItemContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
});

export const ResourceItem = styled(ListItem)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  backgroundColor: theme.palette.custom.background.card,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[2],
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
  textTransform: "none",
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

export const SaveOrderButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textTransform: "capitalize",
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

export const SectionTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.custom.accent.teal,
}));

export const ResourceDetailsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
}));

export const UploadBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
});

export const SaveOrderBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
}));

export const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

export const EditButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.custom.accent.teal,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: `${theme.palette.custom.accent.teal}20`,
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease-in-out",
}));

export const DownloadButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.custom.accent.blue,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: `${theme.palette.custom.accent.blue}20`,
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease-in-out",
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.custom.accent.red,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease-in-out",
}));
