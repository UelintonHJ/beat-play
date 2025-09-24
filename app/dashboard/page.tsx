import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import PlaylistsSection from "@/components/PlaylistsSection";
import ArtistsSection from "@/components/ArtistsSection";
import { getTopArtists } from "@/lib/spotify";

interface SpotifyArtists {
    id: string;
    name: string;
    images: { url: string }[];
    external_urls: {
        spotify: string;
    };
}

type Artist = {
    id: string;
    name: string;
    image: string;
    spotifyUrl: string;
};

interface SpotifyPlaylist {
    id: string;
    name: string;
    owner: {
        display_name: string;
    };
    images: { url: string }[];
    external_urls: {
        spotify: string;
    };
}

type Playlist = {
    id: string;
    name: string;
    owner: string;
    image: string;
    spotifyUrl: string;
};

export default async function DashboardPage() {
    interface CustomSessions extends Session {
        accessToken?: string;
    }

    const session = await getServerSession(authOptions) as CustomSessions;
    const accessToken = session.accessToken;

    async function fetchSpotifyPlaylists(token: string): Promise<Playlist[]> {
        const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=20", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Não foi possível buscar as playlists do Spotify");
        }

        const data = await res.json() as { items: SpotifyPlaylist[] };

        return data.items.map((playlist) => {

            return {
                id: playlist.id,
                name: playlist.name,
                owner: playlist.owner?.display_name || "Desconhecido",
                image: playlist.images?.[0]?.url ?? "/playlist-mock.png",
                spotifyUrl: playlist.external_urls.spotify,
            };

        });
    }

    async function fecthSpotifyArtists(token: string): Promise<Artist[]> {
        const data = await getTopArtists(token, 10);
        return data.items.map((artist: SpotifyArtists) => ({
            id: artist.id,
            name: artist.name,
            image:artist.images?.[0]?.url ?? "/artist-mock.png",
            spotifyUrl: artist.external_urls.spotify,
        }));
    }

    let playlists: Playlist[] = [];
    let artists: Artist[] = [];

    if (accessToken) {
        try {
            playlists = await fetchSpotifyPlaylists(accessToken);
            artists = await fecthSpotifyArtists(accessToken);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="text-white p-8">
            <h1 className="text-2x1 font-bold mb-4">Bem-vindo ao Beatplay</h1>
            <PlaylistsSection playlists={playlists} />
            <ArtistsSection artists={artists} />
        </div>
    );
}