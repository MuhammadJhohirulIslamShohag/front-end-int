import { useRef, useState, useLayoutEffect, useCallback, type ReactNode } from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const OVERSCAN_PX = 800;
const DEFAULT_ESTIMATED_HEIGHT = 300;

interface Props {
  postIds: string[];
  totalCount?: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  renderPost: (id: string, meta: { posinset: number; setsize: number }) => ReactNode;
}

export function VirtualizedFeedList({ postIds, totalCount, hasMore, isLoading, onLoadMore, renderPost }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heightsRef = useRef<Map<string, number>>(new Map());
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const markerRef = useInfiniteScroll({ hasMore, isLoading, onLoadMore });

  useLayoutEffect(() => {
    const onScroll = () => setScrollTop(window.scrollY);
    const onResize = () => setViewportHeight(window.innerHeight);
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const offsets: { id: string; top: number; height: number }[] = [];
  let runningTop = 0;
  for (const id of postIds) {
    const h = heightsRef.current.get(id) ?? DEFAULT_ESTIMATED_HEIGHT;
    offsets.push({ id, top: runningTop, height: h });
    runningTop += h;
  }
  const totalHeight = runningTop;

  const windowTop = containerRef.current
    ? containerRef.current.getBoundingClientRect().top + window.scrollY
    : 0;
  const visibleStart = scrollTop - windowTop - OVERSCAN_PX;
  const visibleEnd = scrollTop - windowTop + viewportHeight + OVERSCAN_PX;

  const [, forceRerender] = useState(0);
  const measureRef = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      if (!node) return;
      const measured = node.getBoundingClientRect().height;
      if (measured > 0 && heightsRef.current.get(id) !== measured) {
        heightsRef.current.set(id, measured);
        forceRerender((n) => n + 1);
      }
    },
    []
  );

  return (
    <div
      id="feed"
      ref={containerRef}
      role="feed"
      aria-label="Home feed"
      aria-busy={isLoading}
      tabIndex={-1}
      style={{ position: "relative", width: "100%" }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {offsets.map(({ id, top, height }, index) => {
          const isVisible = top + height >= visibleStart && top <= visibleEnd;
          return (
            <div key={id} style={{ position: "absolute", top, left: 0, right: 0, minHeight: height }}>
              {isVisible ? (
                <div ref={measureRef(id)}>
                  {renderPost(id, { posinset: index + 1, setsize: totalCount ?? -1 })}
                </div>
              ) : (
                <div style={{ height }} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {hasMore && <div ref={markerRef} style={{ height: 1 }} aria-hidden="true" />}
      {isLoading && <p role="status">Loading more posts…</p>}
      {!hasMore && postIds.length > 0 && <p>You're all caught up.</p>}
    </div>
  );
}