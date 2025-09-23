"use client";

import { useRef, useState, useEffect } from "react";
import PlaylistCard from "./PlaylistCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scrollTargetRef = useRef<number>(0);
    const isScrollingRef = useRef<boolean>(false);
    const smoothScrollRef = useRef<() => void>(() => {});

    const updateScrollButtons = () => {
        const container = containerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = containerRef.current;
        if (!container) return;

        scrollTargetRef.current = container.scrollLeft;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            scrollTargetRef.current += e.deltaY * 2;
            if (!isScrollingRef) requestAnimationFrame(smoothScrollRef.current);
        };

        const smoothScroll = () => {
            const el = containerRef.current;
            if(!el) {
                isScrollingRef.current = false;
                return;
            }

            isScrollingRef.current = true;
            const diff = scrollTargetRef.current - el.scrollLeft;
            const move = diff * 0.22;
            el.scrollLeft += move;

            if(Math.abs(diff) > 0.5) {
                requestAnimationFrame(smoothScrollRef.current);
            } else {
                isScrollingRef.current = false;
                scrollTargetRef.current = el.scrollLeft;
            }
        };

        smoothScrollRef.current = smoothScroll;

        container?.addEventListener("scroll", updateScrollButtons);
        container?.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            container?.removeEventListener("scroll", updateScrollButtons);
            container?.removeEventListener("wheel", handleWheel);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        const container = containerRef.current;
        if(container) {
            const scrollAmount = Math.floor(container.clientWidth * 0.8);
            const newScroll = container.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);

            scrollTargetRef.current = Math.max(0, Math.min(newScroll, container.scrollWidth - container.clientWidth));

            if(!isScrollingRef.current) requestAnimationFrame(smoothScrollRef.current);
        }
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Minhas Playlists</h2>

            <div className="relative">
                {/* Botão de Voltar */}
                {canScrollLeft && (
                    <button 
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md hover:shadow-[0_0_8px_rgba(72,239,128,0.9)]" 
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                {/* Container horizontal com overflow oculto */}
                <div className="flex gap-4 overflow-x-hidden px-6" ref={containerRef}>
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
                {canScrollRight && (
                    <button onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md hover:shadow-[0_0_8px_rgba(72,239,128,0.9)]"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </section>
    );
}