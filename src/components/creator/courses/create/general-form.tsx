"use client";

import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import UploadThumbnail from "./upload-thumbnail";
import {
  TextField,
  Box,
  InputAdornment,
  Stack,
  CircularProgress,
} from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { SimpleCourse } from "@/services/interfaces/service.interfaces";
import CategoryInput from "./CategoryInput";
import { SaveOrderButton } from "@/components/styles/creator/resources-form.styles";
import {
  FormContainer,
  ThumbnailContainer,
  ButtonContainer,
} from "@/components/styles/creator/general-form.styles";
import { WhiteText } from "@/components/styles/infrastructure/layout.styles";

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
  categoryId: Yup.string().required("Category is required"),
  videoUrl: Yup.string().required("Video URL is required"),
});

interface GeneralFormProps {
  setCourseId: (courseId: string) => void;
}

const GeneralForm = ({ setCourseId }: GeneralFormProps) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { mutateAsync: createCourse } = trpc.courses.createCourse.useMutation();

  const initialValues = {
    name: "",
    description: "",
    price: "",
    new_price: "",
    categoryId: "",
    videoUrl: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const formData = new FormData();

    if (thumbnailFile) {
      formData.append("thumbnail_image", thumbnailFile);
    }
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("new_price", values.new_price);
    formData.append("category_id", values.categoryId);
    formData.append("video_url", values.videoUrl);

    try {
      const course = (await createCourse(formData)) as SimpleCourse;
      if (course?.id) {
        setCourseId(course.id);
      }
    } catch (error) {
      console.error("Failed to create course:", error);
      // TODO: Add toast/snackbar error notification
    }
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
            dirty,
          }) => (
            <>
              <form onSubmit={handleSubmit}>
                <ThumbnailContainer>
                  <WhiteText variant="h6" gutterBottom>
                    Upload Thumbnail
                  </WhiteText>
                  <UploadThumbnail onFileSelect={setThumbnailFile} />
                </ThumbnailContainer>

                {/* Main Details Section */}
                <WhiteText variant="h6" gutterBottom>
                  Course Details
                </WhiteText>

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
                <WhiteText variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Pricing
                </WhiteText>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
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
                <WhiteText variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Additional Details
                </WhiteText>

                <CategoryInput name="categoryId" />

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
                  <SaveOrderButton
                    type="submit"
                    variant="contained"
                    disabled={
                      !isValid || !dirty || !thumbnailFile || isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Save Changes"
                    )}
                  </SaveOrderButton>
                </ButtonContainer>
              </form>
            </>
          )}
        </Formik>
      </Stack>
    </FormContainer>
  );
};

export default GeneralForm;
