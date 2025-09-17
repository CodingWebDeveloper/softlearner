import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const ResourcesContainer = styled(Box)({
  width: "100%",
});

export const ResourcesHeader = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.custom.accent.teal,
}));

export const ResourceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  display: "block",
  color: theme.palette.custom.text.white,
}));

export const ResourceDescription = styled(Typography)(({ theme }) => ({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  display: "block",
  color: theme.palette.custom.text.light,
}));

export const ResourceTypeLabel = styled(Typography)(({ theme }) => ({
  display: "block",
  alignItems: "center",
  marginTop: theme.spacing(1),
  color: theme.palette.custom.accent.teal,
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(0.5),
    verticalAlign: "middle",
  },
}));
