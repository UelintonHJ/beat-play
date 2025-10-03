import { useState, useEffect } from "react";
import { getWeeklyDiscoveries } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track, SpotifyTrackAPI } from "@/types/spotify"

export function useWeeklyDiscoveries(limit: number = 20) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        getWeeklyDiscoveries(token, limit)
            .then((data) => {
                const formattedTracks: Track[] = data.tracks.map((track: SpotifyTrackAPI) => ({
                    id: track.id,
                    name: track.name,
                    album: {
                        ...track.album,
                        images: track.album.images.length
                            ? track.album.images
                            : [{ url: "/track-mock.png" }],
                    },
                    artists: track.artists.map((a) => ({
                        id: a.id,
                        name: a.name,
                        image: a.images?.[0]?.url || "/artist-mock.png",
                        spotifyUrl: a.external_urls?.spotify || "",
                    })),
                    preview_url: track.preview_url,
                }));
                setTracks(formattedTracks);
            })
            .catch((err) => setError(err.message || "Erro ao buscar descobertas da semana."))
            .finally(() => setLoading(false));
    }, [token, limit]);

    return { tracks, loading, error };
}