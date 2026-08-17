'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './SecondSection.module.css';

const slides = [
  { image: '/22-2.png', label: 'Living Room', labelColor: '#C9A96E', title: 'Elevated\nLiving Spaces', btn: 'Explore Collection' },
  { image: '/333.png', label: 'Dining', labelColor: '#8B7355', title: 'Where Every Meal\nBecomes A Memory', btn: 'See Dining Sets' },
  { image: '/111-1.png', label: 'Bedroom', labelColor: '#6B8E7F', title: 'Serenity Crafted\nIn Every Detail', btn: 'Discover Pieces' },
  { image: '/444.png', label: 'Studio', labelColor: '#7A8B9A', title: 'Where Ideas\nTake Shape', btn: 'View Studio' },
];

const SECTION_START = 4.8;
const SCROLL_RANGE  = 5.5;
const FROZEN_RANGE  = 0.8;
const SECTION_END   = SECTION_START + SCROLL_RANGE;
const FROZEN_END    = SECTION_END + FROZEN_RANGE;

export default function SecondSection() {
  const [isVisible,   setIsVisible]   = useState(false);
  const [isDone,      setIsDone]      = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [titleDir,    setTitleDir]    = useState<'up' | 'down'>('up');
  const [clips,       setClips]       = useState([0, 100, 100, 100]);

  const lineRef        = useRef<HTMLDivElement>(null);
  const textTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(0);
  const prevScrollRef  = useRef(0);
  const pendingIndexRef = useRef(0);

  useEffect(() => {
    // انتظر حتى يكون lenis جاهزاً
    const init = () => {
      if (!window.lenisInstance) { setTimeout(init, 100); return; }

      window.lenisInstance.on('scroll', ({ scroll }: { scroll: number }) => {
        const scrollY   = scroll;
        const wh        = window.innerHeight;
        const goingDown = scrollY > prevScrollRef.current;
        prevScrollRef.current = scrollY;

        // موقع ThirdSection الحقيقي في DOM
        const thirdEl = document.querySelector('[data-section="third"]') as HTMLElement;
        const THIRD_START = thirdEl
          ? (thirdEl.getBoundingClientRect().top + scrollY) / wh
          : 9999;

        // DEBUG
        if (Math.round(scrollY / wh * 10) % 20 === 0) {
          console.log(`lenis scroll: ${(scrollY/wh).toFixed(1)}vh | THIRD_START: ${THIRD_START.toFixed(1)}vh | visible: ${scrollY > wh * SECTION_START && scrollY < wh * SECTION_END} | done: ${scrollY >= wh * THIRD_START}`);
        }

        const nowVisible = scrollY > wh * SECTION_START && scrollY < wh * SECTION_END;
        const frozen     = scrollY >= wh * SECTION_END  && scrollY < wh * FROZEN_END;
        const done       = scrollY >= wh * FROZEN_END;

        setIsVisible(nowVisible || frozen);
        setIsDone(done);

        if (!nowVisible && !frozen) {
          if (textTimerRef.current) { clearTimeout(textTimerRef.current); textTimerRef.current = null; }
          setTextVisible(false);
        }

        if (nowVisible) {
          const totalProgress = Math.min((scrollY - wh * SECTION_START) / (wh * SCROLL_RANGE), 1);
          const newIndex = Math.min(Math.floor(totalProgress * slides.length), slides.length - 1);

          if (newIndex !== activeIndexRef.current) {
            const dir = goingDown ? 'up' : 'down';
            activeIndexRef.current = newIndex;
            pendingIndexRef.current = newIndex;
            setTitleDir(dir);
            setTextVisible(false);
            if (textTimerRef.current) clearTimeout(textTimerRef.current);
            textTimerRef.current = setTimeout(() => {
              setActiveIndex(pendingIndexRef.current);
              setTextVisible(true);
              textTimerRef.current = null;
            }, 180);
          } else if (!textTimerRef.current) {
            setActiveIndex(newIndex);
            setTextVisible(true);
          }

          const newClips = slides.map((_, i) => {
            if (i === 0) return 0;
            const sp = Math.min(Math.max((totalProgress * slides.length) - i, 0), 1);
            return Math.round((1 - sp) * 100);
          });
          setClips(newClips);
          if (lineRef.current) lineRef.current.style.width = `${totalProgress * 100}%`;
        }
      });
    };

    init();
    return () => { if (textTimerRef.current) clearTimeout(textTimerRef.current); };
  }, []);

  return (
    <section className={`${styles.secondSection} ${isVisible ? styles.visible : ''} ${isDone ? styles.done : ''}`}>

      {slides.map((slide, i) => (
        <div key={i} className={styles.imageWrapper} style={{ zIndex: i + 1, clipPath: `inset(${clips[i]}% 0 0 0)` }}>
          <img src={slide.image} alt={slide.title} className={styles.image} />
        </div>
      ))}

      <div className={styles.overlay} />

      <div className={styles.progressLine}>
        <div ref={lineRef} className={styles.progressLineFill} />
      </div>

      <div style={{ position: 'absolute', bottom: '60%', left: '2%', zIndex: 60, opacity: textVisible ? 1 : 0, transition: 'opacity 0.9s ease', overflow: 'hidden', height: '2rem', display: 'flex', alignItems: 'center' }}>
        <span key={`counter-${activeIndex}-${titleDir}`} className={titleDir === 'up' ? styles.counterUp : styles.counterDown} style={{ fontSize: '1.4rem', fontWeight: 500, color: '#ffffff', letterSpacing: '0.1em', display: 'block' }}>
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
      </div>

      <div className={`${styles.textBox} ${textVisible ? styles.textBoxVisible : ''}`}>
        <div key={`label-${activeIndex}-${titleDir}`} className={styles.topLabel} style={{ background: slides[activeIndex].labelColor }}>
          <span className={styles.topLabelDot} />
          {slides[activeIndex].label}
        </div>
        <h2 key={`title-${activeIndex}-${titleDir}`} className={`${styles.title} ${titleDir === 'up' ? styles.fadeUp : styles.fadeDown}`}>
          {slides[activeIndex].title.split('\n').map((line, i) => (
            <span key={i} className={styles.titleLine}>{line}</span>
          ))}
        </h2>
        <div key={`btn-${activeIndex}-${titleDir}`} className={`${styles.btnWrap} ${titleDir === 'up' ? styles.btnEnterUp : styles.btnEnterDown}`}>
          <button className={styles.btn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            {slides[activeIndex].btn}
          </button>
        </div>
      </div>

    </section>
  );
}
