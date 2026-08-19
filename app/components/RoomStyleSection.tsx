'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import styles from './RoomStyleSection.module.css';
import RainCanvas from './RainCanvas';

const chairs = ['/chair--1.png', '/chair--2.png', '/chair--3.png', '/chair--4.png'];
const trees  = ['/tree1--1.png', '/tree1--2.png', '/tree1--3.png', '/tree1--4.png'];
const trees2 = ['/tree--2-1.png', '/tree--2-2.png', '/tree--2-3.png', '/tree--2-4.png'];
const decors = ['/decor1.png', '/decor2.png', '/decor3.png', '/decor44.png'];

type SwitchType = 'chair' | 'tree' | 'tree2' | 'decor';

function useSwitch(initial = 0, ref: React.RefObject<HTMLDivElement | null>, type: SwitchType = 'chair') {
  const [idx, setIdx] = useState(initial);

  const change = (next: number) => {
    if (next === idx) return;
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline();

    if (type === 'chair') {
      tl.to(el, { y: 60, opacity: 0, scale: 0.85, duration: 0.4, ease: 'power2.in',
        onComplete: () => setIdx(next) })
        .set(el, { y: -40 })
        .to(el, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' });

    } else if (type === 'tree') {
      tl.to(el, { x: 50, opacity: 0, scaleX: 0.7, duration: 0.4, ease: 'power2.in',
        onComplete: () => setIdx(next) })
        .set(el, { x: -50 })
        .to(el, { x: 0, opacity: 1, scaleX: 1, duration: 0.55, ease: 'power2.out' });

    } else if (type === 'tree2') {
      tl.to(el, { scale: 0.5, opacity: 0, rotation: -12, y: 40, duration: 0.45, ease: 'power3.in',
        onComplete: () => setIdx(next) })
        .set(el, { scale: 1.2, rotation: 10, y: -20 })
        .to(el, { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)' });

    } else if (type === 'decor') {
      tl.to(el, { y: -30, opacity: 0, rotation: 8, scale: 0.8, duration: 0.35, ease: 'power2.in',
        onComplete: () => setIdx(next) })
        .set(el, { y: 20, rotation: -8 })
        .to(el, { y: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
    }
  };

  return { idx, change };
}

export default function RoomStyleSection() {
  const windowRef  = useRef<HTMLImageElement>(null);
  const curtainRef  = useRef<HTMLImageElement>(null);
  const isOpenRef  = useRef(false);
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const [rainOn, setRainOn] = useState(false);

  const toggleWindow = () => {
    if (!windowRef.current) return;
    isOpenRef.current = !isOpenRef.current;
    const isOpen = isOpenRef.current;

    if (isOpen) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/rain.mp3');
        audioRef.current.loop = true;
      }
      audioRef.current.play();
    } else {
      audioRef.current?.pause();
    }

    setRainOn(isOpen);

    gsap.to(windowRef.current, {
      y: isOpen ? '-55%' : '0%',
      rotation: isOpen ? 8 : 0,
      duration: 0.8,
      ease: isOpen ? 'power2.out' : 'power2.in',
    });

    // تحريك الستارة في كل الشاشات
    if (curtainRef.current) {
      const isMobile = window.innerWidth <= 480;
      const translateX = isMobile ? '-10%' : '-5%';
      if (isOpen) {
        gsap.to(curtainRef.current, {
          x: translateX,
          duration: 1.1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(curtainRef.current, {
              rotation: 1.2,
              duration: 2,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              transformOrigin: 'top center',
            });
          },
        });
      } else {
        gsap.killTweensOf(curtainRef.current);
        gsap.to(curtainRef.current, {
          x: '0%',
          rotation: 0,
          duration: 1.1,
          ease: 'power2.inOut',
        });
      }
    }
  };

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { scale: 0.88, borderRadius: '24px' },
      {
        scale: 1,
        borderRadius: '0px',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top 10%',
          scrub: true,
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const chairRef  = useRef<HTMLDivElement>(null);
  const treeRef   = useRef<HTMLDivElement>(null);
  const tree2Ref  = useRef<HTMLDivElement>(null);
  const decorRef  = useRef<HTMLDivElement>(null);

  const chair = useSwitch(0, chairRef, 'chair');
  const tree  = useSwitch(0, treeRef,  'tree');
  const tree2 = useSwitch(0, tree2Ref, 'tree2');
  const decor = useSwitch(0, decorRef, 'decor');

  return (
    <section ref={sectionRef} className={styles.section}>
      <RainCanvas visible={rainOn} />
      <img src="/window-tree-1.png" alt="" className={styles.windowTree} />
      <img src="/window-tree-2.png" alt="" className={styles.windowTree2} />
      <picture>
        <source srcSet="/sec-mobile.png" media="(max-width: 768px)" />
        <img src="/sec4-11.png" alt="" className={styles.bgImg} />
      </picture>
      <img ref={windowRef} src="/window-3.png" alt="" className={styles.windowTop} />
      <img ref={curtainRef} src="/curtain.png" alt="" className={styles.curtain} />
      <div className={styles.windowClickZone} onClick={toggleWindow} />

      {/* الكرسي - منتصف السيكشن */}
      <div ref={chairRef} className={styles.chairWrap}>
        <img src={chairs[chair.idx]} alt="Chair" className={styles.chairImg} />
      </div>
      <div className={styles.chairSelector}>
        {chairs.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${chair.idx === i ? styles.dotActive : ''}`}
            onClick={() => chair.change(i)}
          >
            <img src={chairs[i]} alt={`Chair ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* الشجرة اليسارية */}
      <div ref={tree2Ref} className={`${styles.tree2Wrap} ${styles.hideOnMobile}`}>
        <img src={trees2[tree2.idx]} alt="Tree 2" className={styles.treeImg} />
      </div>
      <div className={`${styles.tree2Selector} ${styles.hideOnMobile}`}>
        {trees2.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${tree2.idx === i ? styles.dotActive : ''}`}
            onClick={() => tree2.change(i)}
          >
            <img src={trees2[i]} alt={`Tree2 ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* الشجرة - يمين السيكشن */}
      <div ref={treeRef} className={styles.treeWrap}>
        <img src={trees[tree.idx]} alt="Tree" className={styles.tree1Img} />
      </div>
      <div className={styles.treeSelector}>
        {trees.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${tree.idx === i ? styles.dotActive : ''}`}
            onClick={() => tree.change(i)}
          >
            <img src={trees[i]} alt={`Tree ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* اللوحات - فوق الشجرة يميناً */}
      <div ref={decorRef} className={`${styles.decorWrap} ${styles.hideOnMobile}`}>
        <img src={decors[decor.idx]} alt="Decor" className={styles.decorImg} />
      </div>
      <div className={`${styles.decorSelector} ${styles.hideOnMobile}`}>
        {decors.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${decor.idx === i ? styles.dotActive : ''}`}
            onClick={() => decor.change(i)}
          >
            <img src={decors[i]} alt={`Decor ${i + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
