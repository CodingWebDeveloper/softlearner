"use client";

import { Box, Grid } from "@mui/material";
import { ProfilePictureSection } from "./profile-picture-section";
import { PersonalInfoSection } from "./personal-info-section";
import { BioSection } from "./bio-section";
import { ChangePasswordSection } from "./change-password-section";

export const ProfileContent = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ProfilePictureSection />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PersonalInfoSection />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <BioSection />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ChangePasswordSection />
        </Grid>
      </Grid>
    </Box>
  );
};
