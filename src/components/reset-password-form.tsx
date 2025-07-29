"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HashLoader } from "react-spinners";
import { useSupabase } from "@/contexts/supabase-context";
import {
  AuthFormPaper,
  AuthFormTitle,
  AlertContainer,
  FormContainer,
  SubmitButton,
} from "@/components/styles/auth/auth-form.styles";

interface FormValues {
  email: string;
}

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const theme = useTheme();

  const { resetPassword } = useSupabase();

  const initialValues: FormValues = {
    email: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await resetPassword(values.email);
      setMessage(
        "Password reset link sent! Check your email for further instructions."
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <AuthFormPaper>
      <AuthFormTitle variant="h4" component="h1">
        Reset Password
      </AuthFormTitle>

      {error && <AlertContainer severity="error">{error}</AlertContainer>}

      {message && <AlertContainer severity="success">{message}</AlertContainer>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <FormContainer>
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                type="email"
                margin="normal"
                required
                disabled={loading}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || isSubmitting}
              >
                {loading ? (
                  <HashLoader
                    color={theme.palette.custom.text.white}
                    size={20}
                  />
                ) : (
                  "Send Reset Link"
                )}
              </SubmitButton>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </AuthFormPaper>
  );
};

export default ResetPasswordForm;
