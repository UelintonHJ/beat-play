"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { SpotifyTrackAPI, Track, Artist } from "@/types/spotify";

export default function MusicPlayer() {
    const { data: session } = useSession();
    const { setCurrentTrack, setDevice, playTrack } = usePlayer();
    const token = session?.accessToken as string | undefined;

    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [track, setTrack] = useState<SpotifyTrackAPI | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

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
        if (!token) return;

        const fetchCurrentTrack = async (): Promise<void> => {
            try {
                const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 204) {
                    setTrack(null);
                    return;
                }

                const data: {
                    is_playing: boolean;
                    progress_ms: number;
                    item: SpotifyTrackAPI & { duration_ms: number };
                } = await res.json();

                if (data && data.item) {
                    setTrack(data.item);
                    setIsPaused(!data.is_playing);
                    setProgress(data.progress_ms ?? 0);
                    setDuration(data.item.duration_ms ?? 0);
                    setCurrentTrack(mapToAppTrack(data.item));
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

        const setupPlayer = (): void => {
            const playerInstance = new window.Spotify.Player({
                name: "Beatplay Web Player",
                getOAuthToken: (cb: (token: string) => void) => cb(token),
                volume: 0.5,
            });

            playerInstance.addListener("ready", ({ device_id }: { device_id: string }) => {
                console.log("Player pronto com ID:", device_id);
                setDevice(device_id);

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

            playerInstance.addListener("player_state_changed", (state: Spotify.PlaybackState | null) => {
                if (!state) return;

                setIsPaused(state.paused);
                setProgress(state.position ?? 0);
                const currentDuration = state.duration ?? state.track_window?.current_track?.duration_ms ?? duration;
                setDuration(currentDuration);

                const sdkTrack = state.track_window?.current_track;
                if (sdkTrack) {
                    const mapped = mapToAppTrack({
                        id: sdkTrack.id,
                        name: sdkTrack.name,
                        album: {
                            id: sdkTrack.album?.uri ?? "",
                            name: sdkTrack.album?.name ?? "",
                            images: sdkTrack.album?.images ?? [],
                        },
                        artists: sdkTrack.artists ?? [],
                        external_urls: sdkTrack.external_urls,
                    } as SpotifyTrackAPI);
                    setCurrentTrack(mapped);
                }
            });

            playerInstance.connect();
            setPlayer(playerInstance);
        };

        window.onSpotifyWebPlaybackSDKReady = setupPlayer;

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
    }, [token, setCurrentTrack, duration, player]);

    const handlePlayPause = async (): Promise<void> => {
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

    const playBeatplayTrack = async (trackId: string): Promise<void> => {
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
            setIsPaused(false);
        } catch (err) {
            console.error("Erro ao tocar música do Beatplay:", err);
        }
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