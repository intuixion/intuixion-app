import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "intuixion.ai — SA law, made intuitive",
  description: "Ask any question about SA law or regulation. Get a cited answer in under 3 seconds. 30 Acts, 18,125 passages, always sourced.",
  openGraph: {
    title: "intuixion.ai — SA law, made intuitive",
    description: "Ask any question about SA law or regulation. Get a cited answer in under 3 seconds.",
    url: "https://intuixion.ai",
    siteName: "intuixion.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "intuixion.ai — SA law, made intuitive",
    description: "Ask any question about SA law or regulation. Get a cited answer in under 3 seconds.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="h-full antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
