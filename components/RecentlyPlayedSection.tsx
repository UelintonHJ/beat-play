"use client";

import { useRecentlyPlayedTracks } from "@/hooks/useRecentlyPlayedTracks";
import SectionSkeleton from "./SectionSkeleton";
import Image from "next/image";
import HorizontalScrollSection from "./HorizontalScrollSection";
import ErrorMessage from "./ErrorMessage";

export default function RecentlyPlayedSection() {
    const { tracks, loading, error } = useRecentlyPlayedTracks(20);

    if (error) {
        return <ErrorMessage message="Erro ao carregar últimas músicas." />
    }

    return (
       <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Últimas músicas ouvidas</h2>
            <HorizontalScrollSection>
                {loading ? (
                    <SectionSkeleton
                        count={6}
                        cardWidth="w-[192px]"
                        cardHeight="h-[235.99px]"
                    />
                ) : (
                    tracks.map((track) => (
                        <div
                            key={track.id}
                            className="flex-shrink-0 w-48 bg-neutral-900 p-2 transition-all duration-200 shadow-md relative rounded-lg hover:bg-neutral-700 cursor pointer"
                        >
                            <Image
                                src={track.album.images[0]?.url}
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
            </HorizontalScrollSection>
       </section> 
    );
}