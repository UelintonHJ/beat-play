"use client";

import { Track } from "@/types/spotify"
import { createContext, ReactNode, useState, useContext, useEffect } from "react";

interface PlayerContextType {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track) => void;
    playTrack: (trackId: string) => void;
    playBeatplayTrack: (url: string, track: Track) => void;
    pauseBeatplay: () => void;
    setDevice: (deviceId: string, token: string) => void;
    deviceId: string | null;
    token: string | null;
    isBeatplayPlaying: boolean;
}

const PlayerContext = createContext<PlayerContextType>({
    currentTrack: null,
    setCurrentTrack: () => { },
    playTrack: () => { },
    playBeatplayTrack: () => { },
    pauseBeatplay: () => { },
    setDevice: () => { },
    deviceId: null,
    token: null,
    isBeatplayPlaying: false,
});

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [beatplayAudio, setBeatPlayAudio] = useState<HTMLAudioElement | null>(null);
    const [isBeatplayPlaying, setIsBeatplayPlaying] = useState(false);

    const setDevice = (device: string, token: string) => {
        setDeviceId(device);
        setToken(token);
    };

    const pauseBeatplay = () => {
        if (beatplayAudio) {
            beatplayAudio.pause();
            setIsBeatplayPlaying(false);
        }
    };

    const playBeatplayTrack = (url: string, track: Track) => {
        if (!url) return;

        if (deviceId && token) {
            fetch(`https://api.spotify.com/v1/me/player/pause`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).catch(() => { });
        }

        if (!beatplayAudio) return;

        beatplayAudio.src = url;
        beatplayAudio
            .play()
            .then(() => {
                setCurrentTrack(track);
                setIsBeatplayPlaying(true);
            })
            .catch((err) => {
                console.warn("Erro ao iniciar Beatplay:", err);
            });

        beatplayAudio.onended = () => setIsBeatplayPlaying(false);
    };

    const playTrack = async (trackId: string) => {
        if (!token || !deviceId) return;

        if (isBeatplayPlaying) pauseBeatplay();

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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const audio = new Audio();
            audio.preload = "auto";
            setBeatPlayAudio(audio);
        }
    }, []);

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                setCurrentTrack,
                playTrack,
                playBeatplayTrack,
                pauseBeatplay,
                setDevice,
                deviceId,
                token,
                isBeatplayPlaying
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);