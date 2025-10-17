"use client";

import { Track } from "@/types/spotify"
import { createContext, ReactNode, useState, useContext } from "react";

interface PlayerContextType {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track) => void;
    playTrack: (trackId: string) => void;
    deviceId: string | null;
    token: string | null;
    setDevice: (deviceId: string, token: string) => void;
}

const PlayerContext = createContext<PlayerContextType>({
    currentTrack: null,
    setCurrentTrack: () => { },
    playTrack: () => { },
    deviceId: null,
    token: null,
    setDevice: () => { },
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
        if (!token || !deviceId) return;

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
        <PlayerContext.Provider
            value={{
                currentTrack,
                setCurrentTrack,
                playTrack,
                deviceId,
                token,
                setDevice,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);