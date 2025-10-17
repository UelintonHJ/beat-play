"use client";

import { Track } from "@/types/spotify"
import { createContext, ReactNode, useState, useContext } from "react";

interface PlayerContextType {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track) => void;
    playTrack: (trackId: string) => void;
    playBeatplayTrack: (trackId: string) => void;
    deviceId: string | null;
    token: string | null;
    sdkReady: boolean;
    setDevice: (deviceId: string, token: string) => void;
    setSdkReady: (ready: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType>({
    currentTrack: null,
    setCurrentTrack: () => {},
    playTrack: () => {},
    playBeatplayTrack: () => {},
    deviceId: null,
    token: null,
    sdkReady: false,
    setDevice: () => {},
    setSdkReady: () => {},
});

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [sdkReady, setSdkReady] = useState(false);

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

    const playBeatplayTrack = async (trackId: string) => {
        if (!token || !deviceId || !sdkReady) {
            console.warn("SDK não está pronto ainda");
            return;
        }
        await playTrack(trackId)
    }

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                setCurrentTrack,
                playTrack,
                playBeatplayTrack,
                deviceId,
                token,
                sdkReady,
                setDevice,
                setSdkReady,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);