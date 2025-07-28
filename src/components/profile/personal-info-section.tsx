"use client";

import { useState } from "react";
import { CardContent, Box, Skeleton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardTitle,
  EditButton,
  ProfileInfoItem,
  ProfileInfoLabel,
  ProfileInfoValue,
  ProfileInfoInput,
  SaveButton,
  CancelButton,
} from "@/components/styles/profile/profile.styles";
import { useSupabase } from "@/contexts/supabase-context";

export const PersonalInfoSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
  });

  const { userProfile, user, loading: isLoading } = useSupabase();

  const handleEditClick = () => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name,
        username: userProfile.username,
      });
    }
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      // TODO: Implement update logic
      console.log("Saving profile data:", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading || !userProfile) {
    return (
      <ProfileCard>
        <CardContent>
          <ProfileCardHeader>
            <ProfileCardTitle>Personal Info</ProfileCardTitle>
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              sx={{ borderRadius: 1 }}
            />
          </ProfileCardHeader>
          <Box>
            <ProfileInfoItem>
              <ProfileInfoLabel>Full Name</ProfileInfoLabel>
              <Skeleton variant="text" width="60%" height={24} />
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoLabel>Email</ProfileInfoLabel>
              <Skeleton variant="text" width="70%" height={24} />
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoLabel>Username</ProfileInfoLabel>
              <Skeleton variant="text" width="50%" height={24} />
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoLabel>Email</ProfileInfoLabel>
              <Skeleton variant="text" width="70%" height={24} />
            </ProfileInfoItem>
          </Box>
        </CardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <CardContent>
        <ProfileCardHeader>
          <ProfileCardTitle>Personal Info</ProfileCardTitle>
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

        <Box>
          <ProfileInfoItem>
            <ProfileInfoLabel>Full Name</ProfileInfoLabel>
            {isEditing ? (
              <ProfileInfoInput
                fullWidth
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Enter your full name"
              />
            ) : (
              <ProfileInfoValue>
                {userProfile?.full_name || "Not set"}
              </ProfileInfoValue>
            )}
          </ProfileInfoItem>

          <ProfileInfoItem>
            <ProfileInfoLabel>Username</ProfileInfoLabel>
            {isEditing ? (
              <ProfileInfoInput
                fullWidth
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Enter your username"
              />
            ) : (
              <ProfileInfoValue>
                {userProfile?.username || "Not set"}
              </ProfileInfoValue>
            )}
          </ProfileInfoItem>

          <ProfileInfoItem>
            <ProfileInfoLabel>Email</ProfileInfoLabel>
            <ProfileInfoValue>{user?.email || "Not set"}</ProfileInfoValue>
          </ProfileInfoItem>
        </Box>
      </CardContent>
    </ProfileCard>
  );
};
