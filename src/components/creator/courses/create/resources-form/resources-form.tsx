"use client";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";
import {
  setResources,
  addResource,
  selectOrderedResources,
} from "@/lib/store/features/resourcesSlice";
import type { SimpleResource } from "@/services/interfaces/service.interfaces";
import {
  TextField,
  Stack,
  Typography,
  Box,
  Radio,
  FormControlLabel,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ResourcesList from "./resources-list";
import {
  UploadContainer,
  UploadButton,
} from "@/components/styles/creator/create-course.styles";
import {
  FormContainer,
  StyledRadioGroup,
  TypeOption,
  AddResourceButton,
  SaveOrderButton,
  SectionTitle,
  ResourceDetailsGrid,
  UploadBox,
  SaveOrderBox,
} from "@/components/styles/creator/resources-form.styles";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  RESOURCE_TYPES,
  ResourceType,
} from "@/lib/constants/database-constants";

type FileType = ResourceType;

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  short_summary: Yup.string().required("Short summary is required"),
  duration: Yup.string()
    .required("Duration is required")
    .matches(
      /^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$/,
      "Duration must be in format HH:MM:SS or MM:SS"
    ),
  url: Yup.string().when("type", {
    is: RESOURCE_TYPES.VIDEO,
    then: (schema) => schema.required("YouTube URL is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

interface ResourceFormProps {
  courseId: string | null;
}

const FileTypeSkeleton = () => (
  <Box sx={{ mb: 4 }}>
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} width={150} />
    <Stack spacing={2}>
      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} width={200} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width={300} />
      </Box>
      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} width={120} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width={250} />
      </Box>
    </Stack>
    <Box sx={{ mt: 3, p: 3, border: '2px dashed #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
      <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 2 }} width={100} />
      <Skeleton variant="rectangular" width={120} height={36} sx={{ mx: 'auto', borderRadius: 1 }} />
    </Box>
  </Box>
);

const ResourceDetailsSkeleton = () => (
  <Box>
    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} width={180} />
    <Stack spacing={3}>
      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 200px' }} gap={2}>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
    </Stack>
  </Box>
);

const ResourcesForm = ({ courseId }: ResourceFormProps) => {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>("downloadable file");
  const { enqueueSnackbar } = useSnackbar();

  const resources = useAppSelector(selectOrderedResources) as SimpleResource[];

  const { data: resourcesData, isPending: isLoadingResources } =
    trpc.resources.getAllResourcesByCourseId.useQuery(
      { courseId: courseId || "" },
      { enabled: !!courseId }
    );

  const {
    mutateAsync: updateResourcesOrder,
    isPending: isLoadingUpdateResourcesOrder,
  } = trpc.resources.updateResourcesOrder.useMutation({
    onSuccess: () => {
      enqueueSnackbar("Resource order saved successfully!", {
        variant: "success",
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || "Failed to save resource order", {
        variant: "error",
      });
    },
  });

  const createResourceMutation = trpc.resources.createResource.useMutation({
    onSuccess: (newResource: SimpleResource) => {
      dispatch(addResource(newResource));
      enqueueSnackbar("Resource added successfully!", { variant: "success" });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || "Failed to create resource", {
        variant: "error",
      });
    },
  });

  const initialValues = {
    name: "",
    short_summary: "",
    duration: "",
    url: "",
    type: fileType,
  };

  const handleFileTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as FileType;
    setFileType(newType);
    setSelectedFile(null);
  };

  const handleTypeOptionClick = (type: FileType) => {
    setFileType(type);
    setSelectedFile(null);
  };

  const handleSubmit = async (
    values: typeof initialValues,
    {
      resetForm,
      setSubmitting,
    }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("short_summary", values.short_summary);
      formData.append("type", fileType);
      formData.append("duration", values.duration);
      formData.append("course_id", courseId || "");
      formData.append("order_index", ((resources?.length || 0) + 1).toString());

      if (fileType === RESOURCE_TYPES.VIDEO) {
        formData.append("url", values.url);
      } else if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await createResourceMutation.mutateAsync(formData);

      setSelectedFile(null);
      resetForm();
    } catch (error) {
      console.error("Failed to create resource:", error);
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to create resource",
        {
          variant: "error",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        enqueueSnackbar("File size must be less than 20MB", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSaveOrder = async () => {
    if (!courseId || !resources) return;

    const orderUpdates = resources.map(
      (resource: SimpleResource, index: number) => ({
        id: resource.id,
        order_index: index,
      })
    );

    await updateResourcesOrder({
      courseId,
      orderUpdates,
    });
  };

  useEffect(() => {
    if (resourcesData) {
      dispatch(setResources([...resourcesData]));
    }
  }, [resourcesData, dispatch]);

  if (isLoadingResources) {
    return (
      <FormContainer>
        <Stack spacing={4}>
          <FileTypeSkeleton />
          <ResourceDetailsSkeleton />
          <Box>
            <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} width={180} />
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} width="60%" />
                  <Skeleton variant="text" sx={{ fontSize: '0.875rem', mb: 1 }} width="80%" />
                  <Skeleton variant="text" sx={{ fontSize: '0.75rem' }} width="40%" />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Stack spacing={4}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle variant="h6" gutterBottom>
            <FileUploadIcon /> File Type
          </SectionTitle>

          <StyledRadioGroup
            name="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
          >
            <TypeOption
              className={
                fileType === RESOURCE_TYPES.DOWNLOADABLE_FILE ? "selected" : ""
              }
              onClick={() =>
                handleTypeOptionClick(RESOURCE_TYPES.DOWNLOADABLE_FILE)
              }
            >
              <FormControlLabel
                value={RESOURCE_TYPES.DOWNLOADABLE_FILE}
                control={<Radio />}
                label={
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <InsertDriveFileIcon /> Downloadable File
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Upload a file for users to download
                    </Typography>
                  </Box>
                }
              />
            </TypeOption>
            <TypeOption
              className={fileType === RESOURCE_TYPES.VIDEO ? "selected" : ""}
              onClick={() => handleTypeOptionClick(RESOURCE_TYPES.VIDEO)}
            >
              <FormControlLabel
                value={RESOURCE_TYPES.VIDEO}
                control={<Radio />}
                label={
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <VideoFileIcon /> Video
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Add a YouTube video URL
                    </Typography>
                  </Box>
                }
              />
            </TypeOption>
          </StyledRadioGroup>

          {fileType === RESOURCE_TYPES.DOWNLOADABLE_FILE && (
            <UploadContainer>
              <input
                type="file"
                accept="*/*"
                style={{ display: "none" }}
                id="resource-file"
                onChange={handleFileChange}
              />
              <label>
                <UploadBox>
                  <CloudUploadIcon className="upload-icon" />
                  <Typography
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                  >
                    {selectedFile ? selectedFile.name : "Max 20 MB"}
                  </Typography>
                  <UploadButton
                    component="label"
                    htmlFor="resource-file"
                    startIcon={<FileUploadIcon />}
                  >
                    Upload File
                  </UploadButton>
                </UploadBox>
              </label>
            </UploadContainer>
          )}
        </Box>

        <Box>
          <SectionTitle variant="h6" gutterBottom>
            <InsertDriveFileIcon /> Resource Details
          </SectionTitle>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Resource Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                {fileType === RESOURCE_TYPES.VIDEO && (
                  <TextField
                    fullWidth
                    id="url"
                    name="url"
                    label="YouTube Video URL"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={values.url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.url && Boolean(errors.url)}
                    helperText={
                      (touched.url && errors.url) ||
                      "Use the YouTube embed URL (click Share > Embed on YouTube and copy the URL from the iframe src)"
                    }
                  />
                )}

                <ResourceDetailsGrid>
                  <TextField
                    fullWidth
                    id="short_summary"
                    name="short_summary"
                    label="Description"
                    multiline
                    rows={3}
                    value={values.short_summary}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.short_summary && Boolean(errors.short_summary)
                    }
                    helperText={touched.short_summary && errors.short_summary}
                  />
                  <TextField
                    fullWidth
                    id="duration"
                    name="duration"
                    label="Duration"
                    placeholder="HH:MM:SS"
                    value={values.duration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.duration && Boolean(errors.duration)}
                    helperText={
                      (touched.duration && errors.duration) ||
                      "Enter duration in format HH:MM:SS or MM:SS"
                    }
                    InputProps={{
                      inputProps: {
                        pattern: "^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$",
                      },
                    }}
                  />
                </ResourceDetailsGrid>

                <AddResourceButton
                  type="submit"
                  variant="contained"
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    (fileType === RESOURCE_TYPES.DOWNLOADABLE_FILE &&
                      !selectedFile)
                  }
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <AddIcon />
                    )
                  }
                >
                  Add Resource
                </AddResourceButton>
              </form>
            )}
          </Formik>
        </Box>

        <Box>
          <ResourcesList
            resources={resources}
            isLoading={isLoadingResources}
            courseId={courseId || ""}
          />
          {resources?.length > 0 && (
            <SaveOrderBox>
              <SaveOrderButton
                variant="contained"
                onClick={handleSaveOrder}
                disabled={isLoadingUpdateResourcesOrder}
                startIcon={
                  isLoadingUpdateResourcesOrder && (
                    <CircularProgress color="inherit" size={20} />
                  )
                }
              >
                Save current order
              </SaveOrderButton>
            </SaveOrderBox>
          )}
        </Box>
      </Stack>
    </FormContainer>
  );
};

export default ResourcesForm;
