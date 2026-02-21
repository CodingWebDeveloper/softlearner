"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Create a cache for emotion
const cache = createCache({
  key: "css",
  prepend: true,
});

// Extend the theme interface to include custom colors
declare module "@mui/material/styles" {
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

export type ThemeMode = "dark" | "light";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4a90e2",
    },
    secondary: {
      main: "#4ecdc4",
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
          backgroundColor: "#1a1b23",
          color: "#b0b3b8",
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4a90e2",
    },
    secondary: {
      main: "#4ecdc4",
    },
    custom: {
      background: {
        dark: "#f5f5f7",
        secondary: "#ffffff",
        tertiary: "#e8e8ed",
        card: "#ffffff",
        filter: "#e0e0e0",
      },
      text: {
        light: "#555770",
        white: "#1a1b23",
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
          backgroundColor: "#f5f5f7",
          color: "#555770",
        },
      },
    },
  },
});

const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggleMode: () => void;
} | null>(null);

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return ctx;
}

const getThemeGlobalStyles = (mode: ThemeMode) => (
  <GlobalStyles
    styles={{
      html: {
        scrollbarColor: mode === "dark" ? "#767676 #292929" : "#aaaaaa #e0e0e0",
      },
    }}
  />
);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    // Only run on client; best-effort read from localStorage
    try {
      const saved = localStorage.getItem("themeMode");
      if (saved === "dark" || saved === "light") {
        setMode(saved);
      }
    } catch {
      // ignore localStorage errors and fall back to default
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("themeMode", mode);
    } catch {
      // ignore write errors
    }
  }, [mode]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-color-mode", mode);
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const theme = useMemo(() => {
    return mode === "dark" ? darkTheme : lightTheme;
  }, [mode]);

  const ctxValue = useMemo(() => {
    return { mode, toggleMode };
  }, [mode, toggleMode]);

  return (
    <CacheProvider value={cache}>
      <ThemeModeContext.Provider value={ctxValue}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {getThemeGlobalStyles(mode)}
          {children}
        </MuiThemeProvider>
      </ThemeModeContext.Provider>
    </CacheProvider>
  );
}
