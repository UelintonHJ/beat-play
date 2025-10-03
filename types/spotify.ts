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