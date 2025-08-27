"use client";

import { useState } from "react";
import { Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  VisuallyHiddenInput,
  PreviewContainer,
  ImagePreview,
  PreviewWrapper,
  DeleteIconButton,
  UploadButton,
  ThumbnailStack,
} from "@/components/styles/creator/upload-thumbnail.styles";

interface UploadThumbnailProps {
  onFileSelect: (file: File | null) => void;
}

const UploadThumbnail = ({ onFileSelect }: UploadThumbnailProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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

  return (
    <ThumbnailStack spacing={2}>
      <PreviewContainer>
        {preview ? (
          <PreviewWrapper>
            <ImagePreview src={preview} alt="Thumbnail preview" />
            <DeleteIconButton onClick={handleRemove}>
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
      <Typography variant="caption" color="text.secondary">
        Recommended size: 1280x720px. Max file size: 5MB
      </Typography>
    </ThumbnailStack>
  );
};

export default UploadThumbnail;
