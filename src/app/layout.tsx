import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vsualdigitalmedia.com"),
  title: "Visual Digital Media - Transform Your Business Growth",
  description: "We build intelligent automation systems, stunning websites, and growth engines that accelerate your business to the next level. Business automation, lead generation, and digital marketing solutions.",
  keywords: ["Visual Digital Media", "Business Automation", "Lead Generation", "Website Development", "Growth Engine", "Digital Marketing", "AI Automation", "CRM"],
  authors: [{ name: "Visual Digital Media" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Visual Digital Media - Transform Your Business Growth",
    description: "We build intelligent automation systems, stunning websites, and growth engines that accelerate your business to the next level.",
    url: "https://vsualdigitalmedia.com",
    siteName: "Visual Digital Media",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual Digital Media - Transform Your Business Growth",
    description: "We build intelligent automation systems, stunning websites, and growth engines that accelerate your business to the next level.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://link.msgsndr.com/js/external-tracking.js"
          data-tracking-id="tk_10e022fb5c9f4ebea7a518b61fa81171"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
