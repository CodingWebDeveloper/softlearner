import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../providers/theme-provider";
import { SupabaseProvider } from "../contexts/supabase-context";
import ClientOnly from "@/components/client-only";
import LoadingFallback from "../components/loading-fallback";
import StoreProvider from "../providers/store-provider";
import TrpcProvider from "../providers/trpc-provider";
import LayoutWrapper from "@/components/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Softlearner",
  description: "Softlearner is a learning platform ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientOnly fallback={<LoadingFallback />}>
          <StoreProvider>
            <TrpcProvider>
              <SupabaseProvider>
                <ThemeRegistry>
                  <LayoutWrapper>{children}</LayoutWrapper>
                </ThemeRegistry>
              </SupabaseProvider>
            </TrpcProvider>
          </StoreProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
