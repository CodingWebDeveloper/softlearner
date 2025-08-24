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
  videoUrl: Yup.string().url("Must be a valid URL"),
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
    console.log({
      ...values,
      thumbnailFile,
    });
    // TODO: Implement form submission with file upload
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
            handleSubmit,
            isSubmitting,
            isValid,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
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
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />

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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                error={touched.new_price && Boolean(errors.new_price)}
                helperText={touched.new_price && errors.new_price}
              />

              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={values.category}
                  label="Category"
                  onChange={handleChange}
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
                label="Preview Video URL"
                value={values.videoUrl}
                onChange={handleChange}
                error={touched.videoUrl && Boolean(errors.videoUrl)}
                helperText={touched.videoUrl && errors.videoUrl}
              />

              <ThumbnailContainer>
                <UploadThumbnail onFileSelect={setThumbnailFile} />
              </ThumbnailContainer>

              <ButtonContainer>
                <ResetButton variant="outlined" onClick={() => resetForm()}>
                  Reset
                </ResetButton>
                <SaveButton
                  type="submit"
                  variant="contained"
                  disabled={!isValid || isSubmitting}
                >
                  Save
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
