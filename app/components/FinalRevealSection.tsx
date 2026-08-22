'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FinalRevealSection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DESKTOP_IMAGES = ['/sec6-in2.png', '/sec6-1111.webp', '/sec6-2222.webp', '/door-1-1.webp', '/door-1-2.webp'];
const MOBILE_IMAGES  = ['/sec6-in2.png', '/sec6-mobile-1.webp', '/sec6-mobile-2.webp', '/door-1-1.webp', '/door-1-2.webp'];

const SCROLL_LENGTH_VH = 220;

export default function FinalRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const fgImgRef = useRef<HTMLImageElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const doorLeftRef = useRef<HTMLImageElement>(null);
  const doorRightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    (isMobile ? MOBILE_IMAGES : DESKTOP_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
      if ('decode' in img) {
        img.decode().catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const fgImg = fgImgRef.current;
    const zoomWrap = zoomWrapRef.current;
    const doorLeft = doorLeftRef.current;
    const doorRight = doorRightRef.current;
    if (!section || !fgImg || !zoomWrap || !doorLeft || !doorRight) return;

    gsap.set(fgImg, { opacity: 0 });
    gsap.set(zoomWrap, { transformOrigin: 'center center' });
    gsap.set(doorLeft, { transformOrigin: 'center center', skewX: 0 });
    gsap.set(doorRight, { transformOrigin: 'center center', skewX: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${SCROLL_LENGTH_VH}%`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(fgImg, { opacity: 1, ease: 'power1.inOut' }, 0)
      .to(zoomWrap, { scale: 11.5, xPercent: -277, yPercent: -55, ease: 'power2.inOut'}, 1)
      .to(doorLeft, { skewX: -73, rotate: -72, scale: 0.3, translateX: -40, ease: 'power1.inOut', duration: 0.3 }, 1)
      .to(doorRight, { skewX: 73,  rotate: 72, scale: 0.3, translateX: 40, ease: 'power1.inOut', duration: 0.3 }, 1)
      .to(zoomWrap, { opacity: 0, ease: 'power1.inOut',  }, 2);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([fgImg, zoomWrap, doorLeft, doorRight], { clearProps: 'all' });
    };
  }, []);

  return (
    <section ref={sectionRef} id="finale" className={styles.section}>
      <img src="/sec6-in2.png" alt="" className={styles.staticImg} draggable={false} decoding="async" />
      <div ref={zoomWrapRef} className={styles.zoomWrap}>
        <picture>
          <source srcSet="/sec6-mobile-1.webp" media="(max-width: 768px)" />
          <img src="/sec6-111.webp" alt="" className={styles.bgImg} draggable={false} decoding="async" />
        </picture>
        <picture>
          <source srcSet="/sec6-mobile-2.webp" media="(max-width: 768px)" />
          <img ref={fgImgRef} src="/sec6-2222.webp" alt="" className={styles.fgImg} draggable={false} decoding="async" />
        </picture>
        <div className={styles.doorWrap}>
          <img ref={doorLeftRef} src="/door-1-1.webp" alt="" className={styles.doorLeaf} draggable={false} decoding="async" />
          <img ref={doorRightRef} src="/door-1-2.webp" alt="" className={styles.doorLeaf} draggable={false} decoding="async" />
        </div>
      </div>
    </section>
  );
}
