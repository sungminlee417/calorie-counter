import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const redirectIfAuthenticated = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
};

export const requireAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return session;
};
