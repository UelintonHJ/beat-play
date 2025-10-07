"use client";

import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";

export default function ApiErrorWatcher() {
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkApiStatus = async () => {
            try {
                const res = await fetch("/api/spotify/ping");
                if (!res.ok) throw new Error("API não respondeu corretamente");

                if (isMounted) setApiError(false);
            } catch {
                if (isMounted) setApiError(true);
            }
        };

        checkApiStatus();
        const interval = setInterval(checkApiStatus, 30000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    if (!apiError) return null;

    return (
        <div className="pointer-events-auto fixed top-0 left-0 w-full flex justify-center z-50">
            <ErrorMessage
                message="Não foi possível carregar suas músicas. Aguarde ou tente novamente mais tarde."
                type="apiError"
                className="w-full text-center"
            />
        </div>
    );
}