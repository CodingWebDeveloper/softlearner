"use client";

import { useState, useRef } from "react";
import { Box, CardContent, Skeleton } from "@mui/material";
import {
  ProfileCard,
  ProfileAvatar,
  UploadButton,
  UploadRequirements,
} from "@/components/styles/profile/profile.styles";
import { useSupabase } from "@/contexts/supabase-context";

export const ProfilePictureSection = () => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userProfile, loading: isLoading } = useSupabase();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement file upload logic
      console.log("Uploading file:", file);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading || !userProfile) {
    return (
      <ProfileCard>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Skeleton variant="circular" width={120} height={120} />
            <Box>
              <Skeleton
                variant="rectangular"
                width={150}
                height={40}
                sx={{ borderRadius: 1 }}
              />
              <Box sx={{ mt: 1 }}>
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width={150} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <ProfileAvatar
            src={userProfile?.avatar_url || undefined}
            alt={userProfile?.full_name || "Profile"}
          >
            {userProfile?.full_name ? getInitials(userProfile.full_name) : "U"}
          </ProfileAvatar>

          <Box>
            <UploadButton
              onClick={handleUploadClick}
              disabled={isUploading}
              variant="outlined"
            >
              {isUploading ? "Uploading..." : "Upload new photo"}
            </UploadButton>

            <UploadRequirements>
              At least 800x800 px recommended.
              <br />
              JPG or PNG is allowed.
            </UploadRequirements>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      </CardContent>
    </ProfileCard>
  );
};
