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
                const savedTracksIds = new Set(savedTracksData.items?.map(t => t.track.id) || []
                );

                const now = new Date();
                const sixtyDaysAgo = new Date();
                sixtyDaysAgo.setDate(now.getDate() - 60);

                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(now.getFullYear() - 1);

                const albumsByArtist = await Promise.all(
                    (topArtistsData.items || []).map(artist =>
                        getArtistAlbums(token!, artist.id, 50).catch(() => ({ items: [] }))
                    )
                );

                const allAlbums: SpotifyAlbumAPI[] = albumsByArtist.flatMap(a => a.items || []);

                const recentAlbums = allAlbums.filter(album => {
                    if (!album.release_date) return false;
                    const releaseDate = new Date(album.release_date);
                    return releaseDate >= sixtyDaysAgo && releaseDate <= now;
                });

                const fallbackAlbums = recentAlbums.length < limit
                    ? allAlbums
                        .filter(album => {
                            if (!album.release_date) return false;
                            const releaseDate = new Date(album.release_date);
                            return releaseDate >= oneYearAgo && releaseDate < sixtyDaysAgo;
                        })
                        .sort((a, b) => new Date(b.release_date!).getTime() - new Date(a.release_date!).getTime())
                    : [];

                const albumsToFetch = [...recentAlbums, ...fallbackAlbums];

                const tracksByAlbum = await Promise.all(
                    albumsToFetch.map(album =>
                        getAlbumTracks(token!, album.id, 20)
                            .then(res => ({ album, tracks: res.items || [] }))
                            .catch(() => ({ album, tracks: [] }))
                    )
                );

                const releaseTracks: SpotifyTrackAPI[] = tracksByAlbum
                    .flatMap(({ album, tracks }) =>
                        tracks.map(rawTrack => ({
                            ...rawTrack,
                            album: {
                                id: album.id,
                                name: album.name,
                                images: album.images && album.images.length > 0
                                    ? album.images
                                    : [{ url: "/track-mock.png " }],
                                release_date: album.release_date,
                            },
                        }))
                    )
                    .filter(track => !savedTracksIds.has(track.id));

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