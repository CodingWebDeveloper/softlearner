"use client";

import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import UploadThumbnail from "./upload-thumbnail";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const FormContainer = styled("div")(({ theme }) => ({
  maxWidth: "800px",
  "& .MuiTextField-root, & .MuiFormControl-root": {
    marginBottom: theme.spacing(3),
  },
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ButtonContainer = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: 16,
});

const ResetButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  color: theme.palette.custom.accent.gray,
  borderColor: theme.palette.custom.accent.gray,
  "&:hover": {
    borderColor: theme.palette.custom.accent.teal,
    color: theme.palette.custom.accent.teal,
    backgroundColor: "transparent",
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  backgroundColor: theme.palette.custom.accent.teal,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
  "&:disabled": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.light,
  },
}));

const validationSchema = Yup.object({
  name: Yup.string().required("Course name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be greater than or equal to 0"),
  new_price: Yup.number().min(
    0,
    "New Price must be greater than or equal to 0"
  ),
  category: Yup.string().required("Category is required"),
  videoUrl: Yup.string().required("Video URL is required"),
});

const GeneralForm = () => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const initialValues = {
    name: "",
    description: "",
    price: "",
    new_price: "",
    category: "",
    videoUrl: "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    const formData = new FormData();
    formData.append("thumbnail", thumbnailFile as File);
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("new_price", values.new_price);
    formData.append("category", values.category);
    formData.append("videoUrl", values.videoUrl);
  };

  return (
    <FormContainer>
      <Stack spacing={2}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* File Upload Section */}
              <ThumbnailContainer>
                <Typography variant="h6" gutterBottom>
                  Upload Thumbnail
                </Typography>
                <UploadThumbnail onFileSelect={setThumbnailFile} />
              </ThumbnailContainer>

              {/* Main Details Section */}
              <Typography variant="h6" gutterBottom>
                Course Details
              </Typography>

              <TextField
                fullWidth
                id="name"
                name="name"
                label="Course Name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />

              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />

              {/* Pricing Section */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Pricing
              </Typography>

              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />

                <TextField
                  fullWidth
                  id="new_price"
                  name="new_price"
                  label="New Price"
                  type="number"
                  value={values.new_price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  error={touched.new_price && Boolean(errors.new_price)}
                  helperText={
                    (touched.new_price && errors.new_price) ||
                    "Optional: Use this field to set a discounted price"
                  }
                />
              </Box>

              {/* Category and Video URL Section */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Additional Details
              </Typography>

              <FormControl fullWidth>
                <InputLabel
                  error={touched.category && Boolean(errors.category)}
                  id="category-label"
                >
                  Category
                </InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={values.category}
                  label="Category"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.category && Boolean(errors.category)}
                >
                  <MenuItem value="web-development">Web Development</MenuItem>
                  <MenuItem value="mobile-development">
                    Mobile Development
                  </MenuItem>
                  <MenuItem value="data-science">Data Science</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                id="videoUrl"
                name="videoUrl"
                label="YouTube Preview Video URL"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                value={values.videoUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.videoUrl && Boolean(errors.videoUrl)}
                helperText={
                  (touched.videoUrl && errors.videoUrl) ||
                  "Use the YouTube embed URL (click Share > Embed on YouTube and copy the URL from the iframe src)"
                }
              />

              <ButtonContainer>
                <SaveButton
                  type="submit"
                  variant="contained"
                  disabled={!isValid || !thumbnailFile || isSubmitting}
                >
                  Create
                </SaveButton>
              </ButtonContainer>
            </form>
          )}
        </Formik>
      </Stack>
    </FormContainer>
  );
};

export default GeneralForm;
