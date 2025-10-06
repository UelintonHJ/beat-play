
import {
    SpotifyTopArtistsResponse,
    SpotifyTopTracksResponse,
    SpotifyRelatedArtistsResponse,
    SpotifySavedTracksResponse,
    SpotifyTrackAPI,
    SpotifyArtistAPI,
    SpotifyAlbumsResponse,
    SpotifyAlbumTracksResponse
} from "@/types/spotify"

function handleSpotifyAuthError(response: Response) {
    if (response.status === 401 || response.status === 403) {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('spotify_token_expired', 'true');
            window.dispatchEvent(new CustomEvent('spotify-auth-error'));
        }
    }
}

export async function getTopArtists(token: string, limit: number = 10) {
    const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar artistas favoritos");
    return res.json();
}

export async function getUserPlaylists(token: string, limit: number = 10) {
    const res = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar playlists");
    return res.json();
}

export async function getUserTopTracks(token: string, limit: number = 10) {
    const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar músicas mais ouvidas");
    return res.json();
}

export async function getRecentlyPlayedTracks(token: string, limit: number = 10) {
    const res = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar músicas reproduzidas recentemente");
    return res.json();
}

export async function getUserTopArtists(token: string, limit: number = 5): Promise<SpotifyTopArtistsResponse> {
    const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar top artistas do usuário");
    return res.json();
}

export async function getArtistAlbums(token: string, artistId: string, limit: number = 10): Promise<SpotifyAlbumsResponse> {
    const res = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&include_groups=album,single`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar álbuns do artista");
    return res.json();
}

export async function getArtistTopTracks(token: string, artistId: string) {
    const res = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=BR`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar top tracks do artista");
    return res.json();
}

export async function getRelatedArtists(token: string, artistId: string): Promise<SpotifyRelatedArtistsResponse> {
    const res = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) {
        return { artists: [] };
    }

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar artistas relacionados");
    return res.json();;
}

export async function getUserSavedTracks(token: string, limit: number = 50): Promise<SpotifySavedTracksResponse> {
    const res = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar músicas salvas");
    return res.json();
}

interface TopTracksWithItems {
    items: SpotifyTrackAPI[];
}

export async function getPersonalizedRecommendations(token: string, limit: number = 20) {
    try {
        const [topArtistData, topTracksData, savedTracksData] = await Promise.all([
            getUserTopArtists(token, 10),
            getUserTopTracks(token, 20),
            getUserSavedTracks(token, 50),
        ]);

        const topArtists = topArtistData.items || [];
        const topTracks = (topTracksData as TopTracksWithItems).items || [];
        const savedTracks = savedTracksData.items?.map((item) => item.track) || [];

        const knowTrackIds = new Set([
            ...topTracks.map((t) => t.id),
            ...savedTracks.map((t) => t.id),
        ]);

        const recommendedTracks: SpotifyTrackAPI[] = [];
        const trackScores = new Map<string, number>();

        for (const artist of topArtists.slice(0, 5)) {
            try {
                const topTracksData = await getArtistTopTracks(token, artist.id);
                const artistTracks = topTracksData.tracks || [];

                artistTracks.forEach((track: SpotifyTrackAPI) => {
                    if (!knowTrackIds.has(track.id)) {
                        if (!recommendedTracks.find(t => t.id === track.id)) {
                            recommendedTracks.push(track);
                            knowTrackIds.add(track.id)
                        }
                    }

                });
            } catch (err) {
                console.error(`Erro ao buscar tracks do artista ${artist.name}:`, err);
            }
        }

        for (const artist of topArtists.slice(0, 3)) {
            try {
                const relatedData = await getRelatedArtists(token, artist.id);
                const relatedArtists: SpotifyArtistAPI[] = (relatedData.artists || []).slice(0, 2);

                for (const relatedArtist of relatedArtists) {
                    const topTracksData = await getArtistTopTracks(token, relatedArtist.id);
                    const artistTracks: SpotifyTrackAPI[] = (topTracksData.tracks || []).slice(0, 3);

                    artistTracks.forEach((track: SpotifyTrackAPI) => {
                        if (!knowTrackIds.has(track.id)) {
                            if (!recommendedTracks.find(t => t.id === track.id)) {
                                recommendedTracks.push(track);
                                knowTrackIds.add(track.id);
                            }
                        }
                    });
                }
            } catch (err: unknown) {
                console.warn(`Não foi possível buscar artistas relacionados de ${artist.name}`, err);
            }
        }

        recommendedTracks.forEach((track: SpotifyTrackAPI) => {
            const popularity = track.popularity || 0;
            let popularityBonus = 0;

            if (popularity >= 40 && popularity <= 70) {
                popularityBonus = 3;
            } else if (popularity > 70) {
                popularityBonus = 1;
            }

            const currentScore = trackScores.get(track.id) || 0;
            trackScores.set(track.id, currentScore + popularityBonus);
        });

        const sortedTracks = recommendedTracks
            .sort((a, b) => (trackScores.get(b.id) || 0) - (trackScores.get(a.id) || 0))
            .slice(0, limit);

        return { tracks: sortedTracks };
    } catch (error) {
        console.error("Erro ao gerar recomendações:", error);
        throw new Error("Erro ao buscar recomendações personalizadas");
    }
}

export async function getWeeklyDiscoveries(token: string, limit: number = 20) {
    try {
        const [topArtistData, topTracksData, savedTracksData] = await Promise.all([
            getUserTopArtists(token, 10),
            getUserTopTracks(token, 20),
            getUserSavedTracks(token, 50),
        ]);

        const topArtists = topArtistData.items || [];
        const topTracks = (topTracksData as TopTracksWithItems).items || [];
        const savedTracks = savedTracksData.items?.map((item) => item.track) || [];

        const knowTrackIds = new Set([
            ...topTracks.map((t) => t.id),
            ...savedTracks.map((t) => t.id),
        ]);

        const discoveryTracks: SpotifyTrackAPI[] = [];

        for (const artist of topArtists) {
            try {
                const artistTopTracks = (await getArtistTopTracks(token, artist.id)).tracks || [];
                for (const track of artistTopTracks) {
                    if (!knowTrackIds.has(track.id) && !discoveryTracks.find(t => t.id === track.id)) {
                        discoveryTracks.push(track);
                        knowTrackIds.add(track.id)
                    }
                }
            } catch (err) {
                console.warn(`Erro ao buscar top tracks do artista ${artist.name}`, err);
            }
        }

        const shuffled = discoveryTracks.sort(() => 0.5 - Math.random());

        return { tracks: shuffled.slice(0, limit) };

    } catch (error) {
        console.error("Erro ao buscar descobertas da semana:", error);
        throw new Error("Erro ao buscar descobertas da semana");
    }

}

export async function getAlbumTracks(token: string, albumId: string, limit: number = 50): Promise<SpotifyAlbumTracksResponse> {
    const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    handleSpotifyAuthError(res);
    if (!res.ok) throw new Error("Erro ao buscar músicas do álbum");
    return res.json();
}