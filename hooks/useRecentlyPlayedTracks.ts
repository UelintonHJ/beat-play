import { useState, useEffect } from "react";
import { getRecentlyPlayedTracks } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track } from "@/types/spotify";
import Spotify from "next-auth/providers/spotify";

export function useRecentlyPlayedTracks(limit: number = 10) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        getRecentlyPlayedTracks(token, limit)
            .then((data) => {
                const formattedTracks: Track[] = data.items.map((item: any) => ({
                    id: item.track.id,
                    name: item.track.name,
                    album: {
                        ...item.track.album,
                        images: item.track.album.images.length
                            ? item.track.album.images
                            : [{ url: "/track-mock.png" }],
                    },
                    artists: item.track.artists.map((a:any) => ({
                        id: a.id || a.name,
                        name: a.name,
                        image: a.image?.[0]?.url || "",
                        spotifyUrl: a.external_urls?.spotify || "",
                    })),
                }));
                setTracks(formattedTracks);
            })
            .catch((err) => setError(err.message || "Erro ao buscar últimas faixas."))
            .finally(() => setLoading(false));
    }, [token, limit]);
    return { tracks, loading, error };
}