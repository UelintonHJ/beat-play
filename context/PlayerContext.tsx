"use client";

import { Track } from "@/types/spotify"
import { createContext, ReactNode, useState, useContext } from "react";

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
        console.log("Dispositivo definido:", device);
        setDeviceId(device);
        setToken(token);
    };

    const ensurePlayerActive = async () => {
        if (!deviceId || !token) return false;
        try {
            const res = await fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ device_ids: [deviceId], play: false }),
            });

            if (!res.ok) {
                console.error("Falha ao ativar player:", await res.text());
                return false;
            }

            console.log("Player ativado no Spotify");
            return true;
        } catch (err) {
            console.error("Erro ao ativar player:", err);
            return false;
        }
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

        await ensurePlayerActive();

        try {
            const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
            });

            if (!res.ok) {
                console.log("Erro ao tocar música:", res.status, await res.text());
                return;
            }

            if (res.status === 403) {
                console.error("O token não tem permissão 'streaming'.");
            } else {
                console.log("Tocando música com sucesso!");
            }
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