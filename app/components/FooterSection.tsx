'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FooterSection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const sections = [
  { label: 'Hero', id: 'hero' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Elegance', id: 'elegance' },
  { label: 'Products', id: 'products' },
  { label: 'Room Style', id: 'room-style' },
];

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(topRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(navRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(bottomRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} id="contact" className={styles.footer}>
      <div ref={topRef} className={styles.topSection}>
        <div className={styles.brand}>
          <h2 className={styles.brandName}>Elevated Living</h2>
          <div className={styles.brandDivider} />
          <p className={styles.brandTagline}>
            Designing spaces. Defining lifestyles.<br />
            Where every piece tells a story of refined living.
          </p>
        </div>

        <div ref={navRef} className={styles.navGroups}>
          <div className={styles.navGroup}>
            <h3 className={styles.navTitle}>Sections</h3>
            <ul className={styles.navList}>
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={styles.navLink}
                    onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.navGroup} ${styles.newsletter}`}>
            <h3 className={styles.navTitle}>Stay in Touch</h3>
            <div className={styles.newsletterInput}>
              <input
                type="email"
                placeholder="Your email"
                className={styles.input}
              />
              <button className={styles.subscribeBtn}>Join</button>
            </div>
          </div>
        </div>
      </div>

      <div ref={bottomRef} className={styles.bottomBar}>
        <p className={styles.copyright}>
          &copy; 2024 Elevated Living. All rights reserved.
        </p>
        <div className={styles.socialLinks}>
          <a href="#" className={styles.socialLink} aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 0 1 1.47.957c.453.453.736.884.957 1.47.164.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 0 1-.957 1.47 4.088 4.088 0 0 1-1.47.957c-.46.164-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 0 1-1.47-.957 4.088 4.088 0 0 1-.957-1.47c-.164-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12.163s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.088 4.088 0 0 1 3.593 3.41a4.088 4.088 0 0 1 1.47-.957c.46-.164 1.26-.35 2.43-.403C8.76 2.175 9.14 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a5.87 5.87 0 0 0-2.126 1.384A5.87 5.87 0 0 0 .63 4.14C.333 4.902.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.058 1.277.261 2.15.558 2.913.306.816.705 1.499 1.384 2.185a5.87 5.87 0 0 0 2.185 1.384c.764.297 1.636.5 2.913.558C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.15-.261 2.913-.558a5.87 5.87 0 0 0 2.185-1.384 5.87 5.87 0 0 0 1.384-2.185c.297-.764.5-1.636.558-2.913.058-1.28.072-1.688.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.261-2.15-.558-2.913a5.87 5.87 0 0 0-1.384-2.185A5.87 5.87 0 0 0 19.86.63c-.764-.297-1.636-.5-2.913-.558C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a href="#" className={styles.socialLink} aria-label="Pinterest">
            <svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          </a>
          <a href="#" className={styles.socialLink} aria-label="Twitter">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" className={styles.socialLink} aria-label="Facebook">
            <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
