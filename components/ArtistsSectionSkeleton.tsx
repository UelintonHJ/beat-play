"use client";

import { count } from "console";

export default function ArtistsSectionSkeleton({ count = 5 }: { count?: number }) {
    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Meus Artistas Favoritos</h2>
            
            <div className="flex gap-4 overflow-x-hidden px-6">
                {Array.from({ length: count }).map((_, idx) => (
                    <div key={idx} className="w-32 h-40 flex-shrink-0 rounded-lg bg-neutral-800 shadow-md animate-pulse" />
                ))}
            </div>
        </section>
    );
}