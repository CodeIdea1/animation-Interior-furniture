'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
      return () => {
        window.removeEventListener('scroll', handler);
      };
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

    // ★ التزامن الرسمي بين Lenis وScrollTrigger:
    // كل ما Lenis يحرك السكرول، نبلّغ ScrollTrigger فورًا بدل ما يستنى
    // native scroll event (اللي ممكن يتأخر/يتجمع من المتصفح).
    lenis.on('scroll', ScrollTrigger.update);

    // ★ بدل حلقة requestAnimationFrame منفصلة، Lenis بقى بيتحدّث
    // جوه نفس تيك GSAP بالظبط، فمفيش اختلاف ترتيب تنفيذ بين الاتنين
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // ★ يمنع GSAP من عمل "تعويض" مؤقت لأي فريم بطيء، وده كان بيتعارض
    // مع تنعيم Lenis الخاص بيه ويظهر كتلعثم بسيط في الأقسام المثبتة
    gsap.ticker.lagSmoothing(0);

    // ★★ التعديل الجوهري: بدل ما نعتمد على font-loading + timeout ثابت
    // (1 ثانية) قبل عمل ScrollTrigger.refresh()، دلوقتي بننتظر فعليًا
    // كل صور الصفحة تخلص تحميل (مش تخمين وقت ثابت). السبب: refresh
    // بيعيد حساب كل نقاط الـ pin (وفيه invalidateOnRefresh على تايم
    // لاين السيكشن التاني)، فلو حصل بينما المستخدم بالظبط بيسكرول جوه
    // أو قريب من نطاق الـ pin، بيحصل "قفزة" لحظية محسوسة. انتظار
    // الصور فعليًا (مش وقت تخميني) بيقلل جدًا احتمال إن ده يحصل في
    // توقيت غلط، لأن الـ refresh هيحصل أقرب ما يكون لحظة استقرار
    // الصفحة فعليًا (مش قبلها ولا بعدها بكتير).
    let refreshed = false;
    const refresh = () => {
      if (refreshed) return;
      refreshed = true;
      ScrollTrigger.refresh();
    };

    const waitForImages = () => {
      const imgs = Array.from(document.images);
      const pending = imgs.filter((img) => !img.complete);
      if (pending.length === 0) return Promise.resolve();
      return Promise.all(
        pending.map(
          (img) =>
            new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            })
        )
      );
    };

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

    Promise.all([fontsReady, waitForImages()]).then(refresh);

    // fallback احتياطي بس: لو الشبكة بطيئة جدًا وصورة اتعلقت، برضه
    // نعمل refresh بعد أقصى مهلة معقولة بدل ما نستنى للأبد
    const safetyTimer = setTimeout(refresh, 3000);

    return () => {
      lenis.destroy();
      clearTimeout(safetyTimer);
    };
  }, []);

  return null;
}