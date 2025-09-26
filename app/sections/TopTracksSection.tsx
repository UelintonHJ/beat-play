"use client";

import { useUserTopTracks } from "@/hooks/useUserTopTracks";
import SectionSkeleton from "@/components/SectionSkeleton";
import Image from "next/image";

type TopTracksSectionProps = {
    token: string;
};

export default function TopTracksSection({ token }: TopTracksSectionProps) {
    const { tracks, loading, error } = useUserTopTracks(token);

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
                Músicas mais ouvidas
            </h2>

            {loading && (
                <div className="flex gap-4 overflow-x-auto">
                    <SectionSkeleton count={6} cardWidth="w-48" cardHeight="h-48"/>
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="flex gap-4 overflow-x-auto">
                    {tracks.map((track) => (
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
                                {track.artist.map((a) => a.name).join(", ")}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};