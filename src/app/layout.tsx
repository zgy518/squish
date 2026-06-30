import type { Metadata } from "next";
import { GoogleAnalytics } from "@/lib/analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Squish — Free Online Image Compressor",
  description:
    "Compress JPG, PNG, and WebP images right in your browser. Nothing is uploaded — your files stay 100% private. Free to use, no signup required.",
  keywords: ["image compressor", "compress jpg", "compress png", "free image compression", "online image optimizer"],
  openGraph: {
    title: "Squish — Free Online Image Compressor",
    description: "Compress images right in your browser. 100% private, no uploads.",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Squish",
              description:
                "Free online image compressor. Compress JPG, PNG, and WebP images right in your browser.",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              url: "https://zgy518.github.io/squish/",
            }),
          }}
        />
      </head>
      <body className="min-h-full">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
