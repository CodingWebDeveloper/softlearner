import { styled } from "@mui/material/styles";
import { Paper, Box, Button, Avatar, Divider } from "@mui/material";

export const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400,
  margin: "0 auto",
  marginTop: theme.spacing(4),
}));

export const ProfileHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export const ProfileInfo = styled(Box)({
  // No additional styles needed
});

export const ProfileDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
}));

export const ProfileDetails = styled(Box)({
  // No additional styles needed
});

export const SignOutButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
