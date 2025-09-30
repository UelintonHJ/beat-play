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