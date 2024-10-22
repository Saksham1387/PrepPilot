import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@repo/db/client";
import type { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";

export const authOptions = {
  // adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  pages: {
    signIn: "/auth",
  },
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async jwt({ token, user }: any) {
      // If the user is authenticated, check if they exist in the database
      if (user) {
        const existingUser = await db.user.findUnique({
          where: { id: user.id },
        });

        // If the user doesn't exist, create a new one
        // if (!existingUser) {
        //   await db.user.create({
        //     data: {
        //       id: user.id,
        //       email: user.email,
        //       name: user.name,
        //     },
        //   });
        // }

        if (!existingUser) {
          await db.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name,
              // Create associated Credits
              credits: {
                create: {
                  id: user.id, // Use the user's ID or a new unique ID for the Credits record
                  currentMinutes: 0,
                  usedMinutes: 0,
                  totalMinutes: 0,
                  totalAmountPaid: 0,
                },
              },
            },
          });
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      const user = await db.user.findUnique({
        where: {
          id: token.sub,
        },
      });
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

interface RateLimiter {
  timestamps: Date[];
}
const userRateLimits = new Map<string, RateLimiter>();

export const rateLimit = (userId: string, rateLimitCount: number, rateLimitInterval: number): boolean => {
  const now = new Date();
  const userLimiter = userRateLimits.get(userId) ?? { timestamps: [] };

  userLimiter.timestamps = userLimiter.timestamps.filter(
    (timestamp) => now.getTime() - timestamp.getTime() < rateLimitInterval
  );

  if (userLimiter.timestamps.length >= rateLimitCount) {
    return false; // Rate limit exceeded
  }

  userLimiter.timestamps.push(now);
  userRateLimits.set(userId, userLimiter);
  return true;
};