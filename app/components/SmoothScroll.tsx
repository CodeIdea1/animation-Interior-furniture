'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window { lenisInstance: Lenis; }
}

export default function SmoothScroll() {
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      // على الموبايل: لا Lenis، نستخدم native scroll
      // نعمل lenisInstance وهمي يستمع لـ native scroll
      const fakeScroll = { scroll: window.scrollY };
      const listeners: Array<(e: { scroll: number }) => void> = [];
      const handler = () => {
        fakeScroll.scroll = window.scrollY;
        listeners.forEach(fn => fn({ scroll: window.scrollY }));
      };
      window.addEventListener('scroll', handler, { passive: true });
      window.lenisInstance = {
        on: (_: string, fn: (e: { scroll: number }) => void) => { listeners.push(fn); },
      } as unknown as Lenis;
      return () => window.removeEventListener('scroll', handler);
    }

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.4,
      touchMultiplier: 2,
      infinite: false,
    });

    window.lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); };
  }, []);

  return null;
}
