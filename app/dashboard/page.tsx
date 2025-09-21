import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import PlaylistCard from "@/components/PlaylistCard";

export default async function DashboardPage() {
    interface CustomSessions extends Session {
        accessToken?: string;
    }

    const session = await getServerSession(authOptions) as CustomSessions;
    const accessToken = session.accessToken;

    const playlists = [
        {
            id: "1",
            name: "Psytrance Vibes",
            owner: "Uelinton",
            image: "/playlist-mock.jpg",
            spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n"
        },
        {
            id: "2",
            name: "Rock de Boteco",
            owner: "Uelinton",
            image: "/playlist-mock.jpg",
            spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U"
        },
    ];

    return (
        <div className="text-white p-8">
            <h1 className="text-2x1 font-bold mb-4">Bem-vindo ao Beatplay</h1>

            {session && (
                <section>
                    <h2 className="text-xl font-semibold mb-4">Minhas Plylists</h2>
                    <div className="grid grid-cols-2 mb:grid-cols-3 lg:grid-cols-4 gap-6 px-2 md:px-4">
                        {playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                name={playlist.name}
                                owner={playlist.owner}
                                image={playlist.image}
                                spotifyUrl={playlist.spotifyUrl}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}