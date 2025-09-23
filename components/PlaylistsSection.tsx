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
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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
        container?.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);
        return () => {
            container?.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        const container = containerRef.current;
        if(container) {
            const scrollAmount = Math.floor(container.clientWidth * 0.8);
            container.scrollBy({
                left: direction === "right" ? scrollAmount : -scrollAmount,
                behavior: "smooth",
            });
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
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]" 
                    >
                        <ChevronLeft size={18} className="transition-colors group-hover:text-emerald-400"/>
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
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                    >
                        <ChevronRight size={18} className="transition-colors group-hover:text-emerald-400"/>
                    </button>
                )}
            </div>
        </section>
    );
}