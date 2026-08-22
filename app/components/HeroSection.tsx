'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HeroSection.module.css';

// تسجيل ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// قائمة صور المخدات المتاحة
const pillowImages = [
  '/Pillow1-1.webp',
  '/Pillow2.webp',
  '/Pillow3.webp',
  '/Pillow4.webp',
  '/Pillow5.webp',
  '/Pillow6.webp',
];

const HeroSection = () => {
  const [selectedPillow, setSelectedPillow] = useState(0); // الصورة المختارة
  const sectionRef = useRef<HTMLDivElement>(null);
  const hero2Ref = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const whiteBoxRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const hero1Ref = useRef<HTMLDivElement>(null);
  const light2Ref = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLImageElement>(null);
  const line2Ref = useRef<HTMLImageElement>(null);
  const line3Ref = useRef<HTMLImageElement>(null);
  const line4Ref = useRef<HTMLImageElement>(null);
  const pillow1Ref = useRef<HTMLDivElement>(null);
  const pillow2Ref = useRef<HTMLDivElement>(null);
  // ★ طبقة داخلية للأنيميشن: changePillow كان بيعمل tween على نفس
  // العناصر اللي تموضعها معتمد على transform: translate(%) في CSS
  // فبتظهر المخدة نازلة وبعدين بترجع فجأة عند clearProps. الحل:
  // الأنيميشن (scale/y/rotation/opacity) على div داخلي محايد،
  // والحاويات الخارجية مسؤولتها التموضع بس.
  const pillow1InnerRef = useRef<HTMLDivElement>(null);
  const pillow2InnerRef = useRef<HTMLDivElement>(null);
  const pillow1MobileRef = useRef<HTMLDivElement>(null);
  const pillow2MobileRef = useRef<HTMLDivElement>(null);
  const pillow1MobileInnerRef = useRef<HTMLDivElement>(null);
  const pillow2MobileInnerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLImageElement>(null);
  // ★ جديد: ref لصورة layer2Image (اللي مكنش ليها ref أصلاً) عشان نقدر
  // نوقف انيميشنها بنفس طريقة layerRef
  const layer2Ref = useRef<HTMLImageElement>(null);

  const mobilePinRef = useRef<HTMLDivElement>(null);
  const mobileHeroRef = useRef<HTMLDivElement>(null);
  const mobileHero2Ref = useRef<HTMLDivElement>(null);

  // وظيفة تغيير الصورة مع أنيميشن احترافي
  const changePillow = (index: number) => {
    if (index === selectedPillow) return; // لا تفعل شيئاً إذا كانت نفس الصورة

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    // ★ الأنيميشن على الطبقات الداخلية مش الحاويات (شرح فوق)
    const targetRefs = isMobile
      ? [pillow1MobileInnerRef.current, pillow2MobileInnerRef.current]
      : [pillow1InnerRef.current, pillow2InnerRef.current];
    if (!targetRefs[0] || !targetRefs[1]) return;

    // أنيميشن للصورتين بشكل احترافي
    const tl = gsap.timeline();

    // اختفاء المخدة الحالية بنفس أسلوب ظهور المخدة الجديدة
    tl.to(targetRefs, {
      scale: 0.7,       // تصغير للحجم 0.7
      opacity: 0,       // اختفاء كامل
      rotation: -15,    // دوران للجهة المعاكسة
      y: -30,          // حركة للأعلى قليلاً
      duration: 0.5,    // مدة أطول قليلاً
      ease: 'back.in(1.7)', // نفس النوع من ease ولكن معكوس (in بدلاً من out)
      onComplete: () => {
        // تغيير الصورة فقط بعد اكتمال الاختفاء
        setSelectedPillow(index);
      }
    })
    // ظهور المخدة الجديدة بانيميشن مطابق
    .to(targetRefs, {
      scale: 1,         // تكبير للحجم الطبيعي
      opacity: 1,       // ظهور كامل
      rotation: 0,      // بدون دوران
      y: 0,            // الموضع الطبيعي
      duration: 0.6,    // مدة أطول للظهور
      ease: 'back.out(1.7)', // ease مرن وسلس
      clearProps: 'y,rotation,scale,opacity',
    });
  };

  // ★ ريفرش تلقائي عند عبور حد الموبايل/الديسكتوب (768px):
  // أنيميشن الهيرو بتتبني مرة واحدة حسب حجم الشاشة وقت التحميل
  // (isMobile جوه effect بـ [] deps)، فلو المستخدم كبّر أو صغّر
  // النافذة عابرًا الحد، التنسيقات والأحجام مش هتتحدث صح —
  // الحل: إعادة تحميل الصفحة مرة واحدة لحظة العبور بس.
  useEffect(() => {
    const BREAKPOINT = 768;
    const startedMobile = window.innerWidth <= BREAKPOINT;

    const onResize = () => {
      const isMobileNow = window.innerWidth <= BREAKPOINT;
      if (isMobileNow !== startedMobile) {
        window.location.reload();
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !hero2Ref.current || !handRef.current || !whiteBoxRef.current || !lightRef.current || !hero1Ref.current || !light2Ref.current || !linesRef.current || !line1Ref.current || !line2Ref.current || !line3Ref.current || !line4Ref.current) return;

    const isMobile = window.innerWidth <= 768;

    // على الموبايل: pin scroll مثل الديسكتوب بنسب مختلفة
    if (isMobile) {
      if (!pillow1MobileRef.current || !pillow2MobileRef.current) return;

      gsap.set(hero1Ref.current,                         { scale: 1.15 });
      gsap.set([pillow1MobileRef.current, pillow2MobileRef.current],  { scale: 1.15 });
      gsap.set(light2Ref.current,                        { opacity: 0 });
      gsap.set(whiteBoxRef.current,                      { y: '-0%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mobilePinRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 0.5,
          pin: true,
          onLeave: () => {
            if (layerRef.current) layerRef.current.style.animationPlayState = 'paused';
          },
          onEnterBack: () => {
            if (layerRef.current) layerRef.current.style.animationPlayState = 'running';
          },
        }
      });

      tl.to(hero1Ref.current,                        { scale: 1,        ease: 'power2.out', duration: 1    }, 0);
      tl.to([pillow1MobileRef.current, pillow2MobileRef.current], { scale: 1,        ease: 'power2.out', duration: 1    }, 0);
      tl.to(hero2Ref.current,                        { y: '-350%',      ease: 'power2.out', duration: 0.8  }, 0);
      if (mobileHeroRef.current) tl.to(mobileHeroRef.current, { y: '-85%', ease: 'power2.out', duration: 0.8 }, 0);
      if (mobileHero2Ref.current) {
        gsap.set(mobileHero2Ref.current, { opacity: 0 });
        tl.to(mobileHero2Ref.current, { opacity: 1, ease: 'power2.inOut', duration: 1.5 }, 0.2);
        tl.to(mobileHero2Ref.current, { y: '-85%', ease: 'power2.out', duration: 0.8 }, 0);
      }
      tl.to(handRef.current,                         { y: '-350%',      ease: 'power2.out', duration: 0.5  }, 0);
      tl.to(lightRef.current,                        { y: '-175%',      ease: 'power2.out', duration: 0.25 }, 0);
      tl.to(light2Ref.current,                       { y: '-175%',      ease: 'power2.out', duration: 0.25 }, 0);
      tl.to(light2Ref.current,                       { opacity: 1,      ease: 'power2.inOut', duration: 0.6 }, 0.1);
      tl.to(whiteBoxRef.current,                     { y: '-360%',      ease: 'power2.out', duration: 3.5  }, 0);

      return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    }

    // Desktop: التأكد من وجود المخدات
    if (!pillow1Ref.current || !pillow2Ref.current) return;

    // إنشاء الأنيميشن مع ScrollTrigger (desktop فقط)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=550%',
        scrub: 0.5,
        pin: true,
        pinSpacing: false,
        // ★ يعيد حساب القيم function-based (زي بداية الإضاءات y)
        // تلقائيًا عند أي resize/refresh للصفحة
        invalidateOnRefresh: true,
        // ★ الحل الجوهري: layerRef و layer2Ref عندهم filter + animation
        // infinite مستمر (بالظبط زي مشكلة leafDecor اللي كانت في
        // السيكشن التالت) — لكن هنا الخطر أكبر لأن الهيرو مُثبَّت
        // (pin) لمدة +=550% من ارتفاع الشاشة، يعني الانيميشنين دول
        // فضلوا يعملوا repaint مستمر لمساحة سكرول كبيرة جدًا، حتى
        // بعد ما بصريًا يتغطوا بالسيكشنز اللي بعدهم (z-index مش
        // بيوقف الرندر). onLeave/onEnterBack هنا بتوقفهم بالظبط لحظة
        // ما الهيرو يخرج فعليًا من نطاق الـ pin، وترجعهم لو المستخدم
        // سكرول لفوق تاني.
        onLeave: () => {
          if (layerRef.current) layerRef.current.style.animationPlayState = 'paused';
          if (layer2Ref.current) layer2Ref.current.style.animationPlayState = 'paused';
        },
        onEnterBack: () => {
          if (layerRef.current) layerRef.current.style.animationPlayState = 'running';
          if (layer2Ref.current) layer2Ref.current.style.animationPlayState = 'running';
        },
      }
    });

    // تكبير hero1 في البداية
    gsap.set(hero1Ref.current, { scale: 1.25 });
    gsap.set([pillow1Ref.current, pillow2Ref.current], { scale: 1.25 });
    gsap.set(linesRef.current, { scale: 1.25 });
    gsap.set([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current], {
      clipPath: 'inset(0 100% 0 0)',
    });

    tl.to(hero1Ref.current, { scale: 1, ease: 'power2.out', duration: 1 }, 0);
    tl.to([pillow1Ref.current, pillow2Ref.current], { scale: 1, ease: 'power2.out', duration: 1 }, 0);
    tl.to(linesRef.current, { scale: 1, ease: 'power2.out', duration: 1 }, 0);
    tl.to(hero2Ref.current, { y: '-450%', ease: 'power2.out', duration: 0.8 }, 0);
    tl.to(handRef.current, { y: '-580%', ease: 'power2.out', duration: 0.65 }, 0);

    gsap.set(light2Ref.current, { opacity: 0 });
    // ★ بداية الإضاءات: أسفل الشاشة بالكامل — قيمة function-based
    // بتتحسب من جديد تلقائيًا مع كل ScrollTrigger refresh (resize)
    // عشان مسافة البداية تفضل صحيحة مهما تغير مقاس النافذة
    gsap.set([lightRef.current, light2Ref.current], {
      y: () => window.innerHeight + lightRef.current!.offsetHeight,
    });

    // ★ النهاية أعلى من أعلى السكشن بمسافة ثابتة (-350px) —
    // قيمة ثابتة بالبكسل عشان مكانها النهائي يفضل ثابت في كل المقاسات.
    // زوّد الرقم (بالسالب) لو عايزها أعلى، وقلله لو عايزها تنزل
    tl.to([lightRef.current, light2Ref.current], { y: -540, ease: 'power2.out', duration: 0.35 }, 0);
    tl.to(light2Ref.current, { opacity: 1, ease: 'power2.inOut', duration: 0.8 }, 0.4);
    tl.to(whiteBoxRef.current, { y: '-200%', ease: 'power2.out', duration: 1.2 }, 0);

    tl.to(line1Ref.current, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut', duration: 0.8 }, '+=0.5');
    tl.to(line2Ref.current, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut', duration: 0.8 }, '-=0.4');
    tl.to(line3Ref.current, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut', duration: 0.8 }, '-=0.4');
    tl.to(line4Ref.current, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut', duration: 0.8 }, '-=0.4');

    tl.to({}, { duration: 2 });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={mobilePinRef} className={styles.mobilePinWrapper} id="hero">
    <section ref={sectionRef} data-hero className={styles.newHeroSection}>
      <div ref={hero1Ref} className={styles.hero1Background}>
        <picture>
          <source srcSet="/herooo-mobile.webp" type="image/webp" media="(max-width: 768px)" />
          <source srcSet="/herooo-mobile.png" media="(max-width: 768px)" />
          <source srcSet="/heroo.webp" type="image/webp" />
          <img src="/heroo.png" alt="Background" className={styles.hero1Image} />
        </picture>
        <div className={styles.mobilePillowsWrapper}>
          <div ref={pillow1MobileRef} className={styles.pillow1Container}>
            <div ref={pillow1MobileInnerRef}>
              <img src={pillowImages[selectedPillow]} alt="Pillow 1" className={styles.pillowImage} />
            </div>
          </div>
          <div ref={pillow2MobileRef} className={styles.pillow2Container}>
            <div ref={pillow2MobileInnerRef}>
              <img src={pillowImages[selectedPillow]} alt="Pillow 2" className={styles.pillowImage} />
            </div>
          </div>
        </div>

        {/* ★ صور الخطوط (lines) اتنقلت جوه hero1Background عشان
            إحداثياتها الـ % تبقى نسبة لمرحلة الصورة نفسها مش الشاشة،
            فتفضل فوق اللوجو في الرسمة مهما تغير مقاس النافذة */}
        <div ref={linesRef} className={styles.linesContainer}>
          <div className={styles.line1}>
            <img ref={line1Ref} src="/line1111.webp" alt="Line 1" className={styles.lineImage} />
          </div>
          <div className={styles.line2}>
            <img ref={line2Ref} src="/line22.webp" alt="Line 2" className={styles.lineImage} />
          </div>
          <div className={styles.line3}>
            <img ref={line3Ref} src="/line333.webp" alt="Line 3" className={styles.lineImage} />
          </div>
          <div className={styles.line4}>
            <img ref={line4Ref} src="/line444.webp" alt="Line 4" className={styles.lineImage} />
          </div>
        </div>

      </div>

      {/* ★ الإضاءات على مستوى السكشن (مش جوه مرحلة الصورة):
          نهايتها مثبتة top:0 بمستوى السكشن المستقر 100vh،
          فمكانها النهائي مش بيتأثر بمقاس الشاشة إطلاقًا */}
      <div ref={lightRef} className={styles.lightContainer}>
        <picture>
          <source srcSet="/light1.webp" type="image/webp" />
          <img src="/light1.webp" alt="Light" className={styles.lightImage} />
        </picture>
      </div>

      <div ref={light2Ref} className={styles.light2Container}>
        <img src="/light2-new.webp" alt="Light 2" className={styles.light2Image} />
      </div>

      <div ref={pillow1Ref} className={styles.pillow1Container}>
        <div ref={pillow1InnerRef}>
          <img src={pillowImages[selectedPillow]} alt="Pillow 1" className={styles.pillowImage} />
        </div>
      </div>
      <div ref={pillow2Ref} className={styles.pillow2Container}>
        <div ref={pillow2InnerRef}>
          <img src={pillowImages[selectedPillow]} alt="Pillow 2" className={styles.pillowImage} />
        </div>
      </div>

      <div ref={whiteBoxRef} className={styles.whiteBox}>
        <div className={styles.textContainer}>
          <div className={styles.leftSection}>
            <p className={styles.sectionLabel}>LUXURY INTERIORS</p>
            <p className={styles.mainDescription}>
              Where sophistication meets comfort. Curated collections of premium furniture and bespoke interior solutions for the discerning homeowner.
            </p>
            <button className={styles.exploreButton}>
              EXPLORE COLLECTION →
            </button>
          </div>

          <div className={styles.centerSection}>
            <div className={styles.titleWithDivider}>
              <div className={styles.dividersContainer}>
                <div className={styles.verticalDivider}>
                  <div className={styles.topDiamond}></div>
                  <div className={styles.dividerLine}></div>
                  <div className={styles.bottomDiamond}></div>
                </div>
                <div className={styles.verticalDivider}>
                  <div className={styles.topDiamond}></div>
                  <div className={styles.dividerLine}></div>
                  <div className={styles.bottomDiamond}></div>
                </div>
              </div>

              <div className={styles.titlePart}>
                <div className={styles.titleGroup}>
                  <h1 className={`${styles.mainTitle} ${styles.elevatedTitle}`}>ELEVATED</h1>
                  <p className={styles.subtitle}>DESIGNING SPACES.</p>
                </div>
                <div className={styles.titleGroup}>
                  <h1 className={`${styles.mainTitle} ${styles.livingTitle}`}>LIVING</h1>
                  <p className={styles.subtitle}>DEFINING LIFESTYLES.</p>
                </div>
              </div>
            </div>
            <p className={styles.establishedText}>EST. 2024</p>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className={styles.featureText}>
                <p className={styles.featureLabel}>CURATED</p>
                <p className={styles.featureValue}>SELECTIONS</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className={styles.featureText}>
                <p className={styles.featureLabel}>PREMIUM</p>
                <p className={styles.featureValue}>QUALITY</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="6" width="18" height="15" rx="2" strokeWidth="1.5"/>
                  <path d="M7 3v3M17 3v3M3 10h18" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className={styles.featureText}>
                <p className={styles.featureLabel}>BESPOKE</p>
                <p className={styles.featureValue}>SOLUTIONS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={hero2Ref} className={styles.hero2Container}>
        <picture>
          <source srcSet="/hero2222.webp" type="image/webp" />
          <img src="/hero2222.png" alt="Hero 2" className={styles.hero2Image} />
        </picture>
        <picture>
          <source srcSet="/layer1-1.webp" type="image/webp" />
          <img ref={layerRef} src="/layer1-1.png" alt="Layer" className={`${styles.layerImage} ${styles.layerImageMobile}`} />
        </picture>
      </div>

      <div ref={mobileHeroRef} className={styles.mobileHeroReplacement}>
        <img src="/3333.webp" alt="Hero Mobile" className={styles.mobileHeroReplacementImage} />
      </div>

      <div ref={mobileHero2Ref} className={styles.mobileHero2Replacement}>
        <img src="/4444.webp" alt="Hero Mobile 2" className={styles.mobileHeroReplacementImage} />
      </div>

      <div ref={handRef} className={styles.handContainer}>
        <picture>
          <source srcSet="/hand-mobile.webp" type="image/webp" media="(max-width: 768px)" />
          <source srcSet="/hand-mobile.png" media="(max-width: 768px)" />
          <source srcSet="/hand3.webp" type="image/webp" />
          <img src="/hand2.webp" alt="Hand" className={styles.handImage} />
        </picture>
      </div>

      <div className={styles.pillowSelector}>
        <div className={styles.selectorBubbles}>
          <div className={styles.bubble2}></div>
          <div className={styles.bubble1}></div>
        </div>

        <div className={styles.pillowOptions}>
          {pillowImages.map((image, index) => (
            <div
              key={index}
              className={`${styles.pillowOption} ${selectedPillow === index ? styles.pillowOptionActive : ''}`}
              onClick={() => changePillow(index)}
            >
              <img src={image} alt={`Pillow ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <img ref={layer2Ref} src="/c.webp" alt="Layer 2" className={styles.layer2Image} />
    </section>
    </div>
  );
};

export default HeroSection;