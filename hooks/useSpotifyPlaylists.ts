import { useEffect, useState } from "react";
import { useSpotifyToken } from "./useSpotifyToken";

export const useSpotifyPlaylists = () => {
    const token = useSpotifyToken();
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!token) return;

        const fetchPlaylists = async () => {
            setLoading(true);
            const res = await fetch("https://api.spotify.com/v1/me/playlists", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setPlaylists(data.items || []);
            setLoading(false);
        };

        fetchPlaylists();
    }, [token]);

    return { playlists, loading };
};