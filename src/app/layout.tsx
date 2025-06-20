// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logo Canvas",
  description: "Manage clients and generate logo collages easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*  bg-gradient-to-br from-ebcont-fuchsia via-ebcont-turquoise to-ebcont-activviolet */}
      {/* <body
        className={`
    ${geistSans.variable} ${geistMono.variable} antialiased
    min-h-screen
    bg-ebcont-soft-gradient
    bg-fixed
  `}
      > */}
      <body
        className={`
    ${geistSans.variable} ${geistMono.variable} antialiased
    min-h-screen
    bg-white
    bg-fixed
  `}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
