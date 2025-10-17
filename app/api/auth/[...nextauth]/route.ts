import NextAuth, { NextAuthOptions, JWT } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

interface ExtendedJWT extends JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    [key: string]: unknown;
}

async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
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
            authorization: {
                params: {
                    scope: "user-read-email user-read-private user-read-recently-played playlist-read-private playlist-read-collaborative user-top-read user-read-playback-state user-read-currently-playing ugc-image-upload user-library-read streaming user-modify-playback-state",
                    show_dialog: "true",
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, account }): Promise<ExtendedJWT> {
            const t = token as ExtendedJWT;

            if (account) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: Date.now() + Number(account.expires_in ?? 0) * 1000,
                };
            }

            if (t.accessTokenExpires && Date.now() < t.accessTokenExpires - 60 * 1000) {
                return t;
            }

            return await refreshAccessToken(t);
        },
        async session({ session, token }) {
            const t = token as ExtendedJWT;
            return {
                ...session,
                accessToken: t.accessToken,
                error: t.error,
            };
        },
        async redirect({ url, baseUrl }) {

            if (url.includes('signOut')) {
                return baseUrl;
            }

            return baseUrl + "/dashboard";
        }
    },
    pages: {
        signIn: '/',
        signOut: '/',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };