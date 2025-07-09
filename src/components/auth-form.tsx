"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HashLoader } from "react-spinners";
import { useSupabase } from "@/contexts/SupabaseContext";
import {
  AuthFormPaper,
  AuthFormTitle,
  AlertContainer,
  FormContainer,
  SubmitButton,
} from "@/components/styles/auth/auth-form.styles";

interface AuthFormProps {
  mode: "signin" | "signup";
}

interface FormValues {
  email: string;
  password: string;
}

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AuthForm = ({ mode }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const theme = useTheme();

  const { signIn, signUp } = useSupabase();

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signin") {
        await signIn(values.email, values.password);
        setMessage("Signed in successfully!");
      } else {
        await signUp(values.email, values.password);
        setMessage("Check your email for the confirmation link!");
      }
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
        {mode === "signin" ? "Sign In" : "Sign Up"}
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

              <Field
                as={TextField}
                fullWidth
                name="password"
                label="Password"
                type="password"
                margin="normal"
                required
                disabled={loading}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || isSubmitting}
              >
                {loading ? (
                  <HashLoader color={theme.palette.custom.text.white} size={20} />
                ) : mode === "signin" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </SubmitButton>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </AuthFormPaper>
  );
};

export default AuthForm;
