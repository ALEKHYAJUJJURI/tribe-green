

import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.FRONTEND_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Tribe Green | Thoughtful Corporate Gifting",
  description:
    "Discover thoughtful corporate gifts, employee welcome kits, festive hampers and branded merchandise for every occasion.",
  openGraph: {
    title: "Tribe Green | Thoughtful Corporate Gifting",
    description:
      "Make every corporate occasion memorable with thoughtfully curated gifts.",
    images: ["/og-image.png"],
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}