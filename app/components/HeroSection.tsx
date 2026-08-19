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
  '/Pillow1-1.png',
  '/Pillow2.png',
  '/Pillow3.png', // يمكن تكرارها أو إضافة صور جديدة
  '/Pillow4.png',
  '/Pillow5.png',
  '/Pillow6.png',
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
  const layerRef = useRef<HTMLImageElement>(null);

  const mobilePinRef = useRef<HTMLDivElement>(null);

  // وظيفة تغيير الصورة مع أنيميشن احترافي
  const changePillow = (index: number) => {
    if (index === selectedPillow) return; // لا تفعل شيئاً إذا كانت نفس الصورة
    
    // أنيميشن للصورتين بشكل احترافي
    const tl = gsap.timeline();
    
    // اختفاء المخدة الحالية بنفس أسلوب ظهور المخدة الجديدة
    tl.to([pillow1Ref.current, pillow2Ref.current], {
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
    .to([pillow1Ref.current, pillow2Ref.current], {
      scale: 1,         // تكبير للحجم الطبيعي
      opacity: 1,       // ظهور كامل
      rotation: 0,      // بدون دوران
      y: 0,            // الموضع الطبيعي
      duration: 0.6,    // مدة أطول للظهور
      ease: 'back.out(1.7)', // ease مرن وسلس
    });
  };

  useEffect(() => {
    if (!sectionRef.current || !hero2Ref.current || !handRef.current || !whiteBoxRef.current || !lightRef.current || !hero1Ref.current || !light2Ref.current || !linesRef.current || !line1Ref.current || !line2Ref.current || !line3Ref.current || !line4Ref.current || !pillow1Ref.current || !pillow2Ref.current) return;

    const isMobile = window.innerWidth <= 768;

    // على الموبايل: pin scroll مثل الديسكتوب بنسب مختلفة
    if (isMobile) {
      gsap.set(hero1Ref.current,                         { scale: 1.15 });
      gsap.set([pillow1Ref.current, pillow2Ref.current],  { scale: 1.15 });
      gsap.set(light2Ref.current,                        { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mobilePinRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 0.5,
          pin: true,
        }
      });

      tl.to(hero1Ref.current,                        { scale: 1,        ease: 'power2.out', duration: 1    }, 0);
      tl.to([pillow1Ref.current, pillow2Ref.current], { scale: 1,        ease: 'power2.out', duration: 1    }, 0);
      tl.to(hero2Ref.current,                        { y: '-350%',      ease: 'power2.out', duration: 0.8  }, 0);
      tl.to(handRef.current,                         { y: '-350%',      ease: 'power2.out', duration: 0.8  }, 0);
      tl.to(lightRef.current,                        { y: '-260%',      ease: 'power2.out', duration: 0.25 }, 0);
      tl.to(light2Ref.current,                       { y: '-260%',      ease: 'power2.out', duration: 0.25 }, 0);
      tl.to(light2Ref.current,                       { opacity: 1,      ease: 'power2.inOut', duration: 0.6 }, 0.1);
      tl.to(whiteBoxRef.current,                     { y: '-360%',      ease: 'power2.out', duration: 1  }, 0);

      return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    }

    // إنشاء الأنيميشن مع ScrollTrigger (desktop فقط)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=550%',
        scrub: 0.5,
        pin: true,
      }
    });

    // تكبير hero1 في البداية
    gsap.set(hero1Ref.current, {
      scale: 1.25,
    });

    // تكبير المخدات في البداية (نفس أنيميشن hero1)
    gsap.set([pillow1Ref.current, pillow2Ref.current], {
      scale: 1.25,
    });

    // تكبير lines في البداية (نفس أنيميشن hero1)
    gsap.set(linesRef.current, {
      scale: 1.25,
    });

    // إخفاء الصور الفردية بـ clip-path (من اليسار لليمين)
    gsap.set([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current], {
      clipPath: 'inset(0 100% 0 0)',
    });

    // تصغير hero1 مع السكرول للحجم الطبيعي
    tl.to(hero1Ref.current, {
      scale: 1,
      ease: 'power2.out',
      duration: 1,
    }, 0);

    // تصغير المخدات مع السكرول للحجم الطبيعي
    tl.to([pillow1Ref.current, pillow2Ref.current], {
      scale: 1,
      ease: 'power2.out',
      duration: 1,
    }, 0);

    // تصغير lines مع السكرول للحجم الطبيعي
    tl.to(linesRef.current, {
      scale: 1,
      ease: 'power2.out',
      duration: 1,
    }, 0);

    // تحريك hero2 للأعلى
    tl.to(hero2Ref.current, {
      y: '-450%',
      ease: 'power2.out',
      duration: 0.8,
    }, 0);

    // تحريك hand بنفس أنيميشن hero2
    tl.to(handRef.current, {
      y: '-450%',
      ease: 'power2.out',
      duration: 0.8,
    }, 0);

    // تحريك light1 للأعلى
    tl.to(lightRef.current, {
      y: '-210%',
      ease: 'power2.out',
      duration: 0.25,
    }, 0);

    // إخفاء light2 في البداية
    gsap.set(light2Ref.current, {
      opacity: 0,
      filter: 'none',
    });

    // تحريك light2 للأعلى
    tl.to(light2Ref.current, {
      y: '-210%',
      ease: 'power2.out',
      duration: 0.25,
    }, 0);

    // ظهور light2
    tl.to(light2Ref.current, {
      opacity: 1,
      filter: 'none',
      ease: 'power2.inOut',
      duration: 0.6,
    }, 0.15);

    // تحريك البوكس الأبيض
    tl.to(whiteBoxRef.current, {
      y: '-200%',
      ease: 'power2.out',
      duration: 1.2,
    }, 0);

    // أنيميشن ظهور الصور بعد انتهاء الأنيميشنات الحالية (بداية جديدة)
    // ظهور line1 من اليسار لليمين
    tl.to(line1Ref.current, {
      clipPath: 'inset(0 0% 0 0)', // تظهر بالكامل
      ease: 'power2.inOut',
      duration: 0.8,
    }, '+=0.5'); // تبدأ بعد انتهاء الأنيميشنات الحالية + 0.5 ثانية

    // ظهور line2 بالتتابع
    tl.to(line2Ref.current, {
      clipPath: 'inset(0 0% 0 0)',
      ease: 'power2.inOut',
      duration: 0.8,
    }, '-=0.4'); // تبدأ قبل انتهاء الأولى بـ 0.4 ثانية

    // ظهور line3 بالتتابع
    tl.to(line3Ref.current, {
      clipPath: 'inset(0 0% 0 0)',
      ease: 'power2.inOut',
      duration: 0.8,
    }, '-=0.4');

    // ظهور line4 بالتتابع
    tl.to(line4Ref.current, {
      clipPath: 'inset(0 0% 0 0)',
      ease: 'power2.inOut',
      duration: 0.8,
      onComplete: () => {
        console.log('✅ انتهى انيميشن صور الـ lines!');
      }
    }, '-=0.4');

    // فترة انتظار بعد انتهاء الـ lines قبل دخول السيكشن الثاني
    // انيميشن فارغ لإضافة مساحة في الـ timeline
    tl.to({}, {
      duration: 2, // فترة انتظار 2 ثانية
      onComplete: () => {
        console.log('⏰ فترة الانتظار انتهت - جاهز لدخول السيكشن الثاني');
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // أنيميشن تساقط أوراق الشجر محذوف

  return (
    <div ref={mobilePinRef} className={styles.mobilePinWrapper}>
    <section ref={sectionRef} data-hero className={styles.newHeroSection}>
      {/* الصورة الخلفية الأساسية - hero1.png */}
      <div ref={hero1Ref} className={styles.hero1Background}>
        <picture>
          <source srcSet="/herooo-mobile.png" media="(max-width: 768px)" />
          <img src="/heroo.png" alt="Background" className={styles.hero1Image} />
        </picture>
      </div>

      {/* البوكس الأبيض (خلف hero2) */}
      <div ref={whiteBoxRef} className={styles.whiteBox}>
        <div className={styles.textContainer}>
          {/* اليسار: النص الوصفي */}
          <div className={styles.leftSection}>
            <p className={styles.sectionLabel}>LUXURY INTERIORS</p>
            <p className={styles.mainDescription}>
              Where sophistication meets comfort. Curated collections of premium furniture and bespoke interior solutions for the discerning homeowner.
            </p>
            <button className={styles.exploreButton}>
              EXPLORE COLLECTION →
            </button>
          </div>

          {/* المنتصف: العنوان الكبير مع الخطوط الأفقية */}
          <div className={styles.centerSection}>
            <div className={styles.titleWithDivider}>
              {/* الخطوط الأفقية في الأعلى */}
              <div className={styles.dividersContainer}>
                {/* الخط الأيسر */}
                <div className={styles.verticalDivider}>
                  <div className={styles.topDiamond}></div>
                  <div className={styles.dividerLine}></div>
                  <div className={styles.bottomDiamond}></div>
                </div>
                
                {/* الخط الأيمن */}
                <div className={styles.verticalDivider}>
                  <div className={styles.topDiamond}></div>
                  <div className={styles.dividerLine}></div>
                  <div className={styles.bottomDiamond}></div>
                </div>
              </div>
              
              {/* النصوص بجانب بعض */}
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

          {/* اليمين: الأيقونات والميزات */}
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

      {/* الصورة الثانية - hero2.png (50% من الطول، 100% من العرض) */}
      <div ref={hero2Ref} className={styles.hero2Container}>
        <img src="/hero2222.png" alt="Hero 2" className={styles.hero2Image} />
        {/* صورة layer.png فوق hero222 في أقصى اليسار بالأعلى */}
        <img ref={layerRef} src="/layer1-1.png" alt="Layer" className={`${styles.layerImage} ${styles.layerImageMobile}`} />
      </div>

      {/* صورة hand-1.png فوق hero222 في المنتصف تماماً */}
      <div ref={handRef} className={styles.handContainer}>
        <img src="/hand3.png" alt="Hand" className={styles.handImage} />
      </div>

      {/* صورة light1.png في منتصف السيكشن */}
      <div ref={lightRef} className={styles.lightContainer}>
        <img src="/light1-1-1.png" alt="Light" className={styles.lightImage} />
      </div>

      {/* صورة light22.png فوق light1 - تظهر تدريجياً */}
      <div ref={light2Ref} className={styles.light2Container}>
        <img src="/light2-2-2.png" alt="Light 2" className={styles.light2Image} />
      </div>

      {/* صورتا Pillow1-1.png في المنتصف */}
      <div ref={pillow1Ref} className={styles.pillow1Container}>
        <img src={pillowImages[selectedPillow]} alt="Pillow 1" className={styles.pillowImage} />
      </div>
      <div ref={pillow2Ref} className={styles.pillow2Container}>
        <img src={pillowImages[selectedPillow]} alt="Pillow 2" className={styles.pillowImage} />
      </div>

      {/* البوكس المستدير لاختيار المخدات */}
      <div className={styles.pillowSelector}>
        {/* الدوائر الصغيرة للتأثير */}
        <div className={styles.selectorBubbles}>
          <div className={styles.bubble2}></div>
          <div className={styles.bubble1}></div>
        </div>
        
        {/* صور المخدات */}
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

      {/* صور الخطوط على اليمين */}
      <div ref={linesRef} className={styles.linesContainer}>
        <div className={styles.line1}>
          <img ref={line1Ref} src="/line1111.png" alt="Line 1" className={styles.lineImage} />
        </div>
        <div className={styles.line2}>
          <img ref={line2Ref} src="/line22.png" alt="Line 2" className={styles.lineImage} />
        </div>
        <div className={styles.line3}>
          <img ref={line3Ref} src="/line333.png" alt="Line 3" className={styles.lineImage} />
        </div>
        <div className={styles.line4}>
          <img ref={line4Ref} src="/line444.png" alt="Line 4" className={styles.lineImage} />
        </div>
      </div>

      {/* صورة layer2.png - ثابتة في أسفل السيكشن على اليسار */}
      <img src="/c.png" alt="Layer 2" className={styles.layer2Image} />

      {/* حاوية أوراق الشجر المتساقطة محذوفة */}
    </section>
    </div>
  );
};

export default HeroSection;

/* ============================================
   قسم الهيرو القديم - معلق للرجوع إليه لاحقاً
   ============================================

const HeroSectionOld = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  // صور الديكور والأثاث
  const decorImages = [
    '/decor-1.png',
    '/decor2.png',
    '/decor3.png',
    '/decor4.png',
    '/decor5.png',
  ];

  const furnitureImages = [
    '/furniture1.png',
    '/furniture2.png',
    '/furniture3.png',
    '/furniture4.png',
    '/furniture5.png',
    '/furniture6.png',
  ];

  const allImages = [
    ...decorImages, 
    ...furnitureImages,
    ...decorImages,  // نسخة ثانية
    ...furnitureImages,  // نسخة ثانية
    ...decorImages,  // نسخة ثالثة
    ...furnitureImages,  // نسخة ثالثة
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const images = imagesRef.current.filter((img): img is HTMLDivElement => img !== null);
    
    images.forEach((img, index) => {
      // تحديد اتجاه الخروج
      const exitDirections = ['right', 'left', 'top', 'bottom', 'top-right', 'top-left', 'bottom-right', 'bottom-left'];
      const exitDirection = exitDirections[index % 8];
      
      // موضع البداية (مركز الشاشة مع تنويع)
      const startX = (Math.random() - 0.5) * 100;
      const startY = (Math.random() - 0.5) * 100;
      
      // حساب موضع الخروج
      let exitX = 0;
      let exitY = 0;
      
      switch(exitDirection) {
        case 'right':
          exitX = window.innerWidth * 1.4;
          exitY = (Math.random() - 0.5) * 400;
          break;
        case 'left':
          exitX = -window.innerWidth * 1.4;
          exitY = (Math.random() - 0.5) * 400;
          break;
        case 'top':
          exitY = -window.innerHeight * 1.4;
          exitX = (Math.random() - 0.5) * 500;
          break;
        case 'bottom':
          exitY = window.innerHeight * 1.4;
          exitX = (Math.random() - 0.5) * 500;
          break;
        case 'top-right':
          exitX = window.innerWidth * 1.3;
          exitY = -window.innerHeight * 1.1;
          break;
        case 'top-left':
          exitX = -window.innerWidth * 1.3;
          exitY = -window.innerHeight * 1.1;
          break;
        case 'bottom-right':
          exitX = window.innerWidth * 1.3;
          exitY = window.innerHeight * 1.1;
          break;
        case 'bottom-left':
          exitX = -window.innerWidth * 1.3;
          exitY = window.innerHeight * 1.1;
          break;
      }
      
      // تأخير موزع - لجعل الصور مستمرة
      const totalDuration = 12; // مدة أطول = حركة أبطأ
      const delayPerImage = totalDuration / allImages.length; // توزيع متساوي
      const initialDelay = index * delayPerImage;
      
      // تعيين الموضع الابتدائي (بدون rotation)
      gsap.set(img, {
        x: startX,
        y: startY,
        scale: 0,
        opacity: 0,
      });

      // إنشاء timeline لكل صورة
      const tl = gsap.timeline({
        repeat: -1, // تكرار لا نهائي
        delay: initialDelay,
      });

      // حركة واحدة سلسة وبطيئة من البداية للنهاية
      tl.to(img, {
        // الوضوح يظهر بسرعة
        opacity: 1,
        duration: 1,
        ease: 'linear',
      })
      // ثم الحركة البطيئة
      .to(img, {
        x: exitX,
        y: exitY,
        scale: 1.5,
        duration: 15, // حركة بطيئة
        ease: 'linear',
      }, '-=1') // تبدأ مع الظهور
      // الاختفاء في النهاية
      .to(img, {
        opacity: 0,
        duration: 3,
        ease: 'linear',
      })
      // إعادة التعيين
      .set(img, {
        x: startX,
        y: startY,
        scale: 0,
        opacity: 0,
      });
    });

    return () => {
      gsap.killTweensOf(imagesRef.current);
    };
  }, [allImages.length]);

  return (
    <section ref={containerRef} className={styles.heroSection}>
      <div className={styles.imagesContainer}>
        {allImages.map((src, index) => (
          <div
            key={index}
            ref={(el) => {
              imagesRef.current[index] = el;
            }}
            className={styles.imageWrapper}
          >
            <img src={src} alt={`Animation ${index + 1}`} className={styles.image} />
          </div>
        ))}
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Spaces for people, made for life.
        </h1>
      </div>
    </section>
  );
};

============================================ */
