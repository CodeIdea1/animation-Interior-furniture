'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window { lenis: Lenis; }
}

export default function SmoothScroll() {
  useEffect(() => {
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

    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); };
  }, []);

  return null;
}
