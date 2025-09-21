import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import PlaylistCard from "@/components/PlaylistCard";

type Playlist = {
    id: string,
    name: string,
    owner: string,
    image: string,
    spotifyUrl: string,
};

export default async function DashboardPage() {
    interface CustomSessions extends Session {
        accessToken?: string;
    }

    const session = await getServerSession(authOptions) as CustomSessions;
    const accessToken = session.accessToken;

    async function fetchSpotifyPlaylists(token: string) {
        const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=20", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Não foi possível buscar as playlists do Spotify");
        }

        const data = await res.json();
        return data.items.map((playlist: any) => ({
            id: playlist.id,
            name: playlist.name,
            owner: playlist.owner.display_name,
            image: playlist.images[0]?.url || "/playlist-mock.jpg",
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

    return (
        <div className="text-white p-8">
            <h1 className="text-2x1 font-bold mb-4">Bem-vindo ao Beatplay</h1>

            <section>
                <h2 className="text-xl font-semibold mb-4">Minhas Plylists</h2>
                <div className="grid grid-cols-2 mb:grid-cols-3 lg:grid-cols-4 gap-6 px-2 md:px-4">
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                name={playlist.name}
                                owner={playlist.owner}
                                image={playlist.image}
                                spotifyUrl={playlist.spotifyUrl}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400">Nenhuma playlist encontrada no Spotify.</p>
                    )}
                </div>
            </section>
        </div>
    );
}