import React, { useEffect, useRef } from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface FlashDealsMarqueeProps {
  products: Product[];
  /** Auto-scroll speed in px/sec (default 26) */
  speedPxPerSec?: number;
  /** Pause duration in ms after manual user scroll before resuming (default 3500) */
  resumeDelayMs?: number;
  /** Visible container height in px (~3 rows = 172px) */
  heightPx?: number;
}

/**
 * Infinite vertically auto-scrolling & manually scrollable Flash Deals list.
 * Renders 3 copies of `products` and wraps scrollTop around the middle copy so
 * both auto-scroll and manual wheel/touch scrolling loop seamlessly without hitting a bottom.
 * Any user touch/pointer/wheel interaction pauses auto-scroll and resumes after `resumeDelayMs`.
 */
export const FlashDealsMarquee: React.FC<FlashDealsMarqueeProps> = ({
  products,
  speedPxPerSec = 26,
  resumeDelayMs = 3500,
  heightPx = 172,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);
  const isUserHoldingRef = useRef(false);
  const pausedUntilRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const subPixelRef = useRef(0);

  const pauseAutoScroll = () => {
    pausedUntilRef.current = performance.now() + resumeDelayMs;
  };

  useEffect(() => {
    const el = containerRef.current;
    const setEl = singleSetRef.current;
    if (!el || !setEl || products.length === 0) return;

    const getSetHeight = () => setEl.offsetHeight;

    // Start at the beginning of the middle copy so user can scroll freely up OR down
    const initialSetH = getSetHeight();
    if (initialSetH > 0) {
      isProgrammaticScrollRef.current = true;
      el.scrollTop = initialSetH;
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    }

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 64); // clamp delta when tab resumes
      lastTime = now;

      const setH = getSetHeight();
      if (setH > 0) {
        if (!isUserHoldingRef.current && now >= pausedUntilRef.current) {
          subPixelRef.current += (speedPxPerSec * dt) / 1000;
          const wholePx = Math.floor(subPixelRef.current);
          if (wholePx >= 1) {
            subPixelRef.current -= wholePx;
            isProgrammaticScrollRef.current = true;
            let nextTop = el.scrollTop + wholePx;
            if (nextTop >= setH * 2) {
              nextTop -= setH;
            }
            el.scrollTop = nextTop;
            isProgrammaticScrollRef.current = false;
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [products.length, speedPxPerSec]);

  const handleScroll = () => {
    const el = containerRef.current;
    const setEl = singleSetRef.current;
    if (!el || !setEl) return;

    const setH = setEl.offsetHeight;
    if (setH <= 0) return;

    if (!isProgrammaticScrollRef.current) {
      pauseAutoScroll();
    }

    // Seamless infinite wrap in both directions
    if (el.scrollTop >= setH * 2) {
      isProgrammaticScrollRef.current = true;
      el.scrollTop -= setH;
      isProgrammaticScrollRef.current = false;
    } else if (el.scrollTop < setH * 0.25) {
      isProgrammaticScrollRef.current = true;
      el.scrollTop += setH;
      isProgrammaticScrollRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      onWheel={pauseAutoScroll}
      onTouchStart={() => {
        isUserHoldingRef.current = true;
        pauseAutoScroll();
      }}
      onTouchEnd={() => {
        isUserHoldingRef.current = false;
        pauseAutoScroll();
      }}
      onPointerDown={() => {
        isUserHoldingRef.current = true;
        pauseAutoScroll();
      }}
      onPointerUp={() => {
        isUserHoldingRef.current = false;
        pauseAutoScroll();
      }}
      onPointerCancel={() => {
        isUserHoldingRef.current = false;
        pauseAutoScroll();
      }}
      style={{ height: `${heightPx}px` }}
      className="bg-white rounded-[10px] overflow-y-auto no-scrollbar overscroll-contain touch-pan-y"
    >
      {[0, 1, 2].map((copyIdx) => (
        <div
          key={copyIdx}
          ref={copyIdx === 0 ? singleSetRef : undefined}
          className="divide-y divide-[#F3F3F3] border-b border-[#F3F3F3]"
        >
          {products.map((p) => (
            <ProductCard
              key={`${copyIdx}-${p.id}`}
              product={p}
              variant="row"
              className="rounded-none"
            />
          ))}
        </div>
      ))}
    </div>
  );
};
