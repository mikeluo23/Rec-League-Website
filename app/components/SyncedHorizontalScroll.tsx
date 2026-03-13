"use client";

import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type SyncedHorizontalScrollProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  topScrollbarClassName?: string;
  topScrollbarRef?: RefObject<HTMLDivElement | null>;
  style?: CSSProperties;
};

export default function SyncedHorizontalScroll({
  children,
  className = "",
  contentClassName = "",
  topScrollbarClassName = "",
  topScrollbarRef,
  style,
}: SyncedHorizontalScrollProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const internalTopScrollbarRef = useRef<HTMLDivElement | null>(null);
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useLayoutEffect(() => {
    const updateMetrics = () => {
      const contentWidth = contentRef.current?.scrollWidth ?? 0;
      const viewportWidth = bottomRef.current?.clientWidth ?? 0;
      const nextMax = Math.max(contentWidth - viewportWidth, 0);

      setMaxScrollLeft(nextMax);
      setScrollLeft(Math.min(bottomRef.current?.scrollLeft ?? 0, nextMax));
    };

    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);

    if (contentRef.current) observer.observe(contentRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!topScrollbarRef) return;
    topScrollbarRef.current = internalTopScrollbarRef.current;

    return () => {
      topScrollbarRef.current = null;
    };
  }, [topScrollbarRef]);

  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom) return;

    const syncFromBottom = () => {
      setScrollLeft(bottom.scrollLeft);
    };

    bottom.addEventListener("scroll", syncFromBottom, { passive: true });

    return () => {
      bottom.removeEventListener("scroll", syncFromBottom);
    };
  }, []);

  return (
    <div className={className} style={style}>
      <div ref={internalTopScrollbarRef} className={topScrollbarClassName}>
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            Scroll Stats
          </span>
          <input
            aria-label="Horizontal table scroll"
            className="h-2 w-full cursor-pointer accent-sky-400"
            type="range"
            min={0}
            max={Math.max(maxScrollLeft, 1)}
            step={1}
            value={Math.min(scrollLeft, Math.max(maxScrollLeft, 1))}
            disabled={maxScrollLeft <= 0}
            onChange={(event) => {
              const nextScrollLeft = Number(event.target.value);
              setScrollLeft(nextScrollLeft);
              if (bottomRef.current) bottomRef.current.scrollLeft = nextScrollLeft;
            }}
          />
          <span className="w-10 text-right text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            {maxScrollLeft > 0
              ? `${Math.round((scrollLeft / maxScrollLeft) * 100)}%`
              : "Fit"}
          </span>
        </div>
      </div>
      <div ref={bottomRef} className={contentClassName}>
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
