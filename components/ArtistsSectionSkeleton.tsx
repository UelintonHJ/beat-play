"use client";

export default function ArtistsSectionSkeleton() {
    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Meus Artistas Favoritos</h2>
            
            <div className="flex gap-4 overflow-x-hidden px-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-2 w-32 animate-pulse" />
                ))}
            </div>
        </section>
    );
}