import { styled } from "@mui/material/styles";
import { Box, Button, IconButton, Stack } from "@mui/material";

export const VisuallyHiddenInput = styled("input")({
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

export const PreviewContainer = styled(Box)(({ theme }) => ({
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

export const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
});

export const PreviewWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
});

export const DeleteIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: theme.palette.custom.background.card,
  color: theme.palette.custom.accent.teal,
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.accent.tealDark,
  },
}));

export const UploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.custom.accent.teal,
  borderColor: theme.palette.custom.accent.teal,
  "&:hover": {
    borderColor: theme.palette.custom.accent.tealDark,
    backgroundColor: "transparent",
  },
}));

export const ThumbnailStack = styled(Stack)({
  width: "100%",
});
