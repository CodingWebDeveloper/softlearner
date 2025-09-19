"use client";

import { useMemo } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  IconButton,
  TextField,
  Rating,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  StyledDialog,
  Header,
  Title,
  Content,
  Actions,
  HelperText,
} from "../styles/reviews/review-modal.styles";
import { StyledButton } from "../styles/infrastructure/layout.styles";

export type ReviewFormValues = {
  rating: number;
  content: string;
};

export type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    values: ReviewFormValues,
    { setSubmitting }: FormikHelpers<ReviewFormValues>
  ) => Promise<void> | void;
  initialValues?: Partial<ReviewFormValues>;
};

const defaultInitialValues: ReviewFormValues = {
  rating: 0,
  content: "",
};

const ValidationSchema = Yup.object().shape({
  rating: Yup.number().min(1, "Please select a rating").required("Required"),
  content: Yup.string()
    .trim()
    .min(10, "Text should be at least 10 characters long")
    .max(2000, "Text should be at most 2000 characters long")
    .required("Required"),
});

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
  initialValues,
}: ReviewModalProps) {
  // General hooks

  const mergedInitialValues = useMemo<ReviewFormValues>(
    () =>
      ({
        ...defaultInitialValues,
        ...initialValues,
      } as ReviewFormValues),
    [initialValues]
  );

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Header>
        <Title variant="h6">Leave a Review</Title>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close review modal"
        >
          <CloseIcon />
        </IconButton>
      </Header>

      <Formik
        initialValues={mergedInitialValues}
        validationSchema={ValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          isValid,
          dirty,
        }) => {
          return (
            <Form>
              <Content>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating
                    name="rating"
                    value={values.rating}
                    onChange={(_, newValue) =>
                      setFieldValue("rating", newValue || 0)
                    }
                  />
                </Box>

                <Field
                  as={TextField}
                  name="content"
                  label="Your Review"
                  placeholder="What did you like or dislike?"
                  value={values.content}
                  error={Boolean(touched.content && errors.content)}
                  helperText={
                    touched.content && errors.content ? errors.content : ""
                  }
                  multiline
                  minRows={5}
                  fullWidth
                />
              </Content>

              <Actions>
                <HelperText>
                  You&apos;ll have 24 hours to edit your review after posting.
                </HelperText>

                <StyledButton
                  variant="contained"
                  disabled={!isValid || !dirty || isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Submit Review"
                  )}
                </StyledButton>
              </Actions>

              {/* keep an actual Form element to support Enter key submissions */}
              <Form style={{ display: "none" }} />
            </Form>
          );
        }}
      </Formik>
    </StyledDialog>
  );
}
