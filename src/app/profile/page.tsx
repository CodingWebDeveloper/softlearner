import { Container, Typography, Box } from "@mui/material";
import { ProfileContent } from "@/components/profile/profile-content";

export default function ProfilePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "custom.background.dark",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: "custom.text.white" }}
          >
            Profile
          </Typography>
          <Typography variant="body1" sx={{ color: "custom.text.light" }}>
            Manage your account settings and preferences
          </Typography>
        </Box>

        <ProfileContent />
      </Container>
    </Box>
  );
}
