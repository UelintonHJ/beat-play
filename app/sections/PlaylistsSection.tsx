"use client";

import PlaylistCard from "../../components/PlaylistCard";
import SectionSkeleton from "../../components/SectionSkeleton";
import { useUserPlaylists } from "@/hooks/useUserPlaylists";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import ErrorMessage from "@/components/ErrorMessage";

interface Playlist {
    id: string;
    name: string;
    owner: string;
    image: string;
    spotifyUrl: string;
}

export default function PlaylistsSection() {
    const {
        playlists,
        loading,
        error: realError, //test
    } = useUserPlaylists(20);

    const error = true; //test

    if (!playlists.length && !loading) {
        return (
            <p className="text-gray-400 mb-4">
                Nenhuma playlist encontrada no Spotify.
            </p>
        );
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Minhas Playlists</h2>
            {error ? (
                <ErrorMessage message="Erro ao carregar playlists." type="error" className="mb-6"/>
            ) : (
                <HorizontalScrollSection>
                {loading ? (
                    <SectionSkeleton count={8} cardWidth="w-[192px]" cardHeight="h-[248px]" />
                ) : (
                    playlists.map((playlist) => (
                        <PlaylistCard
                            key={playlist.id}
                            name={playlist.name}
                            owner={playlist.owner}
                            image={playlist.image}
                            spotifyUrl={playlist.spotifyUrl}
                        />
                    ))
                )}
            </HorizontalScrollSection>
            )}
        </section>
    );
}