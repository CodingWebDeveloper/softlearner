"use client";

import { useState } from "react";
import { CardContent, Box, Skeleton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardTitle,
  EditButton,
  ProfileBioText,
  ProfileBioTextarea,
  SaveButton,
  CancelButton,
} from "@/components/styles/profile/profile.styles";
import { useSupabase } from "@/contexts/supabase-context";

export const BioSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState("");

  const { userProfile, loading: isLoading } = useSupabase();

  const handleEditClick = () => {
    setBioText(userProfile?.bio || "");
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      // TODO: Implement update logic
      console.log("Saving bio:", bioText);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving bio:", error);
    }
  };

  if (isLoading || !userProfile) {
    return (
      <ProfileCard>
        <CardContent>
          <ProfileCardHeader>
            <ProfileCardTitle>Bio</ProfileCardTitle>
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              sx={{ borderRadius: 1 }}
            />
          </ProfileCardHeader>
          <Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        </CardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <CardContent>
        <ProfileCardHeader>
          <ProfileCardTitle>Bio</ProfileCardTitle>
          {!isEditing && (
            <EditButton onClick={handleEditClick} startIcon={<EditIcon />}>
              Edit
            </EditButton>
          )}
          {isEditing && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
              <SaveButton onClick={handleSaveClick}>Save changes</SaveButton>
            </Box>
          )}
        </ProfileCardHeader>

        {isEditing ? (
          <ProfileBioTextarea
            fullWidth
            multiline
            rows={6}
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Tell us about yourself..."
            variant="outlined"
          />
        ) : (
          <ProfileBioText>
            {userProfile?.bio ||
              "No bio added yet. Click edit to add your bio."}
          </ProfileBioText>
        )}
      </CardContent>
    </ProfileCard>
  );
};
