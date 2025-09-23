"use client";

import { useState } from "react";
import { CardContent, Box, Skeleton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardTitle,
  EditButton,
  ProfileInfoItem,
  ProfileInfoLabel,
  ProfileInfoValue,
  ProfileInfoInput,
  SaveButton,
  CancelButton,
  SkeletonButton,
  ButtonContainer,
  CircularProgressWithMargin,
} from "@/components/styles/profile/profile.styles";
import { useSupabase } from "@/contexts/supabase-context";
import { trpc } from "@/lib/trpc/client";

const validationSchema = Yup.object({
  full_name: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .required("Full name is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    )
    .required("Username is required"),
});

export const PersonalInfoSection = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { userProfile, user, loading: isLoading } = useSupabase();
  const { mutateAsync: updateProfile, isPending: isPendingUpdate } =
    trpc.users.updateProfile.useMutation();
  const utils = trpc.useUtils();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (values: {
    full_name: string;
    username: string;
  }) => {
    try {
      await updateProfile({
        full_name: values.full_name,
        username: values.username,
      });

      utils.users.getUserProfile.invalidate();

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (isLoading || !userProfile) {
    return (
      <ProfileCard>
        <CardContent>
          <ProfileCardHeader>
            <ProfileCardTitle>Personal Info</ProfileCardTitle>
            <SkeletonButton variant="rectangular" width={60} height={32} />
          </ProfileCardHeader>
          <Box>
            <ProfileInfoItem>
              <ProfileInfoLabel>Full Name</ProfileInfoLabel>
              <Skeleton variant="text" width="60%" height={24} />
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoLabel>Email</ProfileInfoLabel>
              <Skeleton variant="text" width="70%" height={24} />
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoLabel>Username</ProfileInfoLabel>
              <Skeleton variant="text" width="50%" height={24} />
            </ProfileInfoItem>
          </Box>
        </CardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <CardContent>
        <ProfileCardHeader>
          <ProfileCardTitle>Personal Info</ProfileCardTitle>
          {!isEditing && (
            <EditButton onClick={handleEditClick} startIcon={<EditIcon />}>
              Edit
            </EditButton>
          )}
        </ProfileCardHeader>

        <Formik
          initialValues={{
            full_name: userProfile?.full_name || "",
            username: userProfile?.username || "",
          }}
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
            isValid,
            dirty,
          }) => (
            <Form>
              <Box>
                <ProfileInfoItem>
                  <ProfileInfoLabel>Full Name</ProfileInfoLabel>
                  {isEditing ? (
                    <Field
                      as={ProfileInfoInput}
                      fullWidth
                      name="full_name"
                      value={values.full_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      error={touched.full_name && Boolean(errors.full_name)}
                      helperText={touched.full_name && errors.full_name}
                    />
                  ) : (
                    <ProfileInfoValue>
                      {userProfile?.full_name || "Not set"}
                    </ProfileInfoValue>
                  )}
                </ProfileInfoItem>

                <ProfileInfoItem>
                  <ProfileInfoLabel>Username</ProfileInfoLabel>
                  {isEditing ? (
                    <Field
                      as={ProfileInfoInput}
                      fullWidth
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your username"
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />
                  ) : (
                    <ProfileInfoValue>
                      {userProfile?.username || "Not set"}
                    </ProfileInfoValue>
                  )}
                </ProfileInfoItem>

                <ProfileInfoItem>
                  <ProfileInfoLabel>Email</ProfileInfoLabel>
                  <ProfileInfoValue>
                    {user?.email || "Not set"}
                  </ProfileInfoValue>
                </ProfileInfoItem>
              </Box>

              {isEditing && (
                <ButtonContainer>
                  <CancelButton onClick={handleCancelClick}>
                    Cancel
                  </CancelButton>
                  <SaveButton
                    type="submit"
                    disabled={isPendingUpdate || !isValid || !dirty}
                  >
                    {isPendingUpdate ? (
                      <CircularProgressWithMargin size={16} color="inherit" />
                    ) : (
                      "Save changes"
                    )}
                  </SaveButton>
                </ButtonContainer>
              )}
            </Form>
          )}
        </Formik>
      </CardContent>
    </ProfileCard>
  );
};
