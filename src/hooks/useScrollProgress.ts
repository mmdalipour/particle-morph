'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook to track scroll position and convert to smooth 0-1 progress value
 * @param enabled - Whether scroll tracking is enabled
 * @returns Progress value from 0 to 1
 */
export function useScrollProgress(enabled: boolean = true): number {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const quickToRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      return;
    }

    quickToRef.current = gsap.quickTo(progressRef, 'current', {
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(progressRef.current);
      }
    });

    let rafId: number | null = null;
    let lastScrollTime = 0;
    const throttleDelay = 8; // ~120fps throttle for smooth performance

    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollTime < throttleDelay) {
        return;
      }
      lastScrollTime = now;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Calculate scrollable height (total document height minus viewport)
        const scrollableHeight = documentHeight - viewportHeight;

        if (scrollableHeight <= 0) {
          // No scroll available
          if (quickToRef.current) {
            quickToRef.current(0);
          }
          return;
        }

        const rawProgress = scrollY / scrollableHeight;
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));

        if (quickToRef.current) {
          quickToRef.current(clampedProgress);
        }
        
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enabled]);

  return progress;
}

