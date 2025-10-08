
import { emitApiError } from "@/components/ApiErrorWatcher";
import {
    SpotifyTopArtistsResponse,
    SpotifyTopTracksResponse,
    SpotifyRelatedArtistsResponse,
    SpotifySavedTracksResponse,
    SpotifyTrackAPI,
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

function handleSpotifyApiError(res: Response, context: string) {
    handleSpotifyAuthError(res);
    if (!res.ok) {
        if (res.status === 404) return;
        const message = `Não foi possível carregar suas músicas. ${context}`;
        if (typeof window !== "undefined")
            emitApiError(message);
        throw new Error(`SPOTIFY_API_ERROR: ${context}`);
    }
}

async function spotifyFetch<T>(url: string, token: string, context: string): Promise<T> {
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    handleSpotifyApiError(res, context);
    return res.json();
}

export const getTopArtists = (token: string, limit = 10) =>
    spotifyFetch<SpotifyTopArtistsResponse>(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, token, "Erro ao buscar artistas favoritos");

export const getUserPlaylists = (token: string, limit = 10) =>
    spotifyFetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, token, "Erro ao buscar playlists");

export const getUserTopTracks = (token: string, limit = 10) =>
    spotifyFetch<SpotifyTopTracksResponse>(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}`, token, "Erro ao buscar músicas mais ouvidas");

export const getRecentlyPlayedTracks = (token: string, limit = 10) =>
    spotifyFetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, token, "Erro ao buscar músicas reproduzidas recentemente");

export const getUserTopArtists = (token: string, limit = 5) =>
    spotifyFetch<SpotifyTopArtistsResponse>(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, token, "Erro ao buscar top artistas do usuário");

export const getArtistAlbums = (token: string, artistId: string, limit = 10) =>
    spotifyFetch<SpotifyAlbumsResponse>(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}&include_groups=album,single`, token, "Erro ao buscar álbuns do artista");

export const getArtistTopTracks = (token: string, artistId: string) =>
    spotifyFetch<SpotifyTopTracksResponse>(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=BR`, token, "Erro ao buscar top tracks do artista");

export const getRelatedArtists = async (token: string, artistId: string): Promise<SpotifyRelatedArtistsResponse> => {
    try {
        const res = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) return { artists: [] };
        handleSpotifyApiError(res, "Erro ao buscar artistas relacionados");
        return res.json();
    } catch {
        return { artists: [] };
    }
};

export const getUserSavedTracks = (token: string, limit = 50) =>
    spotifyFetch<SpotifySavedTracksResponse>(`https://api.spotify.com/v1/me/tracks?limit=${limit}`, token, "Erro ao buscar músicas salvas");

export const getAlbumTracks = (token: string, albumId: string, limit: number = 50) =>
    spotifyFetch<SpotifyAlbumTracksResponse>(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=${limit}`, token, "Erro ao buscar músicas do álbum");

export async function getPersonalizedRecommendations(token: string, limit = 20) {
    try {
        const [topArtistData, topTracksData, savedTracksData] = await Promise.all([
            getUserTopArtists(token, 10),
            getUserTopTracks(token, 20),
            getUserSavedTracks(token, 50),
        ]);

        const topArtists = topArtistData.items || [];
        const topTracks = (topTracksData as any).items || [];
        const savedTracks = savedTracksData.items?.map((item) => item.track) || [];

        const knownTrackIds = new Set([
            ...topTracks.map((t: SpotifyTrackAPI) => t.id),
            ...savedTracks.map((t: SpotifyTrackAPI) => t.id),
        ]);

        const recommendedTracks: SpotifyTrackAPI[] = [];
        const trackScores = new Map<string, number>();

        const addTrack = (track: SpotifyTrackAPI) => {
            if (!knownTrackIds.has(track.id) && !recommendedTracks.find((t) => t.id === track.id)) {
                recommendedTracks.push(track);
                knownTrackIds.add(track.id);
            }
        };

        for (const artist of topArtists.slice(0, 5)) {
            try {
                const { tracks } = await getArtistTopTracks(token, artist.id);
                tracks.forEach(addTrack);
            } catch (err) {
                console.error(`Erro ao buscar tracks do artista ${artist.name}:`, err);
            }
        }

        for (const artist of topArtists.slice(0, 3)) {
            try {
                const related = (await getRelatedArtists(token, artist.id)).artists?.slice(0, 2) || [];
                for (const relatedArtist of related) {
                    const { tracks } = await getArtistTopTracks(token, relatedArtist.id);
                    tracks.slice(0, 3).forEach(addTrack);
                }
            } catch (err) {
                console.warn(`Não foi possível buscar artistas relacionados de ${artist.name}`, err);
            }
        }

        recommendedTracks.forEach((track) => {
            const popularity = track.popularity || 0;
            let bonus = 0;
            if (popularity >= 40 && popularity <= 70)
                bonus = 3;
            else if (popularity > 70) bonus = 1;
            trackScores.set(track.id, (trackScores.get(track.id) || 0) + bonus);
        });

        return {
            tracks: recommendedTracks.sort((a, b) => (trackScores.get(b.id) || 0) - (trackScores.get(a.id) || 0)).slice(0, limit)
        };
    } catch (err) {
        console.error("Erro ao gerar recomendações:", err);
        throw new Error("Erro ao buscar recomendações personalizadas");
    }
}

export async function getWeeklyDiscoveries(token: string, limit = 20) {
    try {
        const [topArtistData, topTracksData, savedTracksData] = await Promise.all([
            getUserTopArtists(token, 10),
            getUserTopTracks(token, 20),
            getUserSavedTracks(token, 50),
        ]);

        const topArtists = topArtistData.items || [];
        const topTracks = (topTracksData as any).items || [];
        const savedTracks = savedTracksData.items?.map((item) => item.track) || [];

        const knowTrackIds = new Set([
            ...topTracks.map((t: SpotifyTrackAPI) => t.id),
            ...savedTracks.map((t: SpotifyTrackAPI) => t.id),
        ]);

        const discoveryTracks: SpotifyTrackAPI[] = [];

        for (const artist of topArtists) {
            try {
                const { tracks } = await getArtistTopTracks(token, artist.id);
                tracks.forEach((track) => {
                    if (!knowTrackIds.has(track.id) && !discoveryTracks.find((t) => t.id === track.id)) {
                        discoveryTracks.push(track);
                        knowTrackIds.add(track.id)
                    }
                });
            } catch (err) {
                console.warn(`Erro ao buscar top tracks do artista ${artist.name}`, err);
            }
        }

        return { tracks: discoveryTracks.sort(() => 0.5 - Math.random()).slice(0, limit) };
    } catch (error) {
        console.error("Erro ao buscar descobertas da semana:", error);
        throw new Error("Erro ao buscar descobertas da semana");
    }
}