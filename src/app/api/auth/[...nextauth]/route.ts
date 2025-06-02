// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { NextAuthOptions } from "next-auth";

// Typical Next.js App Router environment (Route Handlers)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      // Add userId to the session (important for client-side data retrieval)
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Add token role if any (from User model)
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
  },
  pages: {
    // You can add your own views if you want: signIn: “/login”
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
