'use client';

import { useEffect } from 'react';

export default function DebugScroll() {
  useEffect(() => {
    const vh = window.innerHeight;

    // طباعة layout مرة واحدة بعد ثانية
    setTimeout(() => {
      const sections = document.querySelectorAll('section');
      console.log('=== PAGE DEBUG ===');
      console.log('innerHeight:', vh);
      console.log('scrollHeight:', document.body.scrollHeight, '=', (document.body.scrollHeight / vh).toFixed(1), 'vh');
      sections.forEach((s, i) => {
        const absTop = s.getBoundingClientRect().top + window.scrollY;
        console.log(`Section[${i}] | top: ${(absTop/vh).toFixed(1)}vh | position: ${getComputedStyle(s).position} | class: ${s.className.slice(0,50)}`);
      });

      // تتبع scrollY كل 500ms وطباعة عند الفراغ
      let lastVisible = '';
      setInterval(() => {
        const scrollVh = (window.scrollY / vh).toFixed(1);
        const allSections = document.querySelectorAll('section');
        let visibleNow = 'NONE (فراغ!)';
        allSections.forEach((s, i) => {
          const rect = s.getBoundingClientRect();
          if (rect.top < vh && rect.bottom > 0) {
            visibleNow = `Section[${i}] ${s.className.slice(0,30)}`;
          }
        });
        if (visibleNow !== lastVisible) {
          console.log(`scrollY: ${scrollVh}vh | visible: ${visibleNow}`);
          lastVisible = visibleNow;
        }
      }, 200);
    }, 1000);
  }, []);

  return null;
}
