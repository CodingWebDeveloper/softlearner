"use client";

import { Container } from "@mui/material";
import { ProfileContent } from "@/components/profile/profile-content";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import {
  ProfilePageHeader,
  ProfilePageTitle,
  ProfilePageDescription,
} from "@/components/styles/profile/profile.styles";

export default function ProfilePage() {
  return (
    <PageContainer>
      <Container maxWidth="lg">
        <ProfilePageHeader>
          <ProfilePageTitle variant="h4" component="h1" gutterBottom>
            Profile
          </ProfilePageTitle>
          <ProfilePageDescription variant="body1">
            Manage your account settings and preferences
          </ProfilePageDescription>
        </ProfilePageHeader>

        <ProfileContent />
      </Container>
    </PageContainer>
  );
}
