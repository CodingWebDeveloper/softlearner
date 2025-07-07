import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";
import { SupabaseProvider } from "../contexts/SupabaseContext";
import ClientOnly from "../components/ClientOnly";
import Layout from "../components/Layout";
import LoadingFallback from "../components/LoadingFallback";
import StoreProvider from "./StoreProvider";

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
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientOnly
          fallback={<LoadingFallback />}
        >
          <StoreProvider>
            <SupabaseProvider>
              <ThemeRegistry>
                <Layout>
                  {children}
                </Layout>
              </ThemeRegistry>
            </SupabaseProvider>
          </StoreProvider>
        </ClientOnly>
      </body>
    </html>

  );
}
