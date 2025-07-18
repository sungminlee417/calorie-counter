import type { Metadata } from "next";

import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calorie Counter | Track Macros & Meals",
  description:
    "Easily log your meals, monitor your calories and macros, and reach your nutrition goals with this minimalist calorie tracker app.",
  keywords: [
    "calorie tracker",
    "macro tracker",
    "nutrition app",
    "meal logging",
    "health dashboard",
  ],
  authors: [{ name: "Sungmin Lee" }],
  creator: "Sungmin Lee",
  metadataBase: new URL("https://calorie-counter-teal.vercel.app"),
  openGraph: {
    title: "Calorie Counter",
    description:
      "Track your calories and macros with a clean, interactive dashboard.",
    url: "https://calorie-counter-teal.vercel.app",
    siteName: "Calorie Counter",
    images: [
      {
        url: "https://calorie-counter-teal.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Calorie Counter App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calorie Counter",
    description:
      "Track your calories and macros with a clean, interactive dashboard.",
    images: ["https://calorie-counter-teal.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
