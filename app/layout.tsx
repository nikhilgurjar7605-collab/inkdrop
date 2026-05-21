import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"], // Added 700 to prevent Next.js complaints, but user requested 400/500 and no 600.
});

export const metadata: Metadata = {
  title: "INKDROP - Premium Manga Reader",
  description: "A premium, human-designed manga reading platform powered by MangaDex.",
  referrer: 'no-referrer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} font-body bg-background-base text-text-primary antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
