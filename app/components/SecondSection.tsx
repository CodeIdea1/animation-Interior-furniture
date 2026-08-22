'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SecondSection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const slides = [
  { image: '/22-2.webp',  label: 'Living Room', labelColor: '#C9A96E', title: 'Elevated\nLiving Spaces',          btn: 'Explore Collection' },
  { image: '/333.webp',   label: 'Dining',      labelColor: '#8B7355', title: 'Where Every Meal\nBecomes A Memory', btn: 'See Dining Sets'     },
  { image: '/111-1.webp', label: 'Bedroom',     labelColor: '#6B8E7F', title: 'Serenity Crafted\nIn Every Detail',  btn: 'Discover Pieces'    },
  { image: '/444.webp',   label: 'Studio',      labelColor: '#7A8B9A', title: 'Where Ideas\nTake Shape',           btn: 'View Studio'        },
];

// كل انتقال بين كارت وكارت ياخد كام % من ارتفاع الشاشة سكرول (نفس فلسفة الهيرو: end بالنسبة المئوية)
const VH_PER_TRANSITION = 100;
// هولد بسيط بعد آخر كارت قبل ما نسيب السيكشن يتحرر طبيعي للي بعده (شعور "استقرار" مش قفزة)
const HOLD_AFTER_LAST = 35;

export default function SecondSection() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [titleDir, setTitleDir] = useState<'up' | 'down'>('up');

  const sectionRef = useRef<HTMLDivElement>(null);
  // ★ جديد: wrapper غير مُثبَّت يلف السيكشن الديسكتوب فقط، وعليه الـ margin-top
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Mobile refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.killTweensOf('*');
      setIsMobile(e.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ══════════════════════════════════════════════════════════
  // DESKTOP: pin حقيقي بـ ScrollTrigger — دخول وخروج طبيعي 100%
  // نفس أسلوب pin السيكشن الأول بالظبط، بدون أي fixed/top يدوي
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (isMobile) return;
    if (!sectionRef.current) return;

    const cards = imageRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (cards.length !== slides.length) return;

    const transitions = slides.length - 1; // عدد الانتقالات بين الكروت
    const totalVh = transitions * VH_PER_TRANSITION + HOLD_AFTER_LAST;
    const tweenFraction = (transitions * VH_PER_TRANSITION) / totalVh;

    // الحالة الابتدائية: أول كارت ظاهر بالكامل، الباقي مخفي من تحت بـ clip-path
    gsap.set(cards[0], { clipPath: 'inset(0% 0 0 0)' });
    gsap.set(cards.slice(1), { clipPath: 'inset(100% 0 0 0)' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalVh}%`,
        scrub: 0.6,
        pin: true,
        // ★ يمنع القفزة اللحظية اللي بتحصل عند الـ pin/unpin بسبب عدم دقة
        // القياسات وقت السكرول السريع
        anticipatePin: 1,
        // ★ إجراء وقائي إضافي: يجبر ScrollTrigger يعيد حساب كل القياسات
        // (بما فيها الـ pin-spacer) عند أي refresh بدل الاعتماد على كاش قديم
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const tweenProgress = Math.min(self.progress / tweenFraction, 1);

          if (lineRef.current) {
            lineRef.current.style.width = `${tweenProgress * 100}%`;
          }

          const raw = tweenProgress * transitions;
          const newIndex = raw <= 0 ? 0 : Math.min(Math.ceil(raw - 0.001), transitions);

          if (newIndex !== activeIndexRef.current) {
            activeIndexRef.current = newIndex;
            setTitleDir(self.direction === 1 ? 'up' : 'down');
            setTextVisible(false);

            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
              setActiveIndex(newIndex);
              rafRef.current = requestAnimationFrame(() => setTextVisible(true));
            });
          }
        },
      },
    });

    // كل كارت (غير الأول) بيتكشف بـ clip-path في مكانه من التايم لاين — مقاس تمامًا مع السكرول
    slides.slice(1).forEach((_, idx) => {
      const i = idx + 1;
      tl.to(cards[i], { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 1 }, idx);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isMobile]);

  // ══════════════════════════════════════════════════════════
  // MOBILE: نفس أسلوب الكروت المكدسة بالسكرول الطبيعي (بدون تعديل)
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isMobile) return;

    const vh = window.innerHeight;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      card.style.transform = i === 0 ? 'translateY(0)' : `translateY(${vh}px)`;
    });

    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalScroll = vh * (slides.length - 1);
      const progress = Math.min(Math.max(scrolled / totalScroll, 0), 1);

      cardRefs.current.forEach((card, i) => {
        if (!card || i === 0) return;
        const cardProgress = Math.min(Math.max(progress * (slides.length - 1) - (i - 1), 0), 1);
        card.style.transform = `translateY(${vh * (1 - cardProgress)}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  // ══════════════════════════════════════════════════════════
  // MOBILE JSX
  // ══════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div
        ref={wrapperRef}
        id="gallery"
        className={styles.mobileWrapper}
        style={{ height: `${slides.length * 100}svh` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className={styles.mobileCard}
            style={{ zIndex: i + 1 }}
          >
            <img src={slide.image} alt={slide.label} className={styles.mobileCardImage} />
            <div className={styles.overlay} />
            <div className={styles.mobileCardContent}>
              <div className={styles.topLabel} style={{ background: slide.labelColor }}>
                <span className={styles.topLabelDot} />
                {slide.label}
              </div>
              <h2 className={styles.mobileTitle}>
                {slide.title.split('\n').map((line, j) => (
                  <span key={j} className={styles.titleLine}>{line}</span>
                ))}
              </h2>
              <button className={styles.btn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                {slide.btn}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // DESKTOP JSX
  // ★ التعديل: السيكشن نفسه بقى بدون margin، ولفيناه بـ wrapper
  //   غير مُثبَّت هو اللي عليه margin-top: 400vh. كده الـ pin-spacer
  //   اللي GSAP بيولّده تلقائيًا حوالين .secondSection هيتحسب بشكل
  //   نظيف من غير ما يتلخبط مع أي margin على نفس العنصر المُثبَّت،
  //   وده اللي كان بيسبب الهنجة عند الخروج للسيكشن التالت.
  // ══════════════════════════════════════════════════════════
  return (
    <div ref={pinWrapperRef} id="gallery" className={styles.secondSectionWrapper}>
      <section ref={sectionRef} className={styles.secondSection}>
        {/* الكروت المكدسة - تتكشف بـ clip-path مربوط مباشرة بالسكرول عبر GSAP */}
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => { imageRefs.current[i] = el; }}
            className={styles.imageWrapper}
            style={{ zIndex: i + 1 }}
          >
            <img src={slide.image} alt={slide.title} className={styles.image} />
          </div>
        ))}

        {/* Overlay gradient */}
        <div className={styles.overlay} />

        {/* Progress line */}
        <div className={styles.progressLine}>
          <div ref={lineRef} className={styles.progressLineFill} />
        </div>

        {/* Counter */}
        <div className={styles.counterWrapper}>
          <span
            key={`counter-${activeIndex}-${titleDir}`}
            className={titleDir === 'up' ? styles.counterUp : styles.counterDown}
            style={{ opacity: textVisible ? 1 : 0 }}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Text content */}
        <div className={`${styles.textBox} ${textVisible ? styles.textBoxVisible : ''}`}>
          <div
            key={`label-${activeIndex}`}
            className={styles.topLabel}
            style={{ background: slides[activeIndex].labelColor }}
          >
            <span className={styles.topLabelDot} />
            {slides[activeIndex].label}
          </div>

          <h2
            key={`title-${activeIndex}-${titleDir}`}
            className={`${styles.title} ${titleDir === 'up' ? styles.fadeUp : styles.fadeDown}`}
          >
            {slides[activeIndex].title.split('\n').map((line, i) => (
              <span key={i} className={styles.titleLine}>{line}</span>
            ))}
          </h2>

          <div
            key={`btn-${activeIndex}-${titleDir}`}
            className={`${styles.btnWrap} ${titleDir === 'up' ? styles.btnEnterUp : styles.btnEnterDown}`}
          >
            <button className={styles.btn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {slides[activeIndex].btn}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}