import { signIn, signOut } from "next-auth/react";

export const fetchLogin = async (email: string, password: string) => {
  return await signIn("credentials", {
    redirect: true,
    callbackUrl: "/dashboard",
    email,
    password,
  });
};

export const fetchLogout = () => {
  signOut({
    callbackUrl: "/login",
  });
};
