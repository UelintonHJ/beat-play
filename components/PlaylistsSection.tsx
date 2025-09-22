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
                        <div className="flex gap-4 overflow-x auto px-2 py-2">
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