import { styled } from "@mui/material/styles";
import { Box, Chip } from "@mui/material";

export const TagsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

export const CourseTagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.card,
  color: theme.palette.custom.text.light,
  "& .MuiSvgIcon-root": {
    color: theme.palette.custom.accent.teal,
  },
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.white,
    "& .MuiSvgIcon-root": {
      color: theme.palette.custom.accent.tealDark,
    },
  },
}));
