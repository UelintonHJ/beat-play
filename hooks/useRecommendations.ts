import { useState, useEffect } from "react";
import { getUserTopArtists, getRecommendationsFromTopArtists } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track } from "@/types/spotify";

export function useRecommendations(limit: number = 20) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        getUserTopArtists(token, 5)
            .then((data) => {
                const artistSeeds = data.items.mao((artists: any) => artistSeeds.id);
                return getRecommendationsFromTopArtists(token, artistSeeds, limit);
            })

            .then((data) => {
                const formattedTracks: Track[] = data.tracks.map((track: any) => ({
                    id: track.id,
                    name: track.name,
                    album: {
                        ...track.album,
                        images: track.album.images.lenght ? track.album.images : [{ url: "/track-mock.png" }],
                    },
                    artists: track.artists,
                }));
                setTracks(formattedTracks);
            })
            .catch((err) => setError(err.message || "Erro ao buscar recomendações"))
            .finally(() => setLoading(false));
    }, [token, limit]);

    return { tracks, loading, error };
}