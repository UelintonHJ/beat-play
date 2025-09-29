import { useState, useEffect } from "react";
import { getUserTopTracks } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";

type Track = {
    id: string;
    name: string;
    album: {
        images: { url: string }[];
    };
    artists: { name: string }[];
};

export function useUserTopTracks(limit: number = 10) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        getUserTopTracks(token, limit)
            .then((data) => {
                const formattedTracks = data.items.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    album: {
                        ...item.album, 
                        images: item.album.images.leght 
                        ? item.album.images 
                        : [{ url: "/track-mock.png"}]
                    }, 
                    artists: item.artists,
                }));
                setTracks(formattedTracks);
            })
            .catch((err) => setError(err.message || "Erro ao buscar faixas"))
            .finally(() => setLoading(false));
    }, [token, limit]);

    return { tracks, loading, error };
}