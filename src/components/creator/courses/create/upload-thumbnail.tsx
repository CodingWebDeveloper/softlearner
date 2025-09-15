"use client";

import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from "@mui/material/Skeleton";
import {
  VisuallyHiddenInput,
  PreviewContainer,
  ImagePreview,
  PreviewWrapper,
  DeleteIconButton,
  UploadButton,
  ThumbnailStack,
} from "@/components/styles/creator/upload-thumbnail.styles";
import { LightText } from "@/components/styles/infrastructure/layout.styles";

interface UploadThumbnailProps {
  previewSrc?: string | null;
  onFileSelect: (file: File | null) => void;
  isLoading?: boolean;
}

const UploadThumbnail = ({
  previewSrc = null,
  onFileSelect,
  isLoading = false,
}: UploadThumbnailProps) => {
  const [preview, setPreview] = useState<string | null>(previewSrc);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
  };

  useEffect(() => {
    if (previewSrc) {
      setPreview(previewSrc);
    }
  }, [previewSrc]);

  return (
    <ThumbnailStack spacing={2}>
      <PreviewContainer>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ borderRadius: 2 }}
          />
        ) : preview ? (
          <PreviewWrapper>
            <ImagePreview src={preview} alt="Thumbnail preview" />
            <DeleteIconButton
              onClick={handleRemove}
              aria-label="Remove thumbnail"
            >
              <DeleteIcon />
            </DeleteIconButton>
          </PreviewWrapper>
        ) : (
          <UploadButton
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload Thumbnail
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </UploadButton>
        )}
      </PreviewContainer>
      <LightText variant="caption">
        Recommended size: 1280x720px. Max file size: 5MB
      </LightText>
    </ThumbnailStack>
  );
};

export default UploadThumbnail;
