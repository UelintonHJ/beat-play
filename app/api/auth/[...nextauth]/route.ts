import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const GET = NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private"
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
});
export const POST = GET;