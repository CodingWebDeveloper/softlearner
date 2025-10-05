"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { trpc } from "@/lib/trpc/client";

const WelcomeCard: React.FC = () => {
  const theme = useTheme();
  const { data: profile } = trpc.users.getUserProfile.useQuery();

  const name = profile?.full_name || "Learner";

  return (
    <Card
      elevation={0}
      sx={{
        background: theme.palette.custom.accent.teal,
        color: theme.palette.custom.text.white,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Welcome Back{" "}
              <span role="img" aria-label="wave">
                👋
              </span>
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                mt: 0.5,
                color: theme.palette.custom.text.white,
              }}
            >
              {name}
            </Typography>
          </Box>

          {/* Illustration */}
          <Box sx={{ display: { xs: "none", md: "block" }, flexShrink: 0 }}>
            <Image
              src="/Course_Welcome_Image.png"
              alt="Welcome back illustration"
              width={220}
              height={120}
              priority
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
