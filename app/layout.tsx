import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway, Geist_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${cormorant.variable} ${raleway.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
