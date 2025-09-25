"use client";

import ArtistCard from "./ArtistCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import SectionSkeleton from "./SectionSkeleton";
import { useTopArtists } from "@/hooks/useTopArtists";

interface ArtistsSectionProps {
    token: string;
}

export default function ArtistsSection({ token }: ArtistsSectionProps) {
    const {
        artists,
        loading,
        error
    } = useTopArtists(token);

    const {
        containerRef,
        scrollLeft,
        scrollRight,
        showLeftButton,
        showRightButton,
    } = useSmoothScroll();

    if (error) {
        return (
            <p className="text-red-500 mt-4">
                Erro ao carregar artistas favoritos.
            </p>
        );
    }

    if (!artists.length && !loading) {
        return (
            <p className="text-gray-400 mt-4 whitespace-nowrap">
                Nenhum artista encontrado.
            </p>
        );
    }

    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Meus Artistas Favoritos</h2>

            <div className="relative">
                {showLeftButton && (
                    <button onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                {/* Container */}
                <div className="flex gap-4 overflow-x-hidden px-6" ref={containerRef}>
                    {loading ? (
                        <SectionSkeleton count={8} cardWidth="w-[192px]" cardHeight="h-[248px]" />
                    ) : (
                        artists.map((artist) => (
                            <div key={artist.id} className="flex-shrink-0">
                                <ArtistCard
                                    name={artist.name}
                                    image={artist.image}
                                    spotifyUrl={artist.spotifyUrl}
                                />
                            </div>
                        ))
                    )}
                </div>

                {showRightButton && (
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>

        </section>
    );
}