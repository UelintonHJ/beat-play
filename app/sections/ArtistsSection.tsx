"use client";

import ArtistCard from "../../components/ArtistCard";
import SectionSkeleton from "../../components/SectionSkeleton";
import { useTopArtists } from "@/hooks/useTopArtists";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";

interface ArtistsSectionProps {
    token: string;
}

export default function ArtistsSection({ token }: ArtistsSectionProps) {
    const {
        artists,
        loading,
        error
    } = useTopArtists(token);

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

            <HorizontalScrollSection
                items={loading ? Array.from({ length: 8 }) : artists}
                isLoading={loading}
                renderItem={(artist: any, index: number) =>
                    loading ? null : (
                        <div key={artist.id} className="flex-shrink-0">
                            <ArtistCard
                                name={artist.name}
                                image={artist.image}
                                spotifyUrl={artist.spotifyUrl}
                            />
                        </div>
                    )
                }
                cardWidth="w-[192px]"
                carHeight="h-[248px]"
            />
        </section >
    );
}
