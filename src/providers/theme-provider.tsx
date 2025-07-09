"use client";

import { ThemeProvider as MuiThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { createTheme, Theme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Create a cache for emotion
const cache = createCache({
  key: "css",
  prepend: true,
});

// Extend the theme interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      background: {
        dark: string;
        secondary: string;
        tertiary: string;
        card: string;
        filter: string;
      };
      text: {
        light: string;
        white: string;
        black: string;
      };
      accent: {
        teal: string;
        tealDark: string;
        blue: string;
        yellow: string;
        orange: string;
        green: string;
        gray: string;
        red: string;
      };
      status: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
    };
  }
  interface PaletteOptions {
    custom?: {
      background: {
        dark: string;
        secondary: string;
        tertiary: string;
        card: string;
        filter: string;
      };
      text?: {
        light: string;
        white: string;
        black: string;
      };
      accent: {
        teal: string;
        tealDark: string;
        blue: string;
        yellow: string;
        orange: string;
        green: string;
        gray: string;
        red: string;
      };
      status: {
        success: string;
        warning: string;
        error: string;
        info?: string;
      };
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    // Custom colors found throughout the codebase
    custom: {
      background: {
        dark: "#1a1b23",
        secondary: "#252730",
        tertiary: "#2d2f3a",
        card: "#23242a",
        filter: "#263238",
      },
      text: {
        light: "#b0b3b8",
        white: "#ffffff",
        black: "#000000",
      },
      accent: {
        teal: "#4ecdc4",
        tealDark: "#45b7af",
        blue: "#4a90e2",
        yellow: "#fbc02d",
        orange: "#f59e0b",
        green: "#10b981",
        gray: "#6b7280",
        red: "#ef4444",
      },
      status: {
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#4a90e2",
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ffffff",
          color: "#171717",
        },
      },
    },
  },
});

export const ThemeGlobalStyles = (
  <GlobalStyles
    styles={{
      html: {
        scrollbarColor: "#767676 #292929", // Thumb color, track color
      },
    }}
  />
);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {ThemeGlobalStyles}
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
