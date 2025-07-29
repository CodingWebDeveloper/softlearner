"use client";

import { useState } from "react";
import {
  CardContent,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  ProfileCard,
  ChangePasswordButton,
  PasswordFormContainer,
  PasswordButtonContainer,
  UpdatePasswordButton,
  CancelPasswordButton,
  ProfileDivider,
  PasswordHeaderContainer,
  PasswordDescription,
  SuccessAlert,
} from "@/components/styles/profile/profile.styles";
import { trpc } from "@/lib/trpc/client";

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(1, "Current password is required")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutateAsync: changePassword, isPending: isChanging } =
    trpc.users.changePassword.useMutation();

  const handleSubmit = async (
    values: ChangePasswordFormValues,
    { resetForm, setFieldError }: FormikHelpers<ChangePasswordFormValues>
  ) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      setShowSuccess(true);
      setShowForm(false);
      resetForm();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      // Check if it's a validation error and set appropriate field error
      if (
        errorMessage.includes("New password and confirm password do not match")
      ) {
        setFieldError("confirmPassword", "Passwords do not match");
      } else if (errorMessage.includes("New password must be different")) {
        setFieldError(
          "newPassword",
          "New password must be different from current password"
        );
      } else {
        setFieldError("currentPassword", errorMessage);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowSuccess(false);
  };

  const initialValues: ChangePasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  return (
    <ProfileCard>
      <CardContent>
        <PasswordHeaderContainer>
          <Typography variant="h6" component="h3">
            Password
          </Typography>

          {!showForm && (
            <ChangePasswordButton
              variant="outlined"
              onClick={() => setShowForm(true)}
            >
              Change password
            </ChangePasswordButton>
          )}
        </PasswordHeaderContainer>

        <ProfileDivider />

        {showSuccess && (
          <SuccessAlert severity="success">
            Password changed successfully!
          </SuccessAlert>
        )}

        {!showForm ? (
          <PasswordDescription variant="body2">
            Strengthen your account by ensuring your password is strong.
          </PasswordDescription>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={changePasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form>
                <PasswordFormContainer>
                  <Field
                    as={TextField}
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    fullWidth
                    error={
                      touched.currentPassword && Boolean(errors.currentPassword)
                    }
                    helperText={
                      touched.currentPassword && errors.currentPassword
                    }
                    disabled={isChanging}
                  />

                  <Field
                    as={TextField}
                    name="newPassword"
                    label="New Password"
                    type="password"
                    fullWidth
                    error={touched.newPassword && Boolean(errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                    disabled={isChanging}
                  />

                  <Field
                    as={TextField}
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    disabled={isChanging}
                  />

                  <PasswordButtonContainer>
                    <UpdatePasswordButton
                      type="submit"
                      variant="contained"
                      disabled={isChanging || !isValid || !dirty}
                    >
                      {isChanging ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Update Password"
                      )}
                    </UpdatePasswordButton>
                    <CancelPasswordButton
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isChanging}
                    >
                      Cancel
                    </CancelPasswordButton>
                  </PasswordButtonContainer>
                </PasswordFormContainer>
              </Form>
            )}
          </Formik>
        )}
      </CardContent>
    </ProfileCard>
  );
};
