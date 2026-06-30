import type { Metadata } from "next";
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
