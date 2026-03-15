"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogTitle,
} from "@/components/styles/creator/quiz-dialog.styles";
import { ActionButton } from "@/components/styles/creator/edit-resource-dialog.styles";
interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: QuizFormValues) => void;
  initialValues?: QuizFormValues;
}

export interface QuizFormValues {
  title: string;
  description: string;
  variant: "knowledge" | "skill" | "competence";
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: Yup.string().max(
    500,
    "Description must be at most 500 characters",
  ),
  variant: Yup.string()
    .required("Test type is required")
    .oneOf(["knowledge", "skill", "competence"], "Invalid test type"),
});

const QuizDialog = ({
  open,
  onClose,
  onSubmit,
  initialValues = { title: "", description: "", variant: "knowledge" as const },
}: QuizDialogProps) => {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        {initialValues.title ? "Edit Quiz" : "Create New Quiz"}
      </StyledDialogTitle>
      <Formik
        initialValues={{
          title: initialValues.title || "",
          description: initialValues.description || "",
          variant: initialValues.variant || "knowledge",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          dirty,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <StyledDialogContent>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Quiz Title"
                  placeholder="Enter a descriptive title for your quiz"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <FormControl
                  fullWidth
                  error={touched.variant && Boolean(errors.variant)}
                >
                  <InputLabel id="variant-label">Test Type</InputLabel>
                  <Select
                    labelId="variant-label"
                    id="variant"
                    name="variant"
                    value={values.variant}
                    label="Test Type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="knowledge">Knowledge</MenuItem>
                    <MenuItem value="skill">Skill</MenuItem>
                    <MenuItem value="competence">Competence</MenuItem>
                  </Select>
                  {touched.variant && errors.variant && (
                    <FormHelperText>{errors.variant}</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Quiz Description"
                  placeholder="Provide a brief description of what this quiz covers"
                  multiline
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Box>
            </StyledDialogContent>
            <DialogActions sx={{ padding: 3, gap: 1 }}>
              <ActionButton onClick={onClose}>Cancel</ActionButton>
              <ActionButton
                type="submit"
                variant="contained"
                disabled={!isValid || !dirty}
              >
                {initialValues.title ? "Save Changes" : "Create Quiz"}
              </ActionButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </StyledDialog>
  );
};

export default QuizDialog;
