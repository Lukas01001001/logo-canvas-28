// types/next-auth.d.ts

//import NextAuth, { DefaultSession } from "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // always a string, because NextAuth returns that (even if you have an int in the DB)
      role?: string;
    } & DefaultSession["user"];
  }
}
