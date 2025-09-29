import { useState, useEffect } from "react";
import { getTopArtists } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";

type Artist = {
    id: string;
    name: string;
    image: string;
    spotifyUrl: string;
};

export function useTopArtists(limit: number = 10) {
    const token = useSpotifyToken();    
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!token) return;

        setLoading(true);
        setError(null);

        getTopArtists(token, limit).then((data) => {
            const formattedArtists = data.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                image: item.images?.[0]?.url || "/artist-mock.png",
                spotifyUrl: item.external_urls.spotify,
            }));
            setArtists(formattedArtists);
        })
        .catch((err) => setError(err.message || "Erro ao buscar artistas"))
        .finally(() => setLoading(false));
    },  [token, limit]);

    return { artists, loading, error };
}