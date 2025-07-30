"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { trpc } from "@/lib/trpc/client";

// Validation schema
const validationSchema = Yup.object({
  bio: Yup.string()
    .min(10, "Bio must be at least 10 characters")
    .required("Bio is required"),
  content_type: Yup.string()
    .min(1, "Content type is required")
    .required("Content type is required"),
  portfolio_links: Yup.array()
    .of(Yup.string().url("Invalid URL format"))
    .min(1, "At least one portfolio link is required")
    .required("Portfolio links are required"),
  experience_level: Yup.string()
    .oneOf(
      ["beginner", "intermediate", "advanced", "expert"],
      "Invalid experience level"
    )
    .required("Experience level is required"),
  motivation: Yup.string()
    .min(20, "Motivation must be at least 20 characters")
    .required("Motivation is required"),
});

interface ApplicationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplicationForm = ({
  open,
  onClose,
  onSuccess,
}: ApplicationFormProps) => {
  // States
  const [portfolioLink, setPortfolioLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Mutations
  const createApplicationMutation =
    trpc.creatorApplications.createApplication.useMutation({
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  // Formik
  const formik = useFormik({
    initialValues: {
      bio: "",
      content_type: "",
      portfolio_links: [] as string[],
      experience_level: "" as
        | "beginner"
        | "intermediate"
        | "advanced"
        | "expert",
      motivation: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setError(null);
      createApplicationMutation.mutate(values);
    },
  });

  // Handlers
  const handleAddPortfolioLink = () => {
    if (
      portfolioLink &&
      !formik.values.portfolio_links.includes(portfolioLink)
    ) {
      formik.setFieldValue("portfolio_links", [
        ...formik.values.portfolio_links,
        portfolioLink,
      ]);
      setPortfolioLink("");
    }
  };

  const handleRemovePortfolioLink = (linkToRemove: string) => {
    formik.setFieldValue(
      "portfolio_links",
      formik.values.portfolio_links.filter((link) => link !== linkToRemove)
    );
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Creator Application
        <Typography variant="body2" color="text.secondary">
          Apply to become a content creator and share your knowledge with the
          community
        </Typography>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Bio */}
            <TextField
              fullWidth
              multiline
              rows={4}
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself, your background, and expertise..."
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bio && Boolean(formik.errors.bio)}
              helperText={formik.touched.bio && formik.errors.bio}
            />

            {/* Content Type */}
            <TextField
              fullWidth
              name="content_type"
              label="Content Type"
              placeholder="e.g., Programming tutorials, Design courses, Business insights..."
              value={formik.values.content_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.content_type &&
                Boolean(formik.errors.content_type)
              }
              helperText={
                formik.touched.content_type && formik.errors.content_type
              }
            />

            {/* Experience Level */}
            <FormControl fullWidth>
              <InputLabel>Experience Level</InputLabel>
              <Select
                name="experience_level"
                value={formik.values.experience_level}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.experience_level &&
                  Boolean(formik.errors.experience_level)
                }
                label="Experience Level"
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>

            {/* Portfolio Links */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Portfolio Links
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://github.com/username"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPortfolioLink();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddPortfolioLink}
                  disabled={!portfolioLink}
                  sx={{ textTransform: "none" }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formik.values.portfolio_links.map((link, index) => (
                  <Chip
                    key={index}
                    label={link}
                    onDelete={() => handleRemovePortfolioLink(link)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              {formik.touched.portfolio_links &&
                formik.errors.portfolio_links && (
                  <Typography variant="caption" color="error">
                    {formik.errors.portfolio_links}
                  </Typography>
                )}
            </Box>

            {/* Motivation */}
            <TextField
              fullWidth
              multiline
              rows={4}
              name="motivation"
              label="Motivation"
              placeholder="Why do you want to become a creator? What value will you bring to the community?"
              value={formik.values.motivation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.motivation && Boolean(formik.errors.motivation)
              }
              helperText={formik.touched.motivation && formik.errors.motivation}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={createApplicationMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createApplicationMutation.isPending || !formik.isValid}
            startIcon={
              createApplicationMutation.isPending ? (
                <CircularProgress size={20} />
              ) : null
            }
            sx={{ textTransform: "none" }}
          >
            {createApplicationMutation.isPending
              ? "Submitting..."
              : "Submit Application"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
