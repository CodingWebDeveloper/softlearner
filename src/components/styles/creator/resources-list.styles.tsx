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

export const ResourceTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
`;

export const ResourceDescription = styled(Typography)`
  white-space: pre-wrap;
  word-break: break-word;
  display: block;
`;

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
