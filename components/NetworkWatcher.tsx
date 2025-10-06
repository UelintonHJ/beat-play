"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useEffect, useRef, useState } from "react";
import ErrorMessage from "./ErrorMessage";

export default function NetworkWatcher() {
    const isOnline = useNetworkStatus();
    const [showOnlineMessage, setShowOnlineMessage] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const seenOfflineRef = useRef(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isOnline) {
            seenOfflineRef.current = true;
            setShowOnlineMessage(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        if (isOnline && seenOfflineRef.current) {
            setShowOnlineMessage(true);
        

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
            setShowOnlineMessage(false);
            timerRef.current = null;
        }, 5000);

        seenOfflineRef.current = false;
    }

    return () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
}, [isOnline, mounted]);

if (!mounted) return null;

    return (
        <div className="pointer-events-auto fixed top-0 left-0 w-full flex justify-center z-50">
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

