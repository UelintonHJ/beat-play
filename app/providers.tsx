"use client"

import { PlayerProvider } from "@/context/PlayerContext";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    return (
    <SessionProvider>
        <PlayerProvider>{children}</PlayerProvider>
    </SessionProvider>
    );
}