"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Input,
} from "@mui/material";
import { SimpleResource } from "@/services/interfaces/service.interfaces";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";
import {
  StyledDialog,
  StyledDialogTitle,
  StyledDialogContent,
  ActionButton,
  ButtonContainer,
} from "@/components/styles/creator/edit-resource-dialog.styles";
import { useState } from "react";

interface EditResourceDialogProps {
  open: boolean;
  onClose: () => void;
  resource: SimpleResource;
  onSave: (formData: FormData) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Title is required"),
  short_summary: Yup.string().required("Description is required"),
  duration: Yup.string()
    .matches(
      /^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$/,
      "Duration must be in format HH:MM:SS or MM:SS"
    )
    .required("Duration is required"),
  type: Yup.string()
    .oneOf(Object.values(RESOURCE_TYPES))
    .required("Type is required"),
  url: Yup.string().when("type", {
    is: RESOURCE_TYPES.VIDEO,
    then: (schema) => schema.required("Video URL is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

const EditResourceDialog = ({
  open,
  onClose,
  resource,
  onSave,
}: EditResourceDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const formik = useFormik({
    initialValues: {
      name: resource.name,
      short_summary: resource.short_summary,
      duration: resource.duration,
      type: resource.type,
      url: resource.url,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("short_summary", values.short_summary || "");
      formData.append("duration", values.duration || "");
      formData.append("type", values.type || "");

      if (values.type === RESOURCE_TYPES.VIDEO) {
        formData.append("url", values.url || "");
      } else if (values.type === RESOURCE_TYPES.DOWNLOADABLE_FILE && file) {
        formData.append("file", file);
      }

      onSave(formData);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      setFile(event.currentTarget.files[0]);
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-resource-dialog"
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle id="edit-resource-dialog">
        Edit Resource
      </StyledDialogTitle>
      <StyledDialogContent>
        <form style={{ marginTop: "20px" }} onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Title"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            id="short_summary"
            name="short_summary"
            label="Description"
            multiline
            rows={3}
            value={formik.values.short_summary}
            onChange={formik.handleChange}
            error={
              formik.touched.short_summary &&
              Boolean(formik.errors.short_summary)
            }
            helperText={
              formik.touched.short_summary && formik.errors.short_summary
            }
          />

          <TextField
            fullWidth
            id="duration"
            name="duration"
            label="Duration (HH:MM:SS)"
            value={formik.values.duration}
            onChange={formik.handleChange}
            error={formik.touched.duration && Boolean(formik.errors.duration)}
            helperText={formik.touched.duration && formik.errors.duration}
          />

          <FormControl
            fullWidth
            error={formik.touched.type && Boolean(formik.errors.type)}
          >
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              label="Type"
              MenuProps={{
                PaperProps: {
                  sx: (theme) => ({
                    backgroundColor: theme.palette.custom.background.card,
                    "& .MuiMenuItem-root": {
                      color: theme.palette.custom.text.light,
                      "&:hover": {
                        backgroundColor:
                          theme.palette.custom.background.tertiary,
                      },
                      "&.Mui-selected": {
                        backgroundColor: `${theme.palette.custom.accent.teal}20`,
                        "&:hover": {
                          backgroundColor: `${theme.palette.custom.accent.teal}30`,
                        },
                      },
                    },
                  }),
                },
              }}
            >
              <MenuItem value={RESOURCE_TYPES.VIDEO}>Video</MenuItem>
              <MenuItem value={RESOURCE_TYPES.DOWNLOADABLE_FILE}>File</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type && (
              <FormHelperText>{formik.errors.type}</FormHelperText>
            )}
          </FormControl>

          {formik.values.type === RESOURCE_TYPES.VIDEO ? (
            <TextField
              fullWidth
              id="url"
              name="url"
              label="Video URL"
              value={formik.values.url}
              onChange={formik.handleChange}
              error={formik.touched.url && Boolean(formik.errors.url)}
              helperText={formik.touched.url && formik.errors.url}
            />
          ) : (
            <FormControl fullWidth error={Boolean(file)}>
              <Input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <ActionButton
                component="label"
                htmlFor="file"
                variant="outlined"
                fullWidth
              >
                {file ? file.name : "Choose File"}
              </ActionButton>
              {file && <FormHelperText>{file.name}</FormHelperText>}
            </FormControl>
          )}

          <ButtonContainer>
            <ActionButton onClick={handleClose} variant="text">
              Cancel
            </ActionButton>
            <ActionButton type="submit" variant="contained">
              Save Changes
            </ActionButton>
          </ButtonContainer>
        </form>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default EditResourceDialog;
