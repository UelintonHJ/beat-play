import { useEffect, useState } from "react";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track, SpotifyTrackAPI, SpotifyAlbumAPI } from "@/types/spotify"
import { getAlbumTracks, getArtistAlbums, getUserSavedTracks, getUserTopArtists } from "@/lib/spotify";

export function useWeeklyReleases(limit: number = 20) {
    const token = useSpotifyToken();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;


        async function fetchReleases() {
            try {
                const topArtistsData = await getUserTopArtists(token!, 10);
                const savedTracksData = await getUserSavedTracks(token!, 50);
                const savedTracksIds = new Set(savedTracksData.items?.map((t) => t.track.id) || []
                );

                const releaseTracks: SpotifyTrackAPI[] = [];

                const albumsResults = await Promise.all(
                    (topArtistsData.items || []).map(async (artist) => {
                        try {
                            const albumsData = await getArtistAlbums(token!, artist.id, 50);
                            return albumsData.items || [];
                        } catch (err) {
                            console.warn(`Erro ao buscar álbuns de ${artist.name}`, err);
                            return [];
                        }
                    })
                );

                const allAlbums: SpotifyAlbumAPI[] = albumsResults.flat();

                const tracksResults = await Promise.all(
                    allAlbums.map(async (album) => {
                        try {
                            const albumTracksData = await getAlbumTracks(token!, album.id, 20);
                            return (albumTracksData.items || []).map((rawTrack) => ({
                                ...rawTrack,
                                album: {
                                    id: album.id,
                                    name: album.name,
                                    images: album.images && album.images.length > 0
                                        ? album.images
                                        : [{ url: "/track-mock.png " }],
                                    release_date: album.release_date,
                                },
                            }));
                        } catch (err) {
                            console.warn(`Erro ao buscar faixas do álbum ${album.id}`, err);
                            return [];
                        }
                    })
                );

                const allTracks: SpotifyTrackAPI[] = tracksResults.flat();

                for (const track of allTracks) {
                    if (
                        !savedTracksIds.has(track.id) &&
                        !releaseTracks.find((t) => t.id === track.id)
                        ) {
                        releaseTracks.push(track);
                    }
                }

                const shuffled = releaseTracks.sort(() => 0.5 - Math.random());

                setTracks(shuffled.slice(0, limit).map((track) => ({
                    id: track.id,
                    name: track.name,
                    album: {
                        ...track.album,
                        images: track.album.images.length
                            ? track.album.images
                            : [{ url: "/track-mock.png" }],
                    },
                    artists: track.artists.map((a) => ({
                        id: a.id,
                        name: a.name,
                        image: a.images?.[0]?.url || "",
                        spotifyUrl: a.external_urls?.spotify || "",
                    })),
                })));
            } catch (err: any) {
                setError(err.message || "Erro ao buscar lançamentos da semana");
            } finally {
                setLoading(false);
            }
        }

        fetchReleases();
    }, [token, limit]);

    return { tracks, loading, error };
}