import { useRef, useState, useCallback, useEffect, use } from "react";

export function useSmoothScroll() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollTargetRef = useRef(0);
    const isScrollingRef = useRef<false | "button">(false);

    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const updateScrollButtons = useCallback(() => {
        const container = containerRef.current;
        if(!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
    }, []);

    const smoothScroll = useCallback(() => {
        const container = containerRef.current;
        if(!container) return;

        const diff = scrollTargetRef.current - container.scrollLeft;

        if(Math.abs(diff) < 1) {
            container.scrollLeft = scrollTargetRef.current;
            isScrollingRef.current = false;
            updateScrollButtons();
            return;
        }

        container.scrollLeft += diff * 0.2;
        requestAnimationFrame(smoothScroll);
    }, [updateScrollButtons]);

    const scrollLeft = useCallback(() => {
        const container = containerRef.current;
        if(!container) return;
        isScrollingRef.current = "button";
        scrollTargetRef.current = Math.max(
            0,
            container.scrollLeft - container.clientWidth
        );
        requestAnimationFrame(smoothScroll);
    }, [smoothScroll]);

    const scrollRight = useCallback(() => {
        const container = containerRef.current;
        if(!container) return;
        isScrollingRef.current = "button";
        scrollTargetRef.current = Math.min(
            container.scrollWidth - container.clientWidth,
            container.scrollLeft + container.clientWidth
        );
        requestAnimationFrame(smoothScroll);
    }, [smoothScroll]);

    useEffect(() => {
        const container = containerRef.current;
        if(!container) return;

        updateScrollButtons();
        container.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            container.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, [updateScrollButtons]);

    return {
        containerRef,
        scrollLeft,
        scrollRight,
        showLeftButton,
        showRightButton,
    };
}