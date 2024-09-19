import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export type ExtendedUser = DefaultSession["user"] & {
  isOnboarded:boolean;
}

declare module "next-auth"{
  interface Session{
    user:ExtendedUser;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    newUser:'/user/new'
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    async session({ session, user }) {
      // @ts-ignore
      session.user.isOnboarded = user.isOnboarded;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [Google],
})