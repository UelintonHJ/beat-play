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
    externa_urls?: { spotify: string };
}

export interface SpotifyAlbumAPI {
    id: string;
    name: string;
    images: SpotifyImage[];
}

export interface SpotifyTrackAPI {
    id: string;
    name: string;
    album: SpotifyAlbumAPI;
    artists: SpotifyArtistAPI[];
    preview_urls?: string;
    popularity?: number;
    external_urls?: { spotify: string };
}

export interface SpotifyTopArtistsResponse {
    items: SpotifyArtistAPI[];
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