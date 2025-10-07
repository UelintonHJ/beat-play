export interface Artist {
    id: string;
    name: string;
    image: string;
    spotifyUrl: string;
}

export interface Playlist {
    id: string;
    name: string;
    owner: string;
    image: string;
    spotifyUrl: string;
}

export interface Track {
    id: string;
    name: string;
    album: {
        id?: string;
        name?: string;
        images: { url: string; width?: number; height?: number }[];
    };
    artists: Artist[];
}

export interface SpotifyImage {
    url: string;
    width?: number;
    height?: number;
}

export interface SpotifyArtistAPI {
    id: string;
    name: string;
    images?: SpotifyImage[];
    external_urls?: { spotify: string };
    href?: string;
    followers?: { total: number };
    genres?: string[];
}

export interface SpotifyAlbumAPI {
    id: string;
    name: string;
    images: SpotifyImage[];
    release_date?: string;
    release_date_precision?: string;
    album_group?: string;
    album_type?: string;
    external_urls?: { spotify: string };
    href?: string;
}

export interface SpotifyTrackAPI {
    id: string;
    name: string;
    album: SpotifyAlbumAPI;
    artists: SpotifyArtistAPI[];
    preview_url?: string;
    popularity?: number;
    external_urls?: { spotify: string };
}

export interface SpotifyTopArtistsResponse {
    items: SpotifyArtistAPI[];
    href?: string;
    limit?: number;
    next?: string | null;
    offset?: number;
    previous?: string | null;
    total?: number;
}

export interface SpotifyTopTracksResponse {
    tracks: SpotifyTrackAPI[];
}

export interface SpotifyRelatedArtistsResponse {
    artists: SpotifyArtistAPI[];
}

export interface SpotifySavedTracksResponse {
    items: Array<{ track: SpotifyTrackAPI }>;
}

export interface SpotifyAlbumsResponse {
    href?: string;
    items: SpotifyAlbumAPI[];
    limit?: number;
    next?: string | null;
    offset?: number;
    previous?: string | null;
    total?: number;
}

export interface SpotifyAlbumTracksResponse {
    href?: string;
    items: SpotifyTrackAPI[];
    limit?: number;
    next?: string | null;
    offset?: number;
    previous?: string | null;
    total?: number;
}

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: {
            Player: new (init: Spotify.PlayerInit) => Spotify.Player;
        };
    }

    namespace Spotify {
        interface PlayerInit {
            name: string;
            getOAuthToken: (cb: (token: string) => void) => void;
            volume?: number;
        }

        interface PlayerState {
            paused: boolean;
            track_window: {
                current_track: {
                    name: string;
                    album: {
                        images: { url: string }[];
                    };
                    artists: { name: string }[];
                };
            };
        }

        interface Player {
            connect(): Promise<boolean>;
            disconnect(): void;
            addListener(
                event: "ready" | "not_ready" | "player_state_changed" | string,
                callback: (data: any) => void
            ): boolean;
            removeListener(event: string, callback?: (data: any) => void): boolean;
            getCurrentState(): Promise<PlayerState | null>;
            resume(): Promise<void>;
            pause(): Promise<void>;
            previousTrack(): Promise<void>;
            nextTrack(): Promise<void>;
        }
    }
}

export { };
