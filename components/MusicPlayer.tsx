"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";

export default function MusicPlayer() {
    const { data: session } = useSession();
    const { currentTrack } = usePlayer();
    const token = session?.accessToken as string | undefined;
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [currentSdkTrack, setCurrentSdkTrack] = useState<Spotify.PlayerState["track_window"]["current_track"] | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);

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

                fetch(`https://api.spotify.com/v1/me/player`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ device_ids: [device_id], play: false }),
                }).then(() => console.log("Dispositivo ativado com sucesso"));
            });

            player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
                console.warn("Player desconectado:", device_id);
            });

            player.addListener("player_state_changed", (state: Spotify.PlayerState | null) => {
                if (!state) return;
                setIsPaused(state.paused);
                setCurrentSdkTrack(state.track_window.current_track);
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

    useEffect(() => {
        if (!currentTrack || !token || !deviceId) return;

        const playTrack = async () => {
            try {
                console.log("Tocando:", currentTrack.name);

                await fetch(
                    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            uris: [`spotify:track:${currentTrack.id}`],
                        }),
                    });
            } catch (error) {
                console.log("Erro ao tocar a música:", error);
            }
        };

        playTrack();
    }, [currentTrack, token, deviceId]);

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