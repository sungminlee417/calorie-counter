import type { Metadata } from "next";

import Navigation from "@/components/ui/Navigation";

export const metadata: Metadata = {
  title: "Dashboard | Calorie Counter",
  description:
    "Track your daily calories, log foods, and monitor your macro goals from one clean dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
