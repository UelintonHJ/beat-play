"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { SpotifyTrackAPI } from "@/types/spotify";

export default function MusicPlayer() {
    const { data: session } = useSession();
    const { currentTrack } = usePlayer();
    const token = session?.accessToken as string | undefined;
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [track, setTrack] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!token) return;

        const fetchCurrentTrack = async () => {
            try {
                const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 204) {
                    setTrack(null);
                    return;
                }

                const data = await res.json();

                if (data && data.item) {
                    setTrack(data.item);
                    setIsPaused(!data.is_playing);
                    setProgress(data.progress_ms);
                    setDuration(data.item.duration_ms);

                }
            } catch (err) {
                console.error("Erro ao buscar música atual", err);
            }
        };

        fetchCurrentTrack();
        const interval = setInterval(fetchCurrentTrack, 5000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (!token) return;

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Beatplay Web Player",
                getOAuthToken: (cb: (token: string) => void) => cb(token),
                volume: 0.5,
            });

            player.addListener("ready", ({ device_id }: { device_id: string }) => {
                console.log("Player pronto com ID:", device_id);
                setDeviceId(device_id);
            });

            player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
                console.warn("Player desconectado:", device_id);
            });

            player.addListener("player_state_changed", (state: Spotify.PlayerState | null) => {
                if (!state) return;
                setIsPaused(state.paused);
            });

            player.connect();
            setPlayer(player);
        };

        if (!document.getElementById("spotify-player-script")) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.id = "spotify-player-script";
            script.async = true;
            document.body.appendChild(script);
        }
    }, [token]);

    const handlePlayPause = async () => {
        if (!token) return;
        const endpoint = isPaused
            ? "https://api.spotify.com/v1/me/player/play"
            : "https://api.spotify.com/v1/me/player/pause";

        try {
            await fetch(endpoint, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            setIsPaused(!isPaused);
        } catch (err) {
            console.error("Error ao pausar/tocar:", err);
        }
    };

    const handleNext = async () => {
        if (!token) return;
        await fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    const handlePrevious = async () => {
        if (!token) return;
        await fetch("https://api.spotify.com/v1/me/player/previous", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    if (!track) return null;

    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-neutral-900 text-white flex items-center justify-between px-4 py-2 border-t border-neutral-800 z-50">
            {/* Capa e informações */}
            <div className="flex items-center gap-4 2-full max-w-2xl justify-between">
                <div className="flex items-center gap-3 mx-auto">
                    <Image
                        src={track.album?.images?.[0]?.url || "/placeholder.png"}
                        alt={track.name}
                        width={78}
                        height={78}
                        priority
                        className="rounded-md"
                    />
                    <div>
                        <p className="font-semibold">{track.name}</p>
                        <p className="text-sm text-neutral-400">
                            {track.artists}
                        </p>
                    </div>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-4 mx-auto">
                    <button onClick={handlePrevious}>
                        <SkipBack size={20} />
                    </button>
                    <button
                        onClick={handlePlayPause}
                        className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                    >
                        {isPaused ? <Play size={18} /> : <Pause size={18} />}
                    </button>
                    <button onClick={handleNext}>
                        <SkipForward size={20} />
                    </button>
                </div>
            </div>

            {/* Barra de progresso */}
            <div className="absolute bottom-0 left-0 w-full bg-neutral-800 h-1">
                <div className="bg-green-500 h-1 transition-all duration-300" style={{ width: `width: ${progressPercent}%` }}>
                </div>
            </div>
        </footer>
    );
}