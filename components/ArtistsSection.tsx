"use client";

import { useRef, useState, useEffect } from "react";
import ArtistCard from "./ArtistCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ArtistsSectionSkeleton from "./ArtistsSectionSkeleton";

type Artist = {
    id: string;
    name: string;
    image: string;
    spotifyUrl: string;
};

interface ArtistsSectionProps {
    artists: Artist[];
    loading?: boolean;
}

export default function ArtistsSection({ artists, loading = false }: ArtistsSectionProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scrollTargetRef = useRef<number>(0);
    const isScrollingRef = useRef<boolean>(false);
    const rafRef = useRef<number | null>(null); 
    
    if (loading) return <ArtistsSectionSkeleton />;

    const updateScrollButtons = () => {
        const container = containerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
        }
    };

    const smoothScroll = () => {
        const container = containerRef.current;
        if (!container) {
            isScrollingRef.current = false;
            return;
        }

        isScrollingRef.current = true;
        const diff = scrollTargetRef.current - container.scrollLeft;
        const move = diff * 0.22;
        container.scrollLeft += move;

        updateScrollButtons();

        if (Math.abs(diff) > 0.5) {
            requestAnimationFrame(smoothScroll);
        } else {
            isScrollingRef.current = false;
            scrollTargetRef.current = container.scrollLeft;
            rafRef.current = null;
        }
    };

    useEffect(() => {
        updateScrollButtons();

        const container = containerRef.current;
        if (!container) return;

        scrollTargetRef.current = container.scrollLeft;

        let debounceTimer: number | null = null;

        const debouncedUpdateScrollButtons = () => {
            if(debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = window.setTimeout(() => {
                updateScrollButtons();
            }, 50);
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            scrollTargetRef.current += e.deltaY * 2;
            if (!isScrollingRef.current) {
              rafRef.current = requestAnimationFrame(smoothScroll);
            } 
            debouncedUpdateScrollButtons();
        };

        container.addEventListener("scroll", debouncedUpdateScrollButtons);
        container.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("resize", debouncedUpdateScrollButtons);

        return () => {
            container.removeEventListener("scroll", debouncedUpdateScrollButtons);
            container.removeEventListener("wheel", handleWheel);
            window.removeEventListener("resize", debouncedUpdateScrollButtons);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        const container = containerRef.current;
        if (container) {
            const scrollAmount = Math.floor(container.clientWidth * 0.8);

            const newTarget =
                container.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);

            scrollTargetRef.current = newTarget;

            if (!isScrollingRef.current) {
                requestAnimationFrame(smoothScroll);
            }
        }
    };

    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Meus Artistas Favoritos</h2>

            <div className="relative">
                {canScrollLeft && (
                    <button onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
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