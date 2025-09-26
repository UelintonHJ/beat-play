import { useState, useEffect } from "react";

type Track = {
    id: string;
    name: string;
    album: {
        images: { url: string }[];
    };
    artists: { name: string }[];
};

export function useUserTopTracks(token: string) {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchTopTracks = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error("Erro ao buscar músicas mais ouvidas");
                }

                const data = await res.json();
                setTracks(data.items || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopTracks();
    }, [token]);

    return { tracks, loading, error };
}