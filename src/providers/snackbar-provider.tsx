"use client";

import { ReactNode } from "react";
import { SnackbarProvider as NotistackProvider } from "notistack";

interface SnackbarProviderProps {
  children: ReactNode;
}

export default function SnackbarProvider({ children }: SnackbarProviderProps) {
  return (
    <NotistackProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {children}
    </NotistackProvider>
  );
}
