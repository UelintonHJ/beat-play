"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useSpotifyToken = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const token = session?.accessToken ?? null;

    useEffect(() => {
        if(status === "unauthenticated" || !token) {
            router.replace("/");
        }
    }, [status, token, router]);

    return token;
};

