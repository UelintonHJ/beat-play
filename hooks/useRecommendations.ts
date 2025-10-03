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

        async function fetchRecommendations() {
            try {
                const topArtistsData = await getUserTopArtists(token!, 10);
                const savedTracksData = await getUserSavedTracks(token!, 50);

                const savedTrackIds = new Set(savedTracksData.items?.map(t => t.track.id) || []);

                const topArtists = topArtistsData.items || [];

                const recommendationsTracks: SpotifyTrackAPI[] = [];

                await Promise.all(topArtists.map(async (artist) => {
                    try {
                        const relatedData = await getRelatedArtists(token!, artist.id);
                        const relatedArtists: SpotifyArtistAPI[] = (relatedData.artists || []).slice(0, 2);

                        await Promise.all(relatedArtists.map(async (related) => {
                            const topTracksData = await getArtistTopTracks(token!, related.id);
                            const artistTracks: SpotifyTrackAPI[] = topTracksData.tracks?.slice(0, 3) || [];

                            artistTracks.forEach((track: SpotifyTrackAPI) => {
                                if (!savedTrackIds.has(track.id) && !recommendationsTracks.find(t => t.id === track.id)) {
                                    recommendationsTracks.push(track);
                                }
                            });
                        }));
                    } catch (err) {
                        console.warn(`Erro ao buscar artistas relacionados de ${artist.name}`, err);
                    }
                }));

                const shuffled = recommendationsTracks.sort(() => 0.5 - Math.random());

                const formattedTracks: Track[] = shuffled.slice(0, limit).map(track => ({
                    id: track.id,
                    name: track.name,
                    album: {
                        images: track.album.images.length ? track.album.images : [{ url: "/track-mock.png" }],
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