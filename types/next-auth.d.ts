import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    guilds?: any[];
    user?: {
      id?: string;
    } & DefaultSession['user'];
  }
}