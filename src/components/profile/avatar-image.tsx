"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import { ProfileAvatar } from "@/components/styles/profile/profile.styles";
import { trpc } from "@/lib/trpc/client";

interface AvatarImageProps {
  avatarUrl?: string;
  alt: string;
  children?: React.ReactNode;
}

export const AvatarImage = ({ avatarUrl, alt, children }: AvatarImageProps) => {
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

  if (isLoading) {
    return <Skeleton variant="circular" width={120} height={120} />;
  }

  return (
    <ProfileAvatar src={imageSrc} alt={alt}>
      {children}
    </ProfileAvatar>
  );
};
