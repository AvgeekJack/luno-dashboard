import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify guilds',
          prompt: 'none', // This helps with token refresh
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.userId = account.providerAccountId;
      }
      if (profile && typeof profile === 'object' && 'username' in profile) {
        token.userName = (profile as any).username as string;
      }
      
      // Check if token is expired and needs refresh
      if (token.expiresAt && Date.now() >= (token.expiresAt as number) * 1000) {
        console.log('Token expired, needs refresh');
        // Token expired - user needs to re-authenticate
        return { ...token, error: 'TokenExpired' };
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      if (session.user) {
        session.user.id = (token as any).userId || token.sub;
        if (!(session.user as any).name && (token as any).userName) {
          session.user.name = (token as any).userName;
        }
      }
      return session;
    },
  },
};