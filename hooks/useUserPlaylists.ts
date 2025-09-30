import { useState, useEffect } from "react";
import { getUserPlaylists } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";
import { Playlist } from "@/types/spotify";

export function useUserPlaylists(limit: number = 10) {
    const token = useSpotifyToken();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!token) return;

        setLoading(true);
        setError(null);

        getUserPlaylists(token, limit).then((data) => {
            throw new Error("Erro simulado para teste de UI");

            const formattedPlaylists: Playlist[] = data.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                owner: item.owner.display_name,
                image: item.images?.[0]?.url || "/playlist-mock.png",
                spotifyUrl: item.external_urls.spotify,
            }));
            setPlaylists(formattedPlaylists);

        })
        .catch((err) => setError(err.message || "Erro ao buscar playlists"))
        .finally(() => setLoading(false));
    }, [token, limit]);

    return { playlists, loading, error };
}