import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";
import { SupabaseProvider } from "../contexts/SupabaseContext";
import ClientOnly from "../components/ClientOnly";
import { HashLoader } from "react-spinners";
import Layout from "../components/Layout";

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
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientOnly
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#1a1b23",
              }}
            >
              <HashLoader color="#4ecdc4" size={50} />
            </div>
          }
        >
          <SupabaseProvider>
            <Layout>
              <ThemeRegistry>{children}</ThemeRegistry>
            </Layout>
          </SupabaseProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
