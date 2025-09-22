import PlaylistCard from "./PlaylistCard";

type Playlist = {
    id: string;
    name: string;
    owner: string;
    image: string;
    spotifyUrl: string;
};

interface PlaylistsSectionProps {
    playlists: Playlist[];
}

export default function PlaylistsSection({ playlists }: PlaylistsSectionProps) {
    return (
        <section>
                        <h2 className="text-xl font-semibold mb-4">Minhas Playlists</h2>
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
                                <p className="text-gray-400 whitespace-nowrap">
                                    Nenhuma playlist encontrada no Spotify.
                                </p>
                            )}
                        </div>
                    </section>
    )
}