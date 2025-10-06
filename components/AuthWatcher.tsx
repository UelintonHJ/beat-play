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
    const hadSessionRef = useRef<boolean>(false);
    const STORAGE_KEY = "hadValidSession_v1";

    const publicRoutes = ["/"];

    useEffect(() => {
        setMounted(true);
        try {
            hadSessionRef.current = typeof window !== "undefined" && !!sessionStorage.getItem(STORAGE_KEY);
        } catch {
            hadSessionRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (publicRoutes.includes(pathname)) {
            setAuthStatus(null);
            return;
        }

        if (status === "loading") return;

        if (status === "authenticated") {
            hadSessionRef.current = true;

            try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { }

            setAuthStatus(null);

            if (session?.expires) {
                const expirationTime = new Date(session.expires).getTime();
                const now = Date.now();
                const timeout = expirationTime - now;

                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }

                if (timeout <= 0) {
                    setAuthStatus("sessionExpired");
                } else {
                    timerRef.current = window.setTimeout(() => {
                        setAuthStatus("sessionExpired");
                    }, timeout);
                }
            }

            return;
        }

        if (status === "unauthenticated") {
            let hadBefore = hadSessionRef.current;
            try {
                if (!hadBefore) hadBefore = !!sessionStorage.getItem(STORAGE_KEY);
            } catch {}

            if (hadBefore) {
                setAuthStatus("sessionExpired");
                try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
                hadSessionRef.current = false;
            } else {
                setAuthStatus("unauthenticated");
            }

            return;
        }
    }, [status, session, pathname, mounted]);
       
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

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