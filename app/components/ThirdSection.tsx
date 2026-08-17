'use client';

import { useRef, useState } from 'react';
import styles from './ThirdSection.module.css';

export default function ThirdSection() {
  const [sliderX, setSliderX] = useState(50);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPercent = (clientX: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return (Math.min(Math.max(clientX - rect.left, 0), rect.width) / rect.width) * 100;
  };

  const onMouseDown = () => { isDragging.current = true; };
  const onMouseUp   = () => { isDragging.current = false; };

  const onSectionMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top)  / rect.height - 0.5,
    });
    if (isDragging.current) setSliderX(getPercent(e.clientX));
  };

  const onTouchStart = () => { isDragging.current = true; };
  const onTouchMove  = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    setSliderX(getPercent(e.touches[0].clientX));
  };
  const onTouchEnd = () => { isDragging.current = false; };

  const penRotate     = -8 + (sliderX - 50) * 0.1;
  const penSkewX      = (sliderX - 50) * 0.15;
  const penSkewY      = (sliderX - 50) * 0.05;
  const penTranslateX = mousePos.x * 40;
  const penTranslateY = mousePos.y * 28;
  const penTransform  = `translate(${penTranslateX}px, ${penTranslateY}px) rotate(${penRotate}deg) skewX(${penSkewX}deg) skewY(${penSkewY}deg)`;

  return (
    <section
      className={styles.thirdSection}
      onMouseMove={onSectionMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div ref={containerRef} className={styles.compareContainer}>

        <p className={styles.sectionTitle}>Maison &amp; Atelier</p>
        <p className={styles.sectionSubtitle}>Where every space tells a story of refined elegance</p>

        <div className={styles.compareInnerWrap}>
          <img src="/2.png" alt="" className={styles.leafDecor} />
          <div className={styles.compareInner}>
            <div className={styles.imgBottom}>
              <img src="/sec3-2-2.png" alt="After" draggable={false} />
            </div>
            <div className={styles.imgTop} style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
              <img src="/sec3-1-1.png" alt="Before" draggable={false} />
            </div>
            <div className={styles.dividerLine} style={{ left: `${sliderX}%` }}>
              <div className={styles.line} />
            </div>
          </div>
        </div>

        <div
          className={styles.dividerHandle}
          style={{ left: `calc(14% + ${sliderX}% * 0.72)` }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.handle}>
            <img
              src="/pen.png"
              alt="drag"
              style={{ transform: penTransform, transition: 'transform 0.15s ease-out' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
