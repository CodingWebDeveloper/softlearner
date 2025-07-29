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
  ProfileBioText,
  ProfileBioTextarea,
  SaveButton,
  CancelButton,
  SkeletonButton,
  ButtonContainer,
  CircularProgressWithMargin,
} from "@/components/styles/profile/profile.styles";
import { useSupabase } from "@/contexts/supabase-context";
import { trpc } from "@/lib/trpc/client";

const validationSchema = Yup.object({
  bio: Yup.string()
    .max(500, "Bio must be less than 500 characters")
    .required("Bio is required"),
});

export const BioSection = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { userProfile, loading: isLoading } = useSupabase();
  const { mutateAsync: updateProfile, isPending: isPendingUpdate } =
    trpc.users.updateProfile.useMutation();
  const utils = trpc.useUtils();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (values: { bio: string }) => {
    try {
      await updateProfile({
        bio: values.bio,
      });

      utils.users.getUserProfile.invalidate();

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving bio:", error);
    }
  };

  if (isLoading || !userProfile) {
    return (
      <ProfileCard>
        <CardContent>
          <ProfileCardHeader>
            <ProfileCardTitle>Bio</ProfileCardTitle>
            <SkeletonButton variant="rectangular" width={60} height={32} />
          </ProfileCardHeader>
          <Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        </CardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <CardContent>
        <ProfileCardHeader>
          <ProfileCardTitle>Bio</ProfileCardTitle>
          {!isEditing && (
            <EditButton onClick={handleEditClick} startIcon={<EditIcon />}>
              Edit
            </EditButton>
          )}
        </ProfileCardHeader>

        <Formik
          initialValues={{
            bio: userProfile?.bio || "",
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
              {isEditing ? (
                <Field
                  as={ProfileBioTextarea}
                  fullWidth
                  multiline
                  rows={6}
                  name="bio"
                  value={values.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell us about yourself..."
                  variant="outlined"
                  error={touched.bio && Boolean(errors.bio)}
                  helperText={touched.bio && errors.bio}
                />
              ) : (
                <ProfileBioText>
                  {userProfile?.bio ||
                    "No bio added yet. Click edit to add your bio."}
                </ProfileBioText>
              )}

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
