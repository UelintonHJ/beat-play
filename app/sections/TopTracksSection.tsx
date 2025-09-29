"use client";

import { useUserTopTracks } from "@/hooks/useUserTopTracks";
import SectionSkeleton from "@/components/SectionSkeleton";
import Image from "next/image";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";

type Track = {
    id: string;
    name: string;
    album: { images: { url: string }[] };
    artists: { name: string }[];
};

export default function TopTracksSection() {
    const { tracks, loading, error } = useUserTopTracks(20);

    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
                Músicas mais ouvidas
            </h2>
            <HorizontalScrollSection>
                {loading ? (
                    <SectionSkeleton count={6} cardWidth="w-[192px]" cardHeight="h-[235.99px]" />
                ) : (
                    tracks.map((track) => (
                        <div
                            key={track.id}
                            className="flex-shrink-0 w-48 bg-neutral-900 rounded-lg p-2 hover:bg-neutral-800 hover:scale-105 transition-all duration-200"
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
};