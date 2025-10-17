"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { SpotifyTrackAPI, Track, Artist } from "@/types/spotify";

export default function MusicPlayer() {
    const { data: session } = useSession();
    const { currentTrack, setCurrentTrack, deviceId, token, setDevice, sdkReady, setSdkReady, } = usePlayer();
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        if (session?.accessToken && !token) {
            setDevice(deviceId ?? "", session.accessToken as string);
        }
    }, [session, token, deviceId, setDevice]);

    const mapToAppTrack = (sdkTrack: SpotifyTrackAPI): Track => {
        const artists: Artist[] = (sdkTrack.artists ?? []).map((a) => ({
            id: a.id ?? "",
            name: a.name,
            image: "",
            spotifyUrl: a.external_urls?.spotify ?? "",
        }));

        return {
            id: sdkTrack.id ?? "",
            name: sdkTrack.name ?? "",
            album: {
                id: sdkTrack.album?.id ?? "",
                name: sdkTrack.album?.name ?? "",
                images: (sdkTrack.album?.images ?? []).map((img) => ({ url: img.url })),
            },
            artists,
        };
    };

    useEffect(() => {
        if (!session?.accessToken || player) return;
        const accessToken = session.accessToken as string;

        const setupPlayer = () => {
            const playerInstance: Spotify.Player = new window.Spotify.Player({
                name: "Beatplay Web Player",
                getOAuthToken: (cb) => cb(accessToken),
                volume: 0.5,
            });

            playerInstance.addListener("ready", async ({ device_id }) => {
                console.log("Player pronto com ID:", device_id);
                setDevice(device_id, accessToken);
                setSdkReady(true);

                try {
                    await fetch("https://api.spotify.com/v1/me/player", {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            device_ids: [device_id],
                            play: false,
                        }),
                    });
                    console.log("Playback transferido para Beatplay com sucesso");
                } catch (err) {
                    console.error("Erro ao transferir playback para Beatplay:", err);
                }
            });

            playerInstance.addListener("not_ready", ({ device_id }) => {
                console.warn("Player desconhecido:", device_id);
                setSdkReady(false);
            });

            playerInstance.addListener("authentication_error", ({ message }) => {
                console.error("Erro de autenticação:", message);
            });

            playerInstance.addListener("player_state_changed", (state) => {
                if (!state) return;
                setIsPaused(state.paused);
                setProgress(state.position ?? 0);
                setDuration(state.duration ?? state.track_window?.current_track?.duration_ms ?? 0);

                const sdkTrack = state.track_window?.current_track;
                if (sdkTrack) setCurrentTrack(mapToAppTrack(sdkTrack as SpotifyTrackAPI));
            });

            playerInstance.connect().then((success) => {
                if (success) {
                    console.log("Beatplay conectado com successo ao Spotify SDK Web Playback SDK");
                } else {
                    console.error("Falha ao conectar o Beatplay ao Spotify SDK");
                }
            });
            setPlayer(playerInstance);
        };

        if (window.Spotify) setupPlayer();
        else {
            window.onSpotifyWebPlaybackSDKReady = setupPlayer;
            if (!document.getElementById("spotify-player-script")) {
                const script = document.createElement("script");
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.id = "spotify-player-script";
                script.async = true;
                document.body.appendChild(script);
            }
        }

        return () => {
            if(player) (player as Spotify.Player).disconnect();
        }
    }, [session, player, setDevice, setCurrentTrack, setSdkReady]);

    const handlePlayPause = async () => {
        if (!deviceId || !token) return;
        const endpoint = isPaused
            ? `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`
            : `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`;

        await fetch(endpoint, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
        setIsPaused(!isPaused);
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

    if (!currentTrack) return null;

    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-neutral-900 text-white flex items-center justify-between px-4 py-2 border-t border-neutral-800 z-50">
            {/* Capa e informações */}
            <div className="flex items-center gap-4 w-full max-w-2xl justify-between">
                <div className="flex items-center gap-3 mx-auto">
                    <Image
                        src={currentTrack.album?.images?.[0]?.url || "/placeholder.png"}
                        alt={currentTrack.name}
                        width={78}
                        height={78}
                        priority
                        className="rounded-md"
                    />
                    <div>
                        <p className="font-semibold">{currentTrack.name}</p>
                        <p className="text-sm text-neutral-400">
                            {currentTrack.artists.map((artist) => artist.name).join(", ")}
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
                <div className="bg-green-500 h-1 transition-all duration-300" style={{ width: `${progressPercent}%` }}>
                </div>
            </div>
        </footer>
    );
}