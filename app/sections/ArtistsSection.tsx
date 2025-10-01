"use client";

import ArtistCard from "../../components/ArtistCard";
import SectionSkeleton from "../../components/SectionSkeleton";
import { useTopArtists } from "@/hooks/useTopArtists";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import ErrorMessage from "@/components/ErrorMessage";

interface Artists {
    id: string;
    name: string;
    image: string;
    spotifyUrl: string;
}

export default function ArtistsSection() {
    const {
        artists,
        loading,
        error
    } = useTopArtists(20);

    if (error) {
        return <ErrorMessage message="Erro ao carregar artistas." />
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

            <HorizontalScrollSection>
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
            </HorizontalScrollSection>
        </section>
    );
}
