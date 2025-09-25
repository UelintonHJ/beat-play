"use client";

type SectionSkeletonProps = {
    count?: number;
    cardWidth?: string;
    cardHeight?: string;
};

export default function SectionSkeleton({
    count = 8,
    cardWidth = "w-40",
    cardHeight = "h-h2",
}: SectionSkeletonProps) {
    return (
        <div className="flex gap-4 overflow-x-hidden px-6">
            {Array.from({ length: count }).map((_, index) => (
                <div 
                    key={index}
                    className={`flex-shrink-0 ${cardWidth} ${cardHeight} bg-neutral-800 rounded-lg animate-pulse`}
                />
            ))}
        </div>
    )
}