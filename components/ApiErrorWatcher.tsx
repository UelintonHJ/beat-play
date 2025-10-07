"use client";

import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { usePathname } from "next/navigation";

export function emitApiError(message: string) {
    window.dispatchEvent(new CustomEvent("apiError", { detail: message }));
}

export default function ApiErrorWatcher() {
    const [message, setMessage] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        function handleApiError(event: Event) {
            const customEvent = event as CustomEvent<string>;
            setMessage(customEvent.detail);
        }

        window.addEventListener("apiError", handleApiError);
        return () => window.removeEventListener("apiError", handleApiError);
    }, []);

    if (!message || pathname === "/") return null;

    return (
        <div className="pointer-events-auto fixed top-0 left-0 w-full flex justify-center z-50">
            <ErrorMessage
                message="Falha na API, não possibilitando acesso a suas músicas. Aguarde ou tente novamente mais tarde."
                type="apiError"
                className="w-full text-center"
            />
        </div>
    );
}