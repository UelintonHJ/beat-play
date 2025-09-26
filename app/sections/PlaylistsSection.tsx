"use client";

import PlaylistCard from "../../components/PlaylistCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import SectionSkeleton from "../../components/SectionSkeleton";
import { useUserPlaylists } from "@/hooks/useUserPlaylists";

interface PlaylistsSectionProps {
    token: string
}

export default function PlaylistsSection({ token}: PlaylistsSectionProps) {
    const {
        playlists,
        loading,
        error,
    } = useUserPlaylists(token);

    const {
        containerRef,
        showLeftButton,
        showRightButton,
        scrollLeft,
        scrollRight,
    } = useSmoothScroll();

    if(error) {
        return (
            <p className="text-red-500 mb-4">
                Erro ao carregar playlists.
            </p>
        );
    }

    if(!playlists.length && !loading) {
        return (
            <p className="text-gray-400 mb-4">
                Nenhuma playlist encontrada no Spotify.
            </p>
        );
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Minhas Playlists</h2>

            <div className="relative">
                {/* Botão de Voltar */}
                {showLeftButton && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                {/* Container horizontal com overflow oculto */}
                <div className="flex gap-4 overflow-x-hidden px-6" ref={containerRef}>
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
                </div>

                {/* Botão para avançar */}
                {showRightButton && (
                    <button onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </section>
    );
}