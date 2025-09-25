import { useState, useEffect } from "react";
import { getUserPlaylists } from "@/lib/spotify"

type Playlists = {
    id: string;
    name: string;
    owner: string;
    image: string;
    spotifyUrl: string;
};

export function useUserPlaylists(token: string, limit: number = 10) {
    const [playlists, setPlaylists] = useState<Playlists[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!token) return;

        setLoading(true);
        setError(null);

        getUserPlaylists(token, limit).then((data) => {
            const formattedPlaylists = data.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                owner: item.owner.display_name,
                image: item.images?.[0]?.url || "/playlist-mock.png",
                spotifyUrl: item.external_urls.spotify,
            }));
            setPlaylists(formattedPlaylists);
        })
        .catch((err) => setError(err.messege || "Erro ao buscar playlists"))
        .finally(() => setLoading(false));
    }, [token, limit]);

    return { playlists, loading, error };
}