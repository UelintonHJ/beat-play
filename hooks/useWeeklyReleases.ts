import { useEffect, useState } from "react";
import { useSpotifyToken } from "./useSpotifyToken";
import { Track, SpotifyTrackAPI } from "@/types/spotify"
import { getArtistAlbums, getUserSavedTracks, getUserTopArtists } from "@/lib/spotify";

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
                        const albumsData = await getArtistAlbums(token!, artist.id, 10);
                        console.log(albumsData); //test
                        const recentAlbums = (albumsData.tracks || []).filter(track => {
                            const releaseDateStr = track.album.release_date;
                            if (!releaseDateStr) return false;
                            const releaseDate = new Date(releaseDateStr);
                            return releaseDate >= oneWeekAgo;
                        });
                        console.log(recentAlbums); //test

                        for (const track of recentAlbums) {
                            if (!savedTracksIds.has(track.id) && !releaseTracks.find(t => t.id === track.id)) {
                                releaseTracks.push(track);
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