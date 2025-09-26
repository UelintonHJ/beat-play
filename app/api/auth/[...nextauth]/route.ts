import NextAuth, { NextAuthOptions, JWT } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

interface ExtendedJWT extends JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
}

async function refreshAccessToken(token: ExtendedJWT) {
    try {
        const response = await fetch ("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
                ).toString("base64")}`,
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken!,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) throw refreshedTokens;

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("Erro ao atualizar token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,playlist-read-private,playlist-read-collaborative,user-top-read,user-read-playback-state,user-read-currently-playing,ugc-image-upload"
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            const t = token as ExtendedJWT;

            if (account) {
                t.accessToken = account.access_token;
                t.refreshToken = account.refresh_token;
                t.accessTokenExpires = Date.now() + account.expires_in * 1000;
            }
    
            if (Date.now() < (t.accessTokenExpires ?? 0)) {
                return t;
            }

            return await refreshAccessToken(t);
        },
        async session ({ session, token }) {
            const t = token as ExtendedJWT;
            return {
                ...session,
                accessToken: t.accessToken,
                error: t.error,
            };
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };