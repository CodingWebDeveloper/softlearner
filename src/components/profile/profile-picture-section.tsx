"use client";

import { useState, useRef, ChangeEvent, MouseEvent } from "react";
import { CardContent, Skeleton, Menu } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import {
  ProfileCard,
  UploadButton,
  UploadRequirements,
  AvatarContainer,
  AvatarMenuButton,
  AvatarMenuItem,
  ProfilePictureContainer,
  ProfilePictureInfoContainer,
  HiddenFileInput,
  SkeletonButton,
  SkeletonTextContainer,
  CircularProgressWithMargin,
} from "@/components/styles/profile/profile.styles";
import { useSupabase } from "@/contexts/supabase-context";
import { trpc } from "@/lib/trpc/client";
import { AvatarImage } from "./avatar-image";

export const ProfilePictureSection = () => {
  // States
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supabase
  const { userProfile, loading: isLoading } = useSupabase();
  const utils = trpc.useUtils();

  // TRPC
  const { mutateAsync: uploadProfileImage, isPending: isUploading } =
    trpc.users.uploadProfileImage.useMutation();
  const { mutateAsync: removeProfileImage, isPending: isRemoving } =
    trpc.users.removeProfileImage.useMutation();

  // Handlers
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadProfileImage(formData);

      // Invalidate user profile to refresh data
      utils.users.getUserProfile.invalidate();

      handleMenuClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!userProfile?.avatar_url) return;

    try {
      await removeProfileImage();

      // Invalidate user profile to refresh data
      utils.users.getUserProfile.invalidate();
      handleMenuClose();
    } catch (error) {
      console.error("Error removing avatar:", error);
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

  const isProcessing = isUploading || isRemoving;

  if (isLoading || !userProfile) {
    return (
      <ProfileCard>
        <CardContent>
          <ProfilePictureContainer>
            <Skeleton variant="circular" width={120} height={120} />
            <ProfilePictureInfoContainer>
              <SkeletonButton variant="rectangular" width={150} height={40} />
              <SkeletonTextContainer>
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width={150} />
              </SkeletonTextContainer>
            </ProfilePictureInfoContainer>
          </ProfilePictureContainer>
        </CardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <CardContent>
        <ProfilePictureContainer>
          <AvatarContainer>
            <AvatarImage
              avatarUrl={userProfile?.avatar_url}
              alt={userProfile?.full_name || "Profile"}
            >
              {userProfile?.full_name
                ? getInitials(userProfile.full_name)
                : "U"}
            </AvatarImage>

            {userProfile?.avatar_url && (
              <AvatarMenuButton
                size="small"
                onClick={handleMenuOpen}
                disabled={isProcessing}
              >
                <MoreVertIcon fontSize="small" />
              </AvatarMenuButton>
            )}
          </AvatarContainer>

          <ProfilePictureInfoContainer>
            <UploadButton
              onClick={handleUploadClick}
              disabled={isProcessing}
              variant="outlined"
            >
              {isProcessing ? (
                <CircularProgressWithMargin size={16} color="inherit" />
              ) : (
                "Upload new photo"
              )}
            </UploadButton>

            <UploadRequirements>
              At least 800x800 px recommended.
              <br />
              JPG or PNG is allowed.
            </UploadRequirements>

            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </ProfilePictureInfoContainer>
        </ProfilePictureContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <AvatarMenuItem onClick={handleRemoveAvatar} disabled={isRemoving}>
            {isRemoving ? (
              <CircularProgressWithMargin size={16} />
            ) : (
              "Remove photo"
            )}
          </AvatarMenuItem>
        </Menu>
      </CardContent>
    </ProfileCard>
  );
};
