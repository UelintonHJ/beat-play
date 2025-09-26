import { useSession } from "next-auth/react";

export const useSpotifyToken = () => {
    const { data: session } = useSession();

    return session?.accessToken ?? null;
};