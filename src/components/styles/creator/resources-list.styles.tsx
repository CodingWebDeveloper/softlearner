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

export const ResourceTitle = styled(Typography)({
  fontWeight: 600,
  marginBottom: 8,
});

export const ResourceDescription = styled(Typography)({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
});

export const ResourceTypeLabel = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(1),
  color: theme.palette.custom.accent.teal,
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(0.5),
  },
}));
