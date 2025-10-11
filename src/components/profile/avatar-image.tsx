"use client";

/**
 * AvatarImage Component
 *
 * A customizable avatar component that supports different sizes.
 *
 * Usage examples:
 *
 * // Small avatar (40x40px) - good for lists, comments, etc.
 * <AvatarImage avatarUrl={user.avatar} alt="User" size="small" />
 *
 * // Medium avatar (80x80px) - default size, good for course headers, etc.
 * <AvatarImage avatarUrl={user.avatar} alt="User" size="medium" />
 *
 * // Large avatar (120x120px) - good for profile pages, detailed views
 * <AvatarImage avatarUrl={user.avatar} alt="User" size="large" />
 *
 * // Default (medium size)
 * <AvatarImage avatarUrl={user.avatar} alt="User" />
 */

import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import {
  ProfileAvatarSmall,
  ProfileAvatarMedium,
  ProfileAvatarLarge,
} from "@/components/styles/profile/profile.styles";
import { trpc } from "@/lib/trpc/client";

type AvatarSize = "small" | "medium" | "large";

interface AvatarImageProps {
  avatarUrl?: string | null;
  alt: string;
  children?: React.ReactNode;
  size?: AvatarSize;
}

export const AvatarImage = ({
  avatarUrl,
  alt,
  children,
  size = "medium",
}: AvatarImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  const { data: profileImageData, isLoading } =
    trpc.users.getProfileImage.useQuery(
      { avatarPath: avatarUrl || "" },
      {
        enabled: !!avatarUrl,
        retry: false,
        refetchOnWindowFocus: false,
      }
    );

  useEffect(() => {
    if (profileImageData?.blob) {
      // Convert base64 to blob
      const binaryString = atob(profileImageData.blob);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: profileImageData.type });
      const objectURL = URL.createObjectURL(blob);
      setImageSrc(objectURL);

      // Cleanup function
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    } else {
      setImageSrc(undefined);
    }
  }, [profileImageData]);

  const getAvatarComponent = () => {
    switch (size) {
      case "small":
        return ProfileAvatarSmall;
      case "large":
        return ProfileAvatarLarge;
      case "medium":
      default:
        return ProfileAvatarMedium;
    }
  };

  const getSkeletonSize = () => {
    switch (size) {
      case "small":
        return 40;
      case "large":
        return 120;
      case "medium":
      default:
        return 80;
    }
  };

  const AvatarComponent = getAvatarComponent();
  const skeletonSize = getSkeletonSize();

  if (isLoading) {
    return (
      <Skeleton variant="circular" width={skeletonSize} height={skeletonSize} />
    );
  }

  return (
    <AvatarComponent src={imageSrc} alt={alt}>
      {children}
    </AvatarComponent>
  );
};
