"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { SpotifyTrackAPI, Track, Artist } from "@/types/spotify";

export default function MusicPlayer() {
    const { data: session } = useSession();
    const { currentTrack, setCurrentTrack } = usePlayer();
    const token = session?.accessToken as string | undefined;

    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [track, setTrack] = useState<SpotifyTrackAPI | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const mapToAppTrack = (sdkTrack: {
        id?: string;
        name?: string;
        album?: { 
            id?: string; 
            name?: string; 
            images?: { url: string }[]; 
            external_urls?: any 
        };
        artists?: { 
            id?: string; 
            name: string; 
            external_urls?: any; 
            images?: any[]
        }[]; 
        external_urls?: any;
    }): Track => {
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
                id: sdkTrack.album?.id,
                name: sdkTrack.album?.name,
                images: (sdkTrack.album?.images ?? []).map((img) => ({ url: img.url })),
            },
            artists,
        };
    };

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
                    setTrack(data.item as SpotifyTrackAPI);
                    setIsPaused(!data.is_playing);
                    setProgress(data.progress_ms ?? 0);
                    setDuration((data.item as any).duration_ms ?? 0);
                    
                    try {
                        const mapped = mapToAppTrack(data.item);
                        setCurrentTrack(mapped);
                    } catch {

                    }
                }
            } catch (err) {
                console.error("Erro ao buscar música atual", err);
            }
        };

        fetchCurrentTrack();
        const interval = setInterval(fetchCurrentTrack, 5000);
        return () => clearInterval(interval);
    }, [token, setCurrentTrack]);

    useEffect(() => {
        if (!token) return;

        window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new window.Spotify.Player({
                name: "Beatplay Web Player",
                getOAuthToken: (cb: (token: string) => void) => cb(token),
                volume: 0.5,
            });

            playerInstance.addListener("ready", ({ device_id }: { device_id: string }) => {
                console.log("Player pronto com ID:", device_id);
                setDeviceId(device_id);

                fetch("https://api.spotify.com/v1/me/player", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ device_ids: [device_id], play: false }),
                }).then(() => console.log("Dispositivo ativado com sucesso"));
            });

            playerInstance.addListener("not_ready", ({ device_id }: { device_id: string }) => {
                console.warn("Player desconectado:", device_id);
            });

            playerInstance.addListener("player_state_changed", (state: Spotify.PlayerState | null) => {
                if (!state) return;

                setIsPaused(state.paused);

                const anyState = state as unknown  as { position?: number; duration?: number };
                const pos = anyState.position ?? 0;
                const dur = anyState.duration ?? 0;

                setProgress(pos)
                if (dur) setDuration(dur);

                const sdkTrack = state.track_window?.current_track;
                if (sdkTrack) {
                    const mapped = mapToAppTrack({
                        id: (sdkTrack as any).id ?? "",
                        name: sdkTrack.name,
                        album: {
                            id: (sdkTrack as any).album?.id,
                            name: (sdkTrack as any).album?.name,
                            images: sdkTrack.album?.images ?? [],
                            external_urls: (sdkTrack as any).album?.external_urls,
                        },
                        artists: sdkTrack.artists?.map((a: any) => ({
                            id: a.id,
                            name: a.name,
                            external_urls: a.external_urls,
                            images: a.images,
                        })),
                        external_urls: (sdkTrack as any).external_urls,
                    });
                    setCurrentTrack(mapped);
                }
            });

            playerInstance.connect();
            setPlayer(playerInstance);
        };

        if (!document.getElementById("spotify-player-script")) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.id = "spotify-player-script";
            script.async = true;
            document.body.appendChild(script);
        }

        return () => {
            player?.disconnect();
        };
    }, [token, setCurrentTrack]);

    const playBeatplayTrack = async (trackId: string) => {
        if (!token || !deviceId) return;

        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
            });
            setIsPaused(false);
        } catch (err) {
            console.error("Erro ao tocar música do Beatplay:", err);
        }
    };

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
            <div className="flex items-center gap-4 w-full max-w-2xl justify-between">
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
                            {track.artists.map((artist) => artist.name).join(", ")}
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