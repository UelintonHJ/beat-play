import { Currency } from "lucide-react";
import { useRef, useState, useCallback, useEffect, } from "react";

export function useSmoothScroll() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollTargetRef = useRef(0);
    const isScrollingRef = useRef<false | "button" | "wheel">(false);
    const rafRef = useRef<number | null>(null);

    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const updateScrollButtons = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
    }, []);

    const smoothScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const diff = scrollTargetRef.current - container.scrollLeft;

        if (Math.abs(diff) < 1) {
            container.scrollLeft = scrollTargetRef.current;
            isScrollingRef.current = false;
            updateScrollButtons();
            return;
        }

        if (isScrollingRef.current === "button") {
            const move = Math.sign(diff) * Math.min(Math.abs(diff), 80);
            container.scrollLeft += move;
        } else {
            container.scrollLeft += diff * 0.2;
        }

        updateScrollButtons();
        rafRef.current = requestAnimationFrame(smoothScroll);
    }, [updateScrollButtons]);

    const scrollLeft = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        isScrollingRef.current = "button";
        scrollTargetRef.current = Math.max(
            0,
            container.scrollLeft - container.clientWidth
        );
        requestAnimationFrame(smoothScroll);
    }, [smoothScroll]);

    const scrollRight = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        isScrollingRef.current = "button";
        scrollTargetRef.current = Math.min(
            container.scrollWidth - container.clientWidth,
            container.scrollLeft + container.clientWidth
        );
        requestAnimationFrame(smoothScroll);
    }, [smoothScroll]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        scrollTargetRef.current = container.scrollLeft;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const maxScroll = container.scrollWidth - container.clientWidth;
            scrollTargetRef.current = Math.max(
                0,
                Math.min(scrollTargetRef.current + e.deltaY * 1.5, maxScroll)
            );

            updateScrollButtons();

            isScrollingRef.current = "wheel";
            rafRef.current = requestAnimationFrame(smoothScroll);
        };

        updateScrollButtons();
        container.addEventListener("scroll", updateScrollButtons);
        container.addEventListener("wheel", handleWheel);
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            container.removeEventListener("scroll", updateScrollButtons);
            container.removeEventListener("wheel", handleWheel);
            window.removeEventListener("resize", updateScrollButtons);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            isScrollingRef.current = false;
        };
    }, [smoothScroll, updateScrollButtons]);

    return {
        containerRef,
        scrollLeft,
        scrollRight,
        showLeftButton,
        showRightButton,
    };
}