import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/get-user";
import Navigation from "@/components/ui/Navigation";

export const metadata: Metadata = {
  title: "Dashboard | Calorie Counter",
  description:
    "Track your daily calories, log foods, and monitor your macro goals from one clean dashboard.",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This will redirect to login if not authenticated
  await requireAuth();

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
