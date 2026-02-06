import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    guilds?: any[];
    error?: string;
    masterLoginVerified?: boolean;
    user?: {
      id?: string;
      username?: string;
    } & DefaultSession['user'];
  }
}