import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

import bcrypt from "bcryptjs";

import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { schema } from "./schema";
import { use } from "react";

const adapter = PrismaAdapter(prisma);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials);

        const user = await prisma.user.findFirst({
          where: {
            email: validatedCredentials.email,
          },
        });

        const verifyPassword = await bcrypt.compare(
          validatedCredentials.password,
          user.password
        );

        if (user && verifyPassword && user.isActivated) {
          return user;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user = token;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token = user;
      }
      return token;
    },
  },
});
