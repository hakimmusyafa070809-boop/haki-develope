import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const arabic = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SANTRIVEST — Learn. Manage. Invest. Grow.",
  description:
    "Premium interactive Islamic financial literacy & Sharia investment education platform for santri of MAS Husnul Khotimah. Supporting SDG No. 8.",
  keywords: [
    "Santrivest",
    "Islamic finance",
    "Sharia investment",
    "financial literacy",
    "santri",
    "MAS Husnul Khotimah",
    "SDG 8",
  ],
  authors: [{ name: "SANTRIVEST" }],
  openGraph: {
    title: "SANTRIVEST — Learn. Manage. Invest. Grow.",
    description:
      "Interactive Islamic financial literacy & Sharia investment education platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${arabic.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
