import { useEffect, useRef, type RefObject } from "react";

interface Options {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

/**
 * Observes a marker element and triggers onLoadMore before the user
 * actually reaches it — rootMargin extends the trigger zone by one
 * viewport height below the marker.
 */
export function useInfiniteScroll({ hasMore, isLoading, onLoadMore }: Options): RefObject<HTMLDivElement> {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) onLoadMore();
      },
      { root: null, rootMargin: `0px 0px ${window.innerHeight}px 0px`, threshold: 0 }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return markerRef;
}