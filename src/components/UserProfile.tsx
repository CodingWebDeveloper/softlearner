"use client";

import { Typography } from "@mui/material";
import { useSupabase } from "@/contexts/SupabaseContext";
import {
  ProfilePaper,
  ProfileHeader,
  ProfileAvatar,
  ProfileInfo,
  ProfileDivider,
  ProfileDetails,
  SignOutButton,
} from "@/components/styled/UserProfile.styled";

const UserProfile = () => {
  const { user, signOut } = useSupabase();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProfilePaper>
      <ProfileHeader>
        <ProfileAvatar>{user.email?.charAt(0).toUpperCase()}</ProfileAvatar>
        <ProfileInfo>
          <Typography variant="h6">
            {user.user_metadata?.full_name || "User"}
          </Typography>
          <Typography variant="body2" color="custom.text.light">
            {user.email}
          </Typography>
        </ProfileInfo>
      </ProfileHeader>

      <ProfileDivider />

      <ProfileDetails>
        <Typography variant="body2" color="custom.text.light" gutterBottom>
          User ID: {user.id}
        </Typography>
        <Typography variant="body2" color="custom.text.light" gutterBottom>
          Last Sign In:{" "}
          {new Date(user.last_sign_in_at || "").toLocaleDateString()}
        </Typography>
      </ProfileDetails>

      <SignOutButton
        variant="outlined"
        color="error"
        fullWidth
        onClick={handleSignOut}
      >
        Sign Out
      </SignOutButton>
    </ProfilePaper>
  );
};

export default UserProfile;
