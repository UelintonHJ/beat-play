"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

interface HorizontalScrollSectionProps {
    children: React.ReactNode;
}

export default function HorizontalScrollSection({ children }: HorizontalScrollSectionProps) {
    const { containerRef, scrollLeft, scrollRight, showLeftButton, showRightButton } = useSmoothScroll();

    return (
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
                {children}
            </div>

            {showRightButton && (
                <button 
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white w-10 h-10 flex items-center justify-center ronded-full z-10 transition-all shadow-md"
                >
                    <ChevronRight size={18} />
                </button>
            )}
        </div>
    );
}

