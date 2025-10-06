"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import ErrorMessage from "./ErrorMessage";
import { usePathname } from "next/navigation";

export default function AuthWatcher() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [authStatus, setAuthStatus] = useState<"unauthenticated" | "sessionExpired" | null>(null);
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef<number | null>(null);

    const publicRoutes = ["/"];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (publicRoutes.includes(pathname)) {
            setAuthStatus(null);
            return;
        }

        if (status === "loading") return;

        if (status === "unauthenticated") {
            setAuthStatus("unauthenticated");
            return;
        }

        if (status === "authenticated" && session?.expires) {
            const expirationTime = new Date(session.expires).getTime();
            const now = Date.now();

            if (expirationTime <= now) {
                setAuthStatus("sessionExpired");
                return;
            }

            const timeout = expirationTime - now;
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = window.setTimeout(() => {
                setAuthStatus("sessionExpired");
            }, timeout);

            setAuthStatus(null);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [status, session, pathname, mounted]);

if (!mounted || !authStatus) return null;

const getMessage = () => {
    switch (authStatus) {
        case "unauthenticated":
            return "Você precisa estar logado para acessar suas músicas.";
        case "sessionExpired":
            return "Sua sessão expirou. Faça login novamente para continuar.";
        default:
            return "";
    }
};

return (
    <div className="pointer-events-auto fixed top-0 left-0 w-full justify-center z-50">
        <ErrorMessage
            message={getMessage()}
            type={authStatus}
            className="w-full text-center"
        />
    </div>
);
}