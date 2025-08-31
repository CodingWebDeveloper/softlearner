"use client";

import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";
import {
  TextField,
  Stack,
  Typography,
  Box,
  Radio,
  FormControlLabel,
  CircularProgress,
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
} from "@/components/styles/creator/resources-form.styles";

type FileType = "video" | "downloadable";

interface Resource {
  title: string;
  description: string;
  type: FileType;
  duration: string;
  url?: string;
  file?: File | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  duration: Yup.string()
    .required("Duration is required")
    .matches(
      /^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$/,
      "Duration must be in format HH:MM:SS or MM:SS"
    ),
  url: Yup.string().when("type", {
    is: "video",
    then: (schema) => schema.required("YouTube URL is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

interface ResourceFormProps {
  courseId: string | null;
}

const ResourcesForm = ({ courseId }: ResourceFormProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>("downloadable");
  const { enqueueSnackbar } = useSnackbar();
  const createResourceMutation = trpc.resources.createResource.useMutation({
    onSuccess: () => {
      enqueueSnackbar("Resource added successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || "Failed to create resource", {
        variant: "error",
      });
    },
  });

  const initialValues = {
    title: "",
    description: "",
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
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("type", fileType);
      formData.append("duration", values.duration);
      formData.append("course_id", courseId || "");

      if (fileType === "video") {
        formData.append("url", values.url);
      } else if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Call the API to create the resource
      await createResourceMutation.mutateAsync(formData);

      // Add to local state only after successful creation
      const newResource: Resource = {
        title: values.title,
        description: values.description,
        type: fileType,
        duration: values.duration,
        ...(fileType === "video"
          ? { url: values.url }
          : { file: selectedFile }),
      };
      setResources([...resources, newResource]);

      // Reset form
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

  const handleDeleteResource = (index: number) => {
    const updatedResources = resources.filter((_, i) => i !== index);
    setResources(updatedResources);
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
        event.target.value = ""; // Reset input
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <FormContainer>
      <Stack spacing={4}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "custom.accent.teal",
            }}
          >
            <FileUploadIcon /> File Type
          </Typography>

          <StyledRadioGroup
            name="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
          >
            <TypeOption
              className={fileType === "downloadable" ? "selected" : ""}
              onClick={() => handleTypeOptionClick("downloadable")}
            >
              <FormControlLabel
                value="downloadable"
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
              className={fileType === "video" ? "selected" : ""}
              onClick={() => handleTypeOptionClick("video")}
            >
              <FormControlLabel
                value="video"
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

          {fileType === "downloadable" && (
            <UploadContainer>
              <input
                type="file"
                accept="*/*"
                style={{ display: "none" }}
                id="resource-file"
                onChange={handleFileChange}
              />
              <label>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
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
                </Box>
              </label>
            </UploadContainer>
          )}
        </Box>

        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "custom.accent.teal",
            }}
          >
            <InsertDriveFileIcon /> Resource Details
          </Typography>
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
                  id="title"
                  name="title"
                  label="Resource Title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />

                {fileType === "video" && (
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

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
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
                </Box>

                <AddResourceButton
                  type="submit"
                  variant="contained"
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    (fileType === "downloadable" && !selectedFile)
                  }
                  startIcon={<AddIcon />}
                >
                  {isSubmitting ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Add Resource"
                  )}
                </AddResourceButton>
              </form>
            )}
          </Formik>
        </Box>

        <ResourcesList resources={resources} onDelete={handleDeleteResource} />
      </Stack>
    </FormContainer>
  );
};

export default ResourcesForm;
