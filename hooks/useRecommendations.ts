import { useState, useEffect } from "react";
import { getUserTopArtists, getRelatedArtists, getArtistTopTracks, getUserSavedTracks } from "@/lib/spotify";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track, SpotifyTrackAPI, SpotifyArtistAPI } from "@/types/spotify";

export function useRecommendations(limit: number = 20) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        const fetchRecommendations = async () => {
            try {
                const topArtistsData = await getUserTopArtists(token, 10);
                const savedTracksData = await getUserSavedTracks(token, 50);
                const savedTrackIds = new Set(savedTracksData.items?.map(t => t.track.id) || []);

                const topArtists = topArtistsData.items || [];

                const recommendationsTracks: SpotifyTrackAPI[] = [];

                await Promise.all(topArtists.map(async (artist) => {
                    const relatedData = await getRelatedArtists(token, artist.id);
                    const relatedArtists = (relatedData.artists || []).slice(0, 2);

                    const artistsToFetch = relatedArtists.length ? relatedArtists : [artist];

                    await Promise.all(artistsToFetch.map(async (related) => {
                        const topTracksData = await getArtistTopTracks(token, related.id);
                        const artistTracks: SpotifyTrackAPI[] = topTracksData.tracks?.slice(0, 3) || [];

                        artistTracks.forEach(track => {
                            if (!savedTrackIds.has(track.id) && !recommendationsTracks.find(t => t.id === track.id)) {
                                recommendationsTracks.push(track);
                            }
                        });
                    }));
                }));

                if (recommendationsTracks.length === 0) {
                    setError("Nenhuma música nova encontrada para os artistas relacionados");
                    setTracks([]);
                    return;
                }

                const shuffled = recommendationsTracks.sort(() => 0.5 - Math.random());

                setTracks(shuffled.slice(0, limit).map(track => ({
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
                setError(err.message || "Erro ao buscar novos sons");
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [token, limit]);
    return { tracks, loading, error };
}