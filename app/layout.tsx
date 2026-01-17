import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Tajawal, Cinzel } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Soluna Events",
  description: "Where Dreams Unfold & Moments Are Wrapped",
};

import { StoreInitializer } from "@/components/StoreInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.variable} ${cinzel.variable} font-sans antialiased bg-stone-950 text-stone-100 selection:bg-amber-500/30`}
      >
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}
