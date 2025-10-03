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
        if (!token) {
            setLoading(true);
            setError("Token do Spotify não disponível");
            return;
        }

        async function fetchReleases() {
            try {
                const topArtistsData = await getUserTopArtists(token!, 10);
                console.log(topArtistsData.items); //test
                const savedTracksData = await getUserSavedTracks(token!, 50);
                const savedTracksIds = new Set(savedTracksData.items?.map(t => t.track.id) || []);

                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const releaseTracks: SpotifyTrackAPI[] = [];

                for (const artist of topArtistsData.items || []) {
                    try {
                        const albumsData = await getArtistAlbums(token!, artist.id, 50);
                        console.log(albumsData); //test
                        const recentAlbums = albumsData.items || [];
                        console.log(recentAlbums); //test

                        for (const album of recentAlbums) {
                            try {
                                const albumTracksData = await getAlbumTracks(token!, album.id, 20);
                                const albumTracks = albumTracksData.items || [];

                                for (const rawTrack of albumTracks) {
                                    const trackWithAlbum: SpotifyTrackAPI = {
                                        ...rawTrack,
                                        album: {
                                            id: album.id,
                                            name: album.name,
                                            images: album.images && album.images.length > 0 
                                            ? album.images 
                                            : [{ url: "/track-mock.png " }],
                                            release_date: album.release_date,
                                        },
                                    };

                                    if (!savedTracksIds.has(trackWithAlbum.id) && !releaseTracks.find(t => t.id === trackWithAlbum.id)) {
                                        releaseTracks.push(trackWithAlbum);
                                    }
                                }
                            } catch (err) {
                                console.warn(`Erro ao buscar faixas do álbum ${album.id}`, err);
                            }

                        }

                    } catch (err) {
                        console.warn(`Èrro ao buscar álbuns de ${artist.name}`, err);
                    }
                }

                const shuffled = releaseTracks.sort(() => 0.5 - Math.random());

                console.log("releaseTracks antes do setTracks:", releaseTracks); //test

                setTracks(shuffled.slice(0, limit).map(track => ({
                    id: track.id,
                    name: track.name,
                    album: {
                        ...track.album,
                        images: track.album.images.length
                            ? track.album.images
                            : [{ url: "/track-mock.png" }],
                    },
                    artists: track.artists.map(a => ({
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