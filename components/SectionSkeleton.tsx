"use client";

type SectionSkeletonProps = {
    count?: number;
    cardWidth?: string;
    cardHeight?: string;
};

export default function SectionSkeleton({
    count = 8,
    cardWidth = "w-40",
    cardHeight = "h-60",
}: SectionSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div 
                    key={index}
                    className={`flex-shrink-0 ${cardWidth} ${cardHeight} bg-neutral-800 rounded-lg animate-pulse`}
                />
            ))}
        </>
    )
}