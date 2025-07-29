"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HashLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/contexts/supabase-context";
import {
  AuthFormPaper,
  AuthFormTitle,
  AlertContainer,
  FormContainer,
  SubmitButton,
} from "@/components/styles/auth/auth-form.styles";

interface FormValues {
  password: string;
  confirmPassword: string;
}

// Validation schema
const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const UpdatePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  const { updatePassword, setRecoveryMode } = useSupabase();

  const initialValues: FormValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await updatePassword(values.password);
      setMessage("Password updated successfully!");

      // Exit recovery mode
      setRecoveryMode(false);

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
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
        Update Password
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
                name="password"
                label="New Password"
                type="password"
                margin="normal"
                required
                disabled={loading}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Field
                as={TextField}
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                margin="normal"
                required
                disabled={loading}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
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
                  "Update Password"
                )}
              </SubmitButton>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </AuthFormPaper>
  );
};

export default UpdatePasswordForm;
