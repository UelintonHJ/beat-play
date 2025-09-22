import PlaylistCard from "./PlaylistCard";
import { ChevronRight } from "lucide-react";

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

            <div className="relative">
                {/* Container horizontal com overflow oculto */}
                <div className="flex gap-4 overflow-hidden" id="playlists-container">
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

                {/* Botão para avançar */}
                {playlists.length > 0 && (
                    <button onClick={() => {
                            const container = document.getElementById('playlists-container');
                            if (container) container.scrollBy({ left:300, behavior: 'smooth' });
                        }}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-1"
                    >
                        <ChevronRight size={20}/>
                    </button>
                )}
            </div>
        </section>
    )
}