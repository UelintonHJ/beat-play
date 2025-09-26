import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: any) {
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
                refresh_token: token.refreshToken as string,
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
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = Date.now() + account.expires_in * 1000;
            }
    
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            return await refreshAccessToken(token);
        },
        async session ({ session, token }) {
            return {
                ...session,
                accessToken: token.accessToken,
                error: token.error,
            };
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };