"use client";

import { useState } from "react";
import { Box, Button, Typography, IconButton, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PreviewContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 200,
  border: `1px dashed ${theme.palette.custom.accent.gray}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  backgroundColor: theme.palette.custom.background.secondary,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
    borderColor: theme.palette.custom.accent.teal,
  },
}));

const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
});

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
    <Stack spacing={2}>
      <Typography variant="subtitle1" gutterBottom>
        Course Thumbnail
      </Typography>
      <PreviewContainer>
        {preview ? (
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <ImagePreview src={preview} alt="Thumbnail preview" />
            <IconButton
              onClick={handleRemove}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: (theme) =>
                  theme.palette.custom.background.card,
                color: (theme) => theme.palette.custom.accent.teal,
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.custom.background.tertiary,
                  color: (theme) => theme.palette.custom.accent.tealDark,
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{
              p: 2,
              color: (theme) => theme.palette.custom.accent.teal,
              borderColor: (theme) => theme.palette.custom.accent.teal,
              "&:hover": {
                borderColor: (theme) => theme.palette.custom.accent.tealDark,
                backgroundColor: "transparent",
              },
            }}
          >
            Upload Thumbnail
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>
        )}
      </PreviewContainer>
      <Typography variant="caption" color="text.secondary">
        Recommended size: 1280x720px. Max file size: 5MB
      </Typography>
    </Stack>
  );
};

export default UploadThumbnail;
