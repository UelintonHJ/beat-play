"use client";

import PlaylistCard from "./PlaylistCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import SectionSkeleton from "./SectionSkeleton";

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
    const {
        containerRef,
        showLeftButton,
        showRightButton,
        scrollLeft,
        scrollRight,
    } = useSmoothScroll();

    const loading = playlists.length === 0;

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
                    ) : playlists.length > 0 ? (
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