import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { CookieBanner } from "@/components/ui/cookie-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeSorted — Turn messy learning into sorted mastery",
  description:
    "CodeSorted is a next-gen learning platform that transforms chaos into clarity. Master coding concepts, UPSC prep, and more with structured courses, active recall, and gamified quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
