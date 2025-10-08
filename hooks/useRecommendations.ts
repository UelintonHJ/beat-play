import { useState, useEffect } from "react";
import { getUserTopArtists, getArtistTopTracks, getUserSavedTracks } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track, SpotifyTrackAPI, SpotifyArtistAPI } from "@/types/spotify";

const MAX_TOP_ARTISTS = 5;
const MAX_TRACKS_PER_ARTIST = 3;

export function useRecommendations(limit: number = 20) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchRecommendations = async () => {
            setLoading(true);
            setError(null);

            try {
                const [topArtistData, savedTracksData] = await Promise.all([
                    getUserTopArtists(token, MAX_TOP_ARTISTS),
                    getUserSavedTracks(token, 50),
                ]);

                const topArtists: SpotifyArtistAPI[] = topArtistData.items?.filter(a => a?.id) || [];
                const savedTrackIds = new Set<string>(savedTracksData.items?.map(t => t.track.id) || []);

                if (topArtists.length === 0) {
                    setError("Nenhum artista encontrado para gerar recomendações.")
                    setTracks([]);
                    return;
                }

                const recommendationsTracks: SpotifyTrackAPI[] = [];

               for (const artist of topArtists) {
                        if (!artist.id) return;

                        try {
                            const topTracksData = await getArtistTopTracks(token, artist.id);
                            const artistTracks: SpotifyTrackAPI[] = topTracksData.tracks?.slice(0, MAX_TRACKS_PER_ARTIST) || [];
                            
                            artistTracks.forEach(track => {
                                if (!savedTrackIds.has(track.id) && !recommendationsTracks.find(t => t.id === track.id)) {
                                    recommendationsTracks.push(track);
                                }
                            });
                        } catch (err: any) {
                            console.warn(`Erro ao buscar top tracks de ${artist.name}`, err);
                        }
                    }

                if (recommendationsTracks.length === 0) {
                    setError("Nenhuma música nova encontrada para os artistas relacionados.");
                    setTracks([]);
                    return;
                }

                const shuffled = recommendationsTracks.sort(() => 0.5 - Math.random());

                setTracks(
                    shuffled.slice(0, limit).map(track => ({
                        id: track.id,
                        name: track.name,
                        album: {
                            images: track.album.images.length ? track.album.images : [{ url: "/track-mock.png" }],
                        },
                        artists: track.artists.map(a => ({
                            id: a.id,
                            name: a.name,
                            image: a.images?.[0].url || "/artist-mock.png",
                            spotifyUrl: a.external_urls?.spotify || "",
                        })),
                        preview_url: track.preview_url,
                    })));
            } catch (err: any) {
                console.error("Erro ao buscar recomendações:", err);
                setError(err.message?.includes("429")
                    ? "Limite de requisições atingido. Aguarde alguns segundos."
                    : "Erro ao buscar recomendações. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [token, limit]);

    return { tracks, loading, error };
}