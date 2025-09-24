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

    const updateScrollButtons = () => {
        const container = containerRef.current;
        if (container) {
            const tolerance = 1;
            setCanScrollLeft(container.scrollLeft > tolerance);
            setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
        }
    };

    const smoothScroll = () => {
        const container = containerRef.current;
        if (!container) {
            isScrollingRef.current = false;
            return;
        }

        const diff = scrollTargetRef.current - container.scrollLeft;
        if (Math.abs(diff) < 0.5) {
            container.scrollLeft - scrollTargetRef.current;
            isScrollingRef.current = false;
            updateScrollButtons();
            return;
        }

        const move = diff * 0.15;
        container.scrollLeft += move;
        updateScrollButtons();

        rafRef.current = requestAnimationFrame(smoothScroll);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        scrollTargetRef.current = container.scrollLeft;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const maxScroll = container.scrollWidth - container.clientWidth;
            scrollTargetRef.current = Math.max(0, Math.min(scrollTargetRef.current += e.deltaY * 2, maxScroll));

            if (!isScrollingRef.current) {
                isScrollingRef.current = true;
                rafRef.current = requestAnimationFrame(smoothScroll);
            }
        };

        const handleScroll = () => {
            if (!scrollTargetRef.current) {
                scrollTargetRef.current = container.scrollLeft;
            }
            updateScrollButtons();
        };

        const handleResize = () => {
            scrollTargetRef.current = container.scrollLeft;
            updateScrollButtons();
        }

        container.addEventListener("scroll", handleScroll);
        container.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("resize", handleResize);

        updateScrollButtons();

        return () => {
            container.removeEventListener("scroll", handleScroll);
            container.removeEventListener("wheel", handleWheel);
            window.removeEventListener("resize", handleResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            isScrollingRef.current = false;
        };
    }, [artists]);

    const scroll = (direction: "left" | "right") => {
        const container = containerRef.current;
        if (!container) return;

        const scrollAmount = Math.floor(container.clientWidth * 0.8);
        const maxScroll = container.scrollWidth - container.clientWidth;

        const newTarget = container.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
        scrollTargetRef.current = Math.max(0, Math.min(newTarget, maxScroll));

        if (!isScrollingRef.current) {
            isScrollingRef.current = true;
            rafRef.current = requestAnimationFrame(smoothScroll);
        }
    };

    if (loading) {
        return artists.length > 0 ? (
            <ArtistsSectionSkeleton count={Math.min(artists.length, 8)} />
        ) : null;
    }

    if (!artists.length) {
        return null;
    }

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

                {/* Container */}
                {artists.length > 0 ? (
                    <div
                        className="flex gap-4 overflow-x-auto scrollbar-hidden px-6"
                        ref={containerRef}
                        style={{ overflowY: 'hidden', scrollBehavior: 'auto' }}
                    >
                        {artists.map((artist) => (
                            <div key={artist.id} className="flex-shrink-0">
                                <ArtistCard
                                    name={artist.name}
                                    image={artist.image}
                                    spotifyUrl={artist.spotifyUrl}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 whitespace-nowrap">
                        Nenhum artista encontrado.
                    </p>
                )}
                
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