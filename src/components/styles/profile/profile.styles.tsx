import { styled } from "@mui/material/styles";
import {
  Card,
  Box,
  Button,
  TextField,
  Avatar,
  IconButton,
  MenuItem,
  Divider,
  Typography,
  Alert,
  Skeleton,
  CircularProgress,
} from "@mui/material";

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
  color: theme.palette.custom?.text.white,
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

export const ProfileAvatarSmall = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: "1rem",
  backgroundColor: theme.palette.custom.accent.teal,
  border: `2px solid ${theme.palette.custom.background.card}`,
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
}));

export const ProfileAvatarMedium = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: "2rem",
  backgroundColor: theme.palette.custom.accent.teal,
  border: `3px solid ${theme.palette.custom.background.card}`,
  boxShadow: "0 3px 9px rgba(0, 0, 0, 0.3)",
}));

export const ProfileAvatarLarge = styled(Avatar)(({ theme }) => ({
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
  textTransform: "none",
}));

export const UploadRequirements = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.custom.text.light,
  marginTop: theme.spacing(1),
  lineHeight: 1.4,
}));

export const AvatarContainer = styled(Box)(() => ({
  position: "relative",
}));

export const AvatarMenuButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: -8,
  right: -8,
  backgroundColor: theme.palette.background.paper,
  border: "1px solid",
  borderColor: theme.palette.divider,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const AvatarMenuItem = styled(MenuItem)(() => ({
  minWidth: 120,
}));

export const ChangePasswordButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.tertiary,
  color: theme.palette.custom.text.white,
  borderColor: theme.palette.custom.background.tertiary,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.custom.background.secondary,
    borderColor: theme.palette.custom.background.secondary,
  },
}));

export const PasswordFormContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const PasswordButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

export const UpdatePasswordButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.blue,
  color: theme.palette.custom.text.white,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.blue + "dd",
  },
  "&:disabled": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.light,
  },
}));

export const CancelPasswordButton = styled(Button)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  borderColor: theme.palette.custom.background.tertiary,
  textTransform: "none",
  "&:hover": {
    borderColor: theme.palette.custom.text.white,
    backgroundColor: theme.palette.custom.background.tertiary,
  },
  "&:disabled": {
    borderColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.light,
  },
}));

export const ProfileDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.custom.background.tertiary,
  marginBottom: theme.spacing(2),
}));

export const PasswordHeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing(2),
}));

export const PasswordDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.custom.text.light,
}));

export const SuccessAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ProfilePictureContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
}));

export const ProfilePictureInfoContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export const ProfilePictureUploadContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const HiddenFileInput = styled("input")(() => ({
  display: "none",
}));

export const SkeletonButton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

export const SkeletonTextContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

export const CircularProgressWithMargin = styled(CircularProgress)(
  ({ theme }) => ({
    marginRight: theme.spacing(1),
  })
);

export const ProfilePageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const ProfilePageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
}));

export const ProfilePageDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
}));
