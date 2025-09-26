"use client";

import { useUserTopTracks } from "@/hooks/useUserTopTracks";
import SectionSkeleton from "@/components/SectionSkeleton";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

type TopTracksSectionProps = {
    token: string;
};

export default function TopTracksSection({ token }: TopTracksSectionProps) {
    const { tracks, loading, error } = useUserTopTracks(token);

    const {
        containerRef,
        scrollLeft,
        scrollRight,
        showLeftButton,
        showRightButton,
    } = useSmoothScroll();

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
                Músicas mais ouvidas
            </h2>

            {error && <p className="text-red-500">{error}</p>}

            <div className="relative">
                {showLeftButton && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 transition-all shadow-md"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
                <div className="flex gap-4 overflow-x-hidden px-6" ref={containerRef}>
                    {loading ? (
                        <SectionSkeleton count={6} cardWidth="w-48" cardHeight="h-48" />
                    ) : (
                        tracks.map((track) => (
                            <div
                                key={track.id}
                                className="flex-shrink-0 w-48 bg-neutral-900 rounded-lg p-2"
                            >
                                <Image
                                    src={track.album.images[0]?.url || ""}
                                    alt={track.name}
                                    width={192}
                                    height={192}
                                    className="rounded-lg mb-2"
                                />
                                <p className="text-sm font-medium truncate">{track.name}</p>
                                <p className="text-xs text-neutral-400 truncate">
                                    {track.artists.map((a) => a.name).join(", ")}
                                </p>
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
};