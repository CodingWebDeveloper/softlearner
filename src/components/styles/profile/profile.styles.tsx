import { styled } from "@mui/material/styles";
import { Card, Box, Button, TextField, Avatar } from "@mui/material";

export const ProfileCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.card,
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
}));

export const ProfileCardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
}));

export const ProfileCardTitle = styled("h3")(({ theme }) => ({
  margin: 0,
  fontSize: "1.125rem",
  fontWeight: 600,
  color: theme.palette.custom.text.white,
}));

export const EditButton = styled(Button)(({ theme }) => ({
  minWidth: "auto",
  padding: theme.spacing(0.75, 1.5),
  fontSize: "0.875rem",
  textTransform: "none",
  color: theme.palette.custom.accent.blue,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.blue + "20",
  },
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.custom?.text.white || "#ffffff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: "3rem",
  backgroundColor: theme.palette.custom.accent.teal,
  border: `4px solid ${theme.palette.custom.background.card}`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
}));

export const ProfileInfoItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

export const ProfileInfoLabel = styled("label")(({ theme }) => ({
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.custom.text.light,
  marginBottom: theme.spacing(0.5),
}));

export const ProfileInfoValue = styled("div")(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.custom.text.light,
  fontWeight: 400,
  padding: theme.spacing(1, 0),
}));

export const ProfileInfoInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const ProfileBioText = styled("div")(({ theme }) => ({
  fontSize: "1rem",
  lineHeight: 1.6,
  color: theme.palette.custom.text.light,
  whiteSpace: "pre-wrap",
  padding: theme.spacing(1, 0),
}));

export const ProfileBioTextarea = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
  },
  "& .MuiInputBase-input": {
    lineHeight: 1.6,
  },
}));

export const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.text.white,
  color: theme.palette.custom.background.card,
  border: `1px solid ${theme.palette.custom.background.tertiary}`,
  "&:hover": {
    backgroundColor: theme.palette.custom.text.light,
  },
}));

export const UploadRequirements = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.custom.text.light,
  marginTop: theme.spacing(1),
  lineHeight: 1.4,
}));
