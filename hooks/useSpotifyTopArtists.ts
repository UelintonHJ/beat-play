import { useEffect, useState } from "react";
import { useSpotifyToken } from "./useSpotifyToken";

export const useSpotifyTopArtists = (limit: number = 10) => {
    const token = useSpotifyToken();
    const [artists, setArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!token) return;
        
        const fetchArtists = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                const data = await res.json();
                setArtists(data.items || []);
            } catch (err) {
                console.error("Erro ao buscar artistas", err);
                setArtists([]);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, [token, limit]);

    return { artists, loading };
}