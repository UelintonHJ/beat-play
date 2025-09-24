"use client";

import { useRef, useState, useEffect } from "react";
import ArtistCard from "./ArtistCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

type Artist = {
    id: string;
    name: string;
    image: string;
    spotifyUrl: string;
};

interface ArtistsSectionProps {
    artists: Artist[];
}

export default function ArtistsSection({ artists }: ArtistsSectionProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = () => {
        const container = containerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            container.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        const container = containerRef.current;
        if (container) {
            const scrollAmount = Math.floor(container.clientWidth * 0.8);
            container.scrollTo({
                left: container.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount),
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Meus Artistas Favoritos</h2>

            <div className="relative">
                {canScrollLeft && (
                    <button onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-while w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                <div className="flex gap-4 overflow-x-hidden px-6" ref={containerRef}>
                    {artists.length > 0 ? (
                        artists.map((artist) => (
                            <ArtistCard
                                key={artist.id}
                                name={artist.name}
                                image={artist.image}
                                spotifyUrl={artist.spotifyUrl}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 whitespace-nowrap">
                            Nenhum artista encontrado.
                        </p>
                    )}
                </div>

                {canScrollRight && (
                    <button 
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </section>
    );
}