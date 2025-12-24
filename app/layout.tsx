import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Petty Meter - How Petty Are You?",
  description:
    "Find out how petty you really are! Use the Petty Meter to analyze your grievances and see if you're being petty or if your concerns are legitimate. A fun, AI-powered tool to measure pettiness.",
  keywords: [
    "petty meter",
    "pettiness test",
    "grievance analyzer",
    "petty calculator",
    "am i petty",
    "petty quiz",
  ],
  authors: [{ name: "Francis" }],
  openGraph: {
    title: "Petty Meter - How Petty Are You?",
    description:
      "Analyze your grievances and discover your pettiness level with AI-powered analysis.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Petty Meter - How Petty Are You?",
    description:
      "Analyze your grievances and discover your pettiness level with AI-powered analysis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
