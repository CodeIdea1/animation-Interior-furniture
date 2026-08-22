'use client';

import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  width: number;
}

export default function RainCanvas({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const alphaRef  = useRef(0);
  const inViewRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 180;
    const drops: Drop[] = Array.from({ length: COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      len:     Math.random() * 18 + 8,
      speed:   Math.random() * 6 + 8,
      opacity: Math.random() * 0.5 + 0.5,
      width:   Math.random() * 1.2 + 0.8,
    }));

    const ANGLE = -0.22;

    const draw = () => {
      animRef.current = 0;

      if (visible && alphaRef.current < 1)  alphaRef.current = Math.min(1, alphaRef.current + 0.02);
      if (!visible && alphaRef.current > 0) alphaRef.current = Math.max(0, alphaRef.current - 0.03);

      if (alphaRef.current > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.globalAlpha = alphaRef.current;

        drops.forEach(d => {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + Math.sin(ANGLE) * d.len, d.y + Math.cos(ANGLE) * d.len);
          ctx.strokeStyle = `rgba(180,210,255,${d.opacity})`;
          ctx.lineWidth   = d.width;
          ctx.lineCap     = 'round';
          ctx.stroke();

          d.x += Math.sin(ANGLE) * d.speed * 0.4;
          d.y += Math.cos(ANGLE) * d.speed;

          if (d.y > canvas.height + 20) {
            d.y = -20;
            d.x = Math.random() * canvas.width;
          }
          if (d.x > canvas.width + 20) d.x = -20;
        });

        ctx.restore();

        if (alphaRef.current <= 0.001) {
          alphaRef.current = 0;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      if (inViewRef.current || alphaRef.current > 0) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      if (inViewRef.current && animRef.current === 0) {
        animRef.current = requestAnimationFrame(draw);
      }
    }, { threshold: 0 });
    io.observe(canvas);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: '5%',
        left: '1%',
        width: '32%',
        height: '75%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
