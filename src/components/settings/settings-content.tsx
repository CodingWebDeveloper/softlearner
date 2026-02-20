"use client";

import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeMode } from "@/providers/theme-provider";

export default function SettingsContent() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Box sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Settings
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Appearance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Switch between light and dark theme.
              </Typography>
            </Box>

            <FormControlLabel
              sx={{ ml: 2 }}
              control={
                <Switch
                  checked={isDark}
                  onChange={toggleMode}
                  color="primary"
                  inputProps={{ "aria-label": "Toggle dark mode" }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isDark ? (
                    <DarkMode fontSize="small" />
                  ) : (
                    <LightMode fontSize="small" />
                  )}
                  <Typography variant="body2">
                    {isDark ? "Dark mode" : "Light mode"}
                  </Typography>
                </Box>
              }
              labelPlacement="start"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
