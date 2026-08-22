'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import styles from './Navbar.module.css';

const menuLinks = [
  { label: 'Hero', id: 'hero' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Elegance', id: 'elegance' },
  { label: 'Products', id: 'products' },
  { label: 'Room Style', id: 'room-style' },
  { label: 'Contact', id: 'contact' },
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // ★ ثيم الناف بار حسب مكان السكرول:
  // dark  = الأيقونة بني + اللوجو أسود (بدون فلتر)
  // light = الأيقونة أبيض + اللوجو أبيض (فلتر invert)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const isOpenRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const openMenu = useCallback(() => {
    if (isOpenRef.current) return;
    isOpenRef.current = true;
    setIsOpen(true);

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Circle expand from menu button
    tl.to(overlayRef.current, {
      clipPath: 'circle(150% at calc(100% - 44px) 44px)',
      duration: 0.75,
      ease: 'power3.inOut',
    });

    // Hamburger → X morph
    tl.to(line1Ref.current, {
      y: 7,
      rotation: 45,
      duration: 0.35,
      ease: 'power2.inOut',
    }, 0.15);
    tl.to(line2Ref.current, {
      scaleX: 0,
      duration: 0.2,
      ease: 'power2.in',
    }, 0.15);
    tl.to(line3Ref.current, {
      y: -7,
      rotation: -45,
      duration: 0.35,
      ease: 'power2.inOut',
    }, 0.15);

    // Nav links stagger in
    tl.to(linkRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.07,
      ease: 'power3.out',
    }, 0.35);

    // Numbers stagger in
    tl.to(numberRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out',
    }, 0.45);

    // Right panel
    tl.to(rightRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.5);

    // Bottom bar
    tl.to(bottomRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.6);
  }, []);

  const closeMenu = useCallback(() => {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;

    const tl = gsap.timeline({
      onComplete: () => setIsOpen(false),
    });

    // Bottom bar out
    tl.to(bottomRef.current, {
      opacity: 0,
      y: 15,
      duration: 0.3,
      ease: 'power2.in',
    }, 0);

    // Right panel out
    tl.to(rightRef.current, {
      opacity: 0,
      x: 30,
      duration: 0.35,
      ease: 'power2.in',
    }, 0.05);

    // Numbers out
    tl.to(numberRefs.current, {
      opacity: 0,
      y: 15,
      duration: 0.25,
      stagger: 0.03,
      ease: 'power2.in',
    }, 0.05);

    // Links out
    tl.to(linkRefs.current, {
      opacity: 0,
      y: 40,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power3.in',
    }, 0.1);

    // X → hamburger morph
    tl.to(line1Ref.current, {
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 0.15);
    tl.to(line2Ref.current, {
      scaleX: 1,
      duration: 0.25,
      ease: 'power2.out',
    }, 0.2);
    tl.to(line3Ref.current, {
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 0.15);

    // Circle shrink
    tl.to(overlayRef.current, {
      clipPath: 'circle(0% at calc(100% - 44px) 44px)',
      duration: 0.6,
      ease: 'power3.inOut',
    }, 0.25);
  }, []);

  const toggle = () => {
    if (isOpenRef.current) closeMenu();
    else openMenu();
  };

  const handleLinkClick = (id: string) => {
    closeMenu();
    setTimeout(() => scrollTo(id), 500);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenRef.current) closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeMenu]);

  // Reset inline styles on unmount
  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  // ★ تبديل ثيم الناف بار مع السكرول (rAF-throttled):
  // - light : لما صندوق الهيرو الأبيض (whiteBox) يطلع لفوق ويخلص
  //           انيميشنه (بيبعد عن الشاشة)
  // - dark  : لما نوصل لسيكشن ThirdSection (#elegance)
  // - light : تاني لما نوصل لـ RoomStyleSection (#room-style)
  useEffect(() => {
    let raf = 0;

    const evaluate = () => {
      raf = 0;
      const vh = window.innerHeight;
      const whiteBox = document.querySelector<HTMLElement>('[class*="__whiteBox"]');
      const third = document.getElementById('elegance');
      const room = document.getElementById('room-style');

      const boxGone = !whiteBox || whiteBox.getBoundingClientRect().bottom <= vh * 0.25;
      const thirdArrived = !!third && third.getBoundingClientRect().top <= vh * 0.5;
      const roomArrived = !!room && room.getBoundingClientRect().top <= vh * 0.5;

      const next: 'dark' | 'light' =
        roomArrived ? 'light' : thirdArrived ? 'dark' : boxGone ? 'light' : 'dark';

      setTheme((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    evaluate();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <a className={styles.logo} onClick={() => scrollTo('hero')}>
          <img
            src="/logo-black.webp"
            alt="Elevated Living"
            draggable={false}
            className={`${styles.logoImg} ${theme === 'light' ? styles.logoImgLight : ''}`}
          />
        </a>
        <button className={styles.menuBtn} onClick={toggle} aria-label="Menu">
          <div className={styles.lines}>
            <span ref={line1Ref} className={`${styles.line} ${theme === 'light' ? styles.lineLight : ''}`} />
            <span ref={line2Ref} className={`${styles.line} ${theme === 'light' ? styles.lineLight : ''}`} />
            <span ref={line3Ref} className={`${styles.line} ${theme === 'light' ? styles.lineLight : ''}`} />
          </div>
        </button>
      </nav>

      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      >
        <div className={styles.overlayBg} />

        <button className={styles.closeBtn} onClick={closeMenu} aria-label="Close menu">
          <div className={styles.closeIcon} />
        </button>

        <div className={styles.overlayContent}>
          <div className={styles.menuLeft}>
            {menuLinks.map((link, i) => (
              <div key={link.id} className={styles.menuNavItem}>
                <a
                  ref={(el) => { linkRefs.current[i] = el; }}
                  className={styles.menuNavLink}
                  onClick={() => handleLinkClick(link.id)}
                >
                  <span
                    ref={(el) => { numberRefs.current[i] = el; }}
                    className={styles.menuNavLinkNumber}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          <div ref={rightRef} className={styles.menuRight}>
            <div className={styles.menuDivider} />
            <div className={styles.menuInfo}>
              <p className={styles.menuInfoLabel}>Location</p>
              <p className={styles.menuInfoValue}>
                Dubai, UAE<br />
                Al Wasl Road
              </p>
            </div>
            <div className={styles.menuInfo}>
              <p className={styles.menuInfoLabel}>Contact</p>
              <p className={styles.menuInfoValue}>
                hello@maisonatelier.com<br />
                +971 4 123 4567
              </p>
            </div>
            <div className={styles.menuSocials}>
              <a href="#" className={styles.menuSocialLink} aria-label="Instagram">
                <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 0 1 1.47.957c.453.453.736.884.957 1.47.164.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 0 1-.957 1.47 4.088 4.088 0 0 1-1.47.957c-.46.164-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 0 1-1.47-.957 4.088 4.088 0 0 1-.957-1.47c-.164-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12.163s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.088 4.088 0 0 1 3.593 3.41a4.088 4.088 0 0 1 1.47-.957c.46-.164 1.26-.35 2.43-.403C8.76 2.175 9.14 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a5.87 5.87 0 0 0-2.126 1.384A5.87 5.87 0 0 0 .63 4.14C.333 4.902.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.058 1.277.261 2.15.558 2.913.306.816.705 1.499 1.384 2.185a5.87 5.87 0 0 0 2.185 1.384c.764.297 1.636.5 2.913.558C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.15-.261 2.913-.558a5.87 5.87 0 0 0 2.185-1.384 5.87 5.87 0 0 0 1.384-2.185c.297-.764.5-1.636.558-2.913.058-1.28.072-1.688.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.261-2.15-.558-2.913a5.87 5.87 0 0 0-1.384-2.185A5.87 5.87 0 0 0 19.86.63c-.764-.297-1.636-.5-2.913-.558C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" className={styles.menuSocialLink} aria-label="Pinterest">
                <svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
              <a href="#" className={styles.menuSocialLink} aria-label="Twitter">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div ref={bottomRef} className={styles.menuBottomBar}>
          <p className={styles.menuCopyright}>&copy; 2024 Elevated Living</p>
        </div>
      </div>
    </>
  );
}
