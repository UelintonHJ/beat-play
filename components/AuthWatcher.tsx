"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";

export default function AuthWatcher() {
    const { data: session, status } = useSession();
    const [authStatus, setAuthStatus] = useState<"unauthenticated" | "sessionExpired" | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            setAuthStatus("unauthenticated");
        } else if (status === "authenticated") {
            setAuthStatus(null);
        }
    }, [status]);

    useEffect(() => {
        if (status === "authenticated" && session?.expires) {
            const expirationTime = new Date(session.expires).getTime();
            const now = Date.now();
            const timeout = expirationTime - now;

            if (timeout > 0) {
                const timer = setTimeout(() => {
                    setAuthStatus("sessionExpired");
                }, timeout);
                return () => clearTimeout(timer);
            }
        }
    }, [session, status]);

    if (!authStatus) return null;

    const getMessage = () => {
        switch (authStatus) {
            case "unauthenticated":
                return "Você precisa estar logado para acessar suas músicas.";
            case "sessionExpired":
                return "Sua sessão expirou. Faça login novamente para continuar."
            default:
                return "";
        }
    };

    return (
        <div>
            <ErrorMessage
                message={getMessage()}
                type={authStatus}
                className="w-full text-center"
            />
        </div>
    );
}