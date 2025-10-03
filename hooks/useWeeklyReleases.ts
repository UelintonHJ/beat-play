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
        if (!token) return;

        setLoading(true);
        setError(null);

        async function fetchReleases(token: string) {
            try {
                const topArtistsData = await getUserTopArtists(token, 10);
                const savedTracksData = await getUserSavedTracks(token, 50);
                const savedTracksIds = new Set(savedTracksData.items?.map(t => t.track.id) || []);

                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const releaseTracks: SpotifyTrackAPI[] = [];

                for (const artist of topArtistsData.items || []) {
                    try {
                        const albumsData = await getArtistAlbums(token, artist.id, 10);
                        const recentAlbums = (albumsData.tracks || []).filter(track => {
                            const releaseDate = new Date(track.album.release_date);
                            return releaseDate >= oneWeekAgo;
                        });

                        for (const track of recentAlbums) {
                            if (!savedTracksIds.has(track.id) && !releaseTracks.find(t => t.id === track.id)) {
                                releaseTracks.push(track);
                            }
                        }
                    } catch (err) {
                        console.warn(`Èrro ao buscar álbuns de ${artist.name}`, err);
                    }
                }
            }
        }
    })
}