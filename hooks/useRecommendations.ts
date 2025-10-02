import { useState, useEffect } from "react";
import { getPersonalizedRecommendations } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track, SpotifyTrackAPI } from "@/types/spotify";

export function useRecommendations(limit: number = 20) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        getPersonalizedRecommendations(token, limit)
            .then((data: { tracks: SpotifyTrackAPI[] }) => {
                const formattedTracks: Track[] = data.tracks.map((track: SpotifyTrackAPI) => ({
                    id: track.id,
                    name: track.name,
                    album: {
                        images: track.album.images,
                    },
                    artists: track.artists.map((artist) => ({ 
                        id: artist.id,
                        name: artist.name, 
                        image: artist.images?.[0].url || "/artist-mock.png",
                        spotifyUrl: artist.external_urls?.spotify || "",
                    })),
                        preview_url: track.preview_url,
                }));
                setTracks(formattedTracks);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar recomendações:", err);
                setError(err.message || "Erro ao buscar recomendações");
            })
            .finally(() => setLoading(false));
    }, [token, limit]);
    return { tracks, loading, error };
}