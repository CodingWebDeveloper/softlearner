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
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import CategoryInput from "./CategoryInput";
import { SaveOrderButton } from "@/components/styles/creator/resources-form.styles";
import {
  FormContainer,
  ThumbnailContainer,
  ButtonContainer,
} from "@/components/styles/creator/general-form.styles";
import { WhiteText } from "@/components/styles/infrastructure/layout.styles";
import { useSnackbar } from "notistack";

const validationSchema = Yup.object({
  name: Yup.string().required("Course name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be greater than or equal to 0"),
  new_price: Yup.number().min(
    0,
    "New Price must be greater than or equal to 0",
  ),
  categoryId: Yup.string().required("Category is required"),
  videoUrl: Yup.string().required("Video URL is required"),
});

interface UpdateGeneralFormProps {
  courseId: string;
}

const UpdateGeneralForm = ({ courseId }: UpdateGeneralFormProps) => {
  // General hooks
  const { enqueueSnackbar } = useSnackbar();
  // States
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Mutations
  const { mutateAsync: updateCourse } = trpc.courses.updateCourse.useMutation();

  // Queries
  const {
    data: courseData,
    isPending: isLoadingCourse,
    error: errorCourse,
  } = trpc.courses.getCourseDataById.useQuery(courseId);

  const { data: thumbData, isLoading: isLoadingThumbnail } =
    trpc.courses.getThumbnail.useQuery(
      { path: courseData?.thumbnail_image_url || "" },
      { enabled: Boolean(courseData?.thumbnail_image_url) },
    );

  const initialValues = {
    name: courseData?.name ?? "",
    description: courseData?.description ?? "",
    price: courseData ? String(courseData.price) : "",
    new_price:
      courseData?.new_price != null ? String(courseData.new_price) : "",
    categoryId: courseData?.category?.id ?? "",
    videoUrl: courseData?.video_url ?? "",
  };

  // Handlers
  const handleSubmit = async (values: typeof initialValues) => {
    const formData = new FormData();
    if (thumbnailFile) {
      formData.append("thumbnail_image", thumbnailFile);
    }
    formData.append("id", courseId);
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("new_price", values.new_price);
    formData.append("category_id", values.categoryId);
    formData.append("video_url", values.videoUrl);

    try {
      await updateCourse(formData);
      enqueueSnackbar("Course created successfully", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
      });
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to update course",
        {
          variant: "error",
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
        },
      );
    }
  };

  const renderLoading = () => (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={140} />
      <Skeleton variant="text" width={200} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={120} />
      <Skeleton variant="text" width={200} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={56} />
    </Stack>
  );

  if (isLoadingCourse) {
    return <FormContainer>{renderLoading()}</FormContainer>;
  }

  if (errorCourse || !courseData) {
    return (
      <FormContainer>
        <WhiteText variant="body1">Failed to load courseData data.</WhiteText>
      </FormContainer>
    );
  }

  const previewSrc = thumbData?.base64
    ? `data:image/*;base64,${thumbData.base64}`
    : null;

  // Effects

  return (
    <FormContainer>
      <Stack spacing={2}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <>
              <form onSubmit={handleSubmit}>
                <ThumbnailContainer>
                  <WhiteText variant="h6" gutterBottom>
                    Upload Thumbnail
                  </WhiteText>
                  <UploadThumbnail
                    isLoading={isLoadingThumbnail}
                    previewSrc={previewSrc}
                    onFileSelect={setThumbnailFile}
                  />
                </ThumbnailContainer>

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
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
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
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                    }}
                    error={touched.new_price && Boolean(errors.new_price)}
                    helperText={
                      (touched.new_price && errors.new_price) ||
                      "Optional: Use this field to set a discounted price"
                    }
                  />
                </Box>

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
                      !isValid || (!dirty && !thumbnailFile) || isSubmitting
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

export default UpdateGeneralForm;
