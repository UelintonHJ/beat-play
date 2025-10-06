"use client";

import ErrorMessage from "@/components/ErrorMessage";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import SectionSkeleton from "@/components/SectionSkeleton";
import { useWeeklyReleases } from "@/hooks/useWeeklyReleases";
import Image from "next/image";

export default function WeeklyReleasesSection() {
    const { tracks, loading, error } = useWeeklyReleases(20);

    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Lançamentos da Semana</h2>
            {error ? (
                <ErrorMessage message="Erro ao carregar lançamentos." type="error" className="mb-6" />
            ) : (
                <HorizontalScrollSection>
                    {loading ? (
                        <SectionSkeleton
                            count={8}
                            cardWidth="w-[192px]"
                            cardHeight="h-[235.99px]"
                        />
                    ) : (
                        tracks.map(track => (
                            <div
                                key={track.id}
                                className="flex-shrink-0 w-48 bg-neutral-900 p-2 transition-all duration-200 shadow-md relative rounded-lg hover:bg-neutral-700 cursor-pointer"
                            >
                                <Image
                                    src={track.album.images[0]?.url}
                                    alt={track.name}
                                    width={192}
                                    height={192}
                                    className="rounded-lg mb-2"
                                />
                                <p className="text-sm font-medium truncate">{track.name}</p>
                                <p className="text-xs font-neutral-400 truncate">
                                    {track.artists.map(a => a.name).join(", ")}
                                </p>
                            </div>
                        ))
                    )}
                </HorizontalScrollSection>
            )}
        </section>
    )
}