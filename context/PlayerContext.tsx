"use client";

import { Track } from "@/types/spotify"
import { createContext, ReactNode, useState, useContext, useEffect } from "react";

interface PlayerContextType {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track) => void;
    playTrack: (trackId: string) => void;
    setDevice: (deviceId: string, token: string) => void;
    deviceId: string | null;
    token: string | null;
}

const PlayerContext = createContext<PlayerContextType>({
    currentTrack: null,
    setCurrentTrack: () => {},
    playTrack: () => {},
    setDevice: () => {},
    deviceId: null,
    token: null,
});

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const setDevice = (device: string, token: string) => {
        setDeviceId(device);
        setToken(token);
    };

    const playTrack = async (trackId: string) => {
        if (!token) {
            console.warn("Token não definido ainda");
            return;
        }

        let retries = 0;
        while (!deviceId && retries < 10) {
            console.log("Aguardando player ser inicializado...");
            await new Promise((res) => setTimeout(res, 500));
            retries++;
        }

        if(!deviceId) {
            console.error("Player não foi inicializado a tempo.");
            return;
        }

        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
            });
        } catch (err) {
            console.error("Error ao tocar música:", err);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, playTrack, setDevice, deviceId, token }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);