// app/api/auth/[...nextauth]/route.ts
import { User } from "@calorie-counter/sequelize";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await User.findOne({
          where: {
            email: credentials?.email,
            password: credentials?.password,
          },
        });

        if (user) {
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
};

// Pass the config to NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
