"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";

export default function MusicPlayer() {
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [currentTrack, setCurrentTrack] = useState<Spotify.PlayerState["track_window"]["current_track"] | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Beatplay Web Player",
                getOAuthToken: (cb: (token: string) => void) => cb(token),
                volume: 0.5,
            });

            setPlayer(player);

            player.addListener("ready", ({ device_id }: { device_id: string }) => {
                console.log("Player pronto com ID:", device_id);
                setDeviceId(device_id);

                if (deviceId) {
                    console.log("Spotify conectado ao device:", deviceId);
                }
            });

            player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
                console.warn("Player desconectado:", device_id);
            });

            player.addListener("player_state_changed", (state: Spotify.PlayerState | null) => {
                if (!state) return;
                setIsPaused(state.paused);
                setCurrentTrack(state.track_window.current_track);
            });

            player.connect();
        };

        return () => {
            player?.disconnect();
        };
    }, [token]);

    const handlePlayPause = async () => {
        if (!player) return;
        const state = await player.getCurrentState();
        if (!state) return;

        if (state.paused) {
            await player.resume();
        } else {
            await player.pause();
        }
    };

    const handleNext = async () => player?.nextTrack();
    const handlePrevious = async () => player?.previousTrack();

    const playTrackOnDevice = async (trackUri: string) => {
        if (!token || !deviceId) return;

        await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uris: [trackUri] }),
            }
        );
    };

    if (!currentTrack) return null;

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-neutral-900 text-white flex items-center justify-between px-4 py-2 border-t border-neutral-800 z-50">
            {/* Capa e informações */}
            <div className="flex items-center gap-3">
                {currentTrack.album?.images?.[0]?.url && (
                    <Image
                        src={currentTrack.album?.images?.[0]?.url || "/placeholder.png"}
                        alt={currentTrack.name}
                        width={64}
                        height={64}
                        priority
                    />
                )}
                <div>
                    <p className="font-semibold">{currentTrack.name}</p>
                    <p className="text-sm text-neutral-400">
                        {currentTrack.artists?.map((a) => a.name).join(", ")}
                    </p>
                </div>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-4">
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
        </footer>
    );
}