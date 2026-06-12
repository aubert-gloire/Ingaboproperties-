import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ingabo Properties — Rwanda Real Estate",
  description: "Your trusted partner in Rwanda real estate. Browse apartments, houses, land, and commercial properties across all districts.",
  keywords: ["real estate Rwanda", "apartments Kigali", "land for sale Rwanda", "houses Rwanda", "Ingabo Properties"],
  openGraph: {
    title: "Ingabo Properties",
    description: "Your trusted partner in Rwanda real estate",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
