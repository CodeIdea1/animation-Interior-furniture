'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ThirdSection.module.css';

// ★ جديد: قائمة كل صور السيكشن الثالث (الخلفيتين + القلم + قناع الورقة)
// عشان نجهزها (decode) بدري من لحظة أول mount للمكوّن، بدل ما نسيب
// المتصفح يأجّل الـ decode بتاعها للحظة اللي فعليًا هتدخل فيها الشاشة
// بالسكرول. ده كان السبب الأساسي لإحساس "القفزة/الثقل" عند الدخول
// للسيكشن: المتصفح كان بيعمل decode + composite لصور كبيرة في نفس
// الفريم اللي المفروض يكون بس سكرول عادي.
const THIRD_SECTION_IMAGES = [
  '/sec3-2-2.webp',
  '/sec3-1-1.webp',
  '/pen.webp',
  '/2.webp',
];

export default function ThirdSection() {
  const [sliderX, setSliderX] = useState(50);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionElRef = useRef<HTMLElement | null>(null);
  const leafShapeRef = useRef<HTMLDivElement | null>(null);

  const mouseRafId = useRef<number | null>(null);
  const pendingMouse = useRef<{ x: number; y: number } | null>(null);

  // ★ جديد: نفس فلسفة throttle الماوس (rAF) لكن لحركة السحب (sliderX).
  // قبل كده كان setSliderX بيتنفذ مباشرة في كل حدث mousemove/touchmove
  // من غير throttle، ومعاها getBoundingClientRect() بيتحسب من جديد في
  // كل مرة (forced synchronous layout) — ده كان بيعمل ثقل حقيقي وقت
  // السحب لأنه بيتنافس على نفس الفريم مع Lenis/GSAP. دلوقتي بنكاش
  // الـ rect مرة واحدة وقت بداية السحب، وبنجمع كل الحركات اللي بتوصل
  // في نفس الفريم ونعمل setState مرة واحدة بس لكل فريم.
  const dragRafId = useRef<number | null>(null);
  const pendingDragClientX = useRef<number | null>(null);
  const containerRectCache = useRef<DOMRect | null>(null);

  const getPercentFromCache = (clientX: number) => {
    const rect = containerRectCache.current;
    if (!rect) return sliderX;
    return (Math.min(Math.max(clientX - rect.left, 0), rect.width) / rect.width) * 100;
  };

  const scheduleSliderUpdate = (clientX: number) => {
    pendingDragClientX.current = clientX;
    if (dragRafId.current === null) {
      dragRafId.current = requestAnimationFrame(() => {
        if (pendingDragClientX.current !== null) {
          setSliderX(getPercentFromCache(pendingDragClientX.current));
        }
        dragRafId.current = null;
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    containerRectCache.current = containerRef.current!.getBoundingClientRect();
    setSliderX(getPercentFromCache(e.clientX));
  };
  const onMouseUp = () => { isDragging.current = false; };

  const onSectionMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pendingMouse.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };

    // ★ نجمع كل حركات الماوس اللي بتوصل في نفس الفريم، ونعمل setState
    // مرة واحدة بس لكل فريم (مش 60-120 مرة/ثانية زي قبل كده)
    if (mouseRafId.current === null) {
      mouseRafId.current = requestAnimationFrame(() => {
        if (pendingMouse.current) setMousePos(pendingMouse.current);
        mouseRafId.current = null;
      });
    }

    if (isDragging.current) scheduleSliderUpdate(e.clientX);
  };

  const onTouchStart = () => {
    isDragging.current = true;
    containerRectCache.current = containerRef.current!.getBoundingClientRect();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    scheduleSliderUpdate(e.touches[0].clientX);
  };
  const onTouchEnd = () => { isDragging.current = false; };

  // ★ نوقف انيميشن الورقة (leafDecorSway) وهي خارج نطاق الرؤية،
  // بدل ما تفضل شغالة من لحظة الـ mount طول عمر الصفحة. التحكم عبر
  // ref مباشرة (مش state) عشان محدش يعمل re-render إضافي بسببها.
  useEffect(() => {
    const leaf = leafShapeRef.current;
    const el = sectionElRef.current;
    if (!leaf || !el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        leaf.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { threshold: 0 }
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  // ★ جديد: preload + decode مبكر لصور السيكشن الثالث. بيتنفذ مرة
  // واحدة وقت أول mount للصفحة (السيكشن ده أصلاً موجود في الـ DOM من
  // البداية، مش lazy-mounted)، فبكده الصور بتكون اتفك تشفيرها وجاهزة
  // للرسم قبل ما المستخدم يوصلها بالسكرول أصلاً.
  useEffect(() => {
    THIRD_SECTION_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      if ('decode' in img) {
        img.decode().catch(() => {
          // تجاهل أخطاء decode (مثلاً لو الصورة لسه مش وصلت كفاية)،
          // المتصفح هيرجع يحاول يرسمها عادي وقت الحاجة
        });
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (mouseRafId.current) cancelAnimationFrame(mouseRafId.current);
      if (dragRafId.current) cancelAnimationFrame(dragRafId.current);
    };
  }, []);

  const penRotate = -8 + (sliderX - 50) * 0.1;
  const penSkewX = (sliderX - 50) * 0.15;
  const penSkewY = (sliderX - 50) * 0.05;
  const penTranslateX = mousePos.x * 40;
  const penTranslateY = mousePos.y * 28;
  const penTransform = `translate(${penTranslateX}px, ${penTranslateY}px) rotate(${penRotate}deg) skewX(${penSkewX}deg) skewY(${penSkewY}deg)`;

  return (
    <section
      ref={sectionElRef}
      id="elegance"
      className={styles.thirdSection}
      onMouseDown={onMouseDown}
      onMouseMove={onSectionMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div ref={containerRef} className={styles.compareContainer}>

        <p className={styles.sectionTitle}>Elevated Living</p>
        <p className={styles.sectionSubtitle}>Where every space tells a story of refined elegance</p>

        <div className={styles.compareInnerWrap}>
          <div className={styles.leafDecorFade}>
            <div ref={leafShapeRef} className={styles.leafDecorShape} />
          </div>
          <div className={styles.compareInner}>
            <div className={styles.imgBottom}>
              <img src="/sec3-2-2.webp" alt="After" draggable={false} decoding="async" />
            </div>
            <div className={styles.imgTop} style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
              <img src="/sec3-1-1.webp" alt="Before" draggable={false} decoding="async" />
            </div>
            <div className={styles.dividerLine} style={{ left: `${sliderX}%` }}>
              <div className={styles.line} />
            </div>
          </div>
        </div>

        <div
          className={styles.dividerHandle}
          style={{ left: `calc(14% + ${sliderX}% * 0.72)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.handle}>
            <img
              src="/pen.webp"
              alt="drag"
              decoding="async"
              style={{ transform: penTransform, transition: 'transform 0.15s ease-out' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}