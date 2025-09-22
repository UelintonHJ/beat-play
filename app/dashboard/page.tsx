import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import PlaylistsSection from "@/components/PlaylistsSection";

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

    console.log("Access Token Spotify:", accessToken);

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

        console.log("Dados retornados pelo Spotify:", JSON.stringify(data, null, 2));

        return data.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            owner: playlist.owner?.display_name || "Desconhecido",
            image: playlist.images?.[0]?.url || "/playlist-mock.jpg",
            spotifyUrl: playlist.external_urls.spotify,
        }));
    }

    let playlists: Playlist[] = [];

    if (accessToken) {
        try {
            playlists = await fetchSpotifyPlaylists(accessToken);
        } catch (error) {
            console.error(error);
        }
    }

    console.log("Playlists recebidas do Spotify:", playlists);

    return (
        <div className="text-white p-8">
            <h1 className="text-2x1 font-bold mb-4">Bem-vindo ao Beatplay</h1>
            <PlaylistsSection playlists={playlists} />
        </div>
    );
}