"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";

export default function NetworkWatcher() {
    const isOnline = useNetworkStatus();
    const [showOnlineMessage, setShowOnlineMessage] = useState(false);

    useEffect(() => {
        if (isOnline) {
            setShowOnlineMessage(true);
            const timer = setTimeout(() => setShowOnlineMessage(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOnline]);

    return (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50">
            {!isOnline && (
                <ErrorMessage
                    message="Você está offline. Algumas informações podem não estar disponíveis."
                    type="offline"
                    className="w-full text-center"
                />
            )}

            {isOnline && showOnlineMessage && (
                <ErrorMessage
                    message="Conexão restabelecida."
                    type="online"
                    className="w-full text-center"
                />
            )}
        </div>
    );
}

