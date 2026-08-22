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
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionElRef = useRef<HTMLElement | null>(null);
  const leafShapeRef = useRef<HTMLDivElement | null>(null);

  // ★ القلم بيتحرك دلوقتي بكتابة الـ transform مباشرة على الـ DOM عبر ref
  // (بدون أي setState). قبل كده كل mousemove كان بيعمل re-render للسيكشن
  // كله، وده كان بيهدر فريمات أثناء السكرول لو الإيد بتتحمّش شوية على
  // التراك باد. sliderXRef بيخلي حساب حركة القلم يقرأ آخر قيمة سحب
  // من غير ما يستنى re-render.
  const penImgRef = useRef<HTMLImageElement | null>(null);
  const sliderXRef = useRef(50);

  const mouseRafId = useRef<number | null>(null);
  const pendingMouse = useRef<{ x: number; y: number } | null>(null);

  // ★★ بوابة السكرول (الحل النهائي للتهنيج): طالما السكرول شغال
  // (وخلال 160ms بعد آخر حدث سكرول)، السيكشن صامت تماماً:
  // صفر قراءات layout وصفر كتابات styles — يعني صفر منافسة مع
  // Lenis/GSAP على الفريم وقت الدخول للسيكشن وأثناء السكرول فيه.
  const scrollingRef = useRef(false);
  const scrollEndTimer = useRef<number | null>(null);
  // ★ كاش مستطيل السيكشن: بدل getBoundingClientRect() في كل حدث
  // ماوس (قراءة تخطيط متزامنة إجبارية)، بنقيس مرة واحدة لكل جلسة
  // تحويم، وملغيّينه مع أي سكرول أو resize.
  const sectionRectCache = useRef<DOMRect | null>(null);

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
    if (!rect) return sliderXRef.current;
    return (Math.min(Math.max(clientX - rect.left, 0), rect.width) / rect.width) * 100;
  };

  // ★ تحديث موحّد لقيمة السلايدر: ref فوري (للقراءة داخل نفس الفريم)
  // + state ( لإعادة رسم clip-path والخط)
  const applySlider = (value: number) => {
    sliderXRef.current = value;
    setSliderX(value);
  };

  // ★ كتابة transform القلم مباشرة على العنصر داخل rAF واحد لكل فريم،
  // بدون setState وبالتالي بدون أي re-render للسيكشن أثناء الحركة.
  const flushPenTransform = () => {
    const img = penImgRef.current;
    const pos = pendingMouse.current;
    if (!img || !pos) return;
    const delta = sliderXRef.current - 50;
    const rotate = -8 + delta * 0.1;
    const skewX = delta * 0.15;
    const skewY = delta * 0.05;
    img.style.transform =
      `translate(${pos.x * 40}px, ${pos.y * 28}px) ` +
      `rotate(${rotate}deg) skewX(${skewX}deg) skewY(${skewY}deg)`;
  };

  const scheduleSliderUpdate = (clientX: number) => {
    pendingDragClientX.current = clientX;
    if (dragRafId.current === null) {
      dragRafId.current = requestAnimationFrame(() => {
        if (pendingDragClientX.current !== null) {
          applySlider(getPercentFromCache(pendingDragClientX.current));
        }
        dragRafId.current = null;
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    containerRectCache.current = containerRef.current!.getBoundingClientRect();
    applySlider(getPercentFromCache(e.clientX));
  };
  const onMouseUp = () => { isDragging.current = false; };

  // ★ بوابة السكرول: أي حدث سكرول (شامل زلقات Lenis أثناء الانزلاق)
  // يشغّل الوضع الصامت فوراً ويلغي أي rAF معلّق عشان مفيش كتابة
  // styles تحصل جوه فريم سكرول. الوضع بيرجع عادي بعد استقرار 160ms.
  useEffect(() => {
    const markScrolling = () => {
      scrollingRef.current = true;
      sectionRectCache.current = null; // القياس بقى قديم بعد السكرول
      pendingMouse.current = null;
      if (mouseRafId.current !== null) {
        cancelAnimationFrame(mouseRafId.current);
        mouseRafId.current = null;
      }
      if (scrollEndTimer.current !== null) clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = window.setTimeout(() => {
        scrollingRef.current = false;
      }, 160);
    };

    const onResize = () => { sectionRectCache.current = null; };

    window.addEventListener('scroll', markScrolling, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', markScrolling);
      window.removeEventListener('resize', onResize);
      if (scrollEndTimer.current !== null) clearTimeout(scrollEndTimer.current);
    };
  }, []);

  const onSectionMouseMove = (e: React.MouseEvent) => {
    // السحب نشاط مقصود — شغال دايماً (بيستخدم rect متكاش من لحظة
    // الضغط، فمفيش قراءة layout إضافية أصلاً)
    if (isDragging.current) scheduleSliderUpdate(e.clientX);

    // ★ أثناء السكرول: خروج فوري — لا قياسات ولا حسابات ولا كتابة
    if (scrollingRef.current) return;

    // ★ نجمع كل حركات الماوس اللي بتوصل في نفس الفريم، ونعمل تحديث
    // واحد بس لكل فريم — والقياس من الكاش مش من التخطيط كل مرة
    if (!sectionRectCache.current) {
      sectionRectCache.current = e.currentTarget.getBoundingClientRect();
    }
    const rect = sectionRectCache.current;
    pendingMouse.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };

    if (mouseRafId.current === null) {
      mouseRafId.current = requestAnimationFrame(() => {
        flushPenTransform();
        mouseRafId.current = null;
      });
    }
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
  // ★ rootMargin 100%: الانيميشن بيبدأ قبل ما السيكشن يدخل الشاشة
  // بمسافة فريم كامل — يعني أول rasterize للطبقة المقنّعة (mask) وبدء
  // الحركة بيحصلوا وهيا برّه الشاشة، بدل ما يحصلوا في نفس الفريم اللي
  // المستخدم شايف فيه دخول السيكشن (ده كان بيسبب تهنيج عند الدخول).
  useEffect(() => {
    const leaf = leafShapeRef.current;
    const el = sectionElRef.current;
    if (!leaf || !el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        leaf.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { threshold: 0, rootMargin: '100% 0px 100% 0px' }
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
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, []);

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
              ref={penImgRef}
              src="/pen.webp"
              alt="drag"
              decoding="async"
            />
          </div>
        </div>

      </div>
    </section>
  );
}