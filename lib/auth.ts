import prisma from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          // Check existing user
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });
          if (!user) {
            return null;
          }

          // Checking if password is correct
          const validPassword = await compare(password, user.password);
          console.log("auth", validPassword);

          if (!validPassword) {
            return null;
          }

          const { password: _, ...userData } = user;

          return userData as any;
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "auth/login",
  },
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.userId = user.id;
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.userId = token.userId;
      session.user = { ...session.user, ...token };
      return session;
    },
  },
};
