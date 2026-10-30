import { useEffect, useRef } from 'react';
import { useIsDesktop } from '../hooks/useIsDesktop';
import {
  StarParticle,
  clampParticles,
  createParticle,
  particleAlpha,
  spawnBurst,
  stepParticles,
} from '../lib/sparkles';

/**
 * Full-viewport canvas that emits tiny "tinu" star particles that trail the
 * mouse and float upwards while fading out. Renders ONLY on desktop
 * (pointer-fine + >=1024px) and pauses entirely when reduced motion is set.
 */
export default function SparkleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let particles: StarParticle[] = [];
    let raf = 0;
    let last = performance.now();
    let lastSpawn = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawStar = (p: StarParticle) => {
      const alpha = particleAlpha(p);
      const r = p.size * (0.6 + alpha * 0.4);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${p.hue}, 70%, 62%)`;
      ctx.shadowColor = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      // 4-point sparkle: two crossed thin diamonds
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const outerX = p.x + Math.cos(angle) * r;
        const outerY = p.y + Math.sin(angle) * r;
        const innerAngle = angle + Math.PI / 4;
        const innerR = r * 0.35;
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(p.x + Math.cos(innerAngle) * innerR, p.y + Math.sin(innerAngle) * innerR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles = stepParticles(particles, dt);
      for (const p of particles) drawStar(p);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      // throttle spawns so fast movement doesn't flood the field
      if (now - lastSpawn < 30) return;
      lastSpawn = now;
      const spawned = [createParticle(e.clientX, e.clientY)];
      if (Math.random() < 0.35) spawned.push(...spawnBurst(e.clientX, e.clientY, 1));
      particles = clampParticles([...particles, ...spawned]);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="sparkle-field"
      className="sparkle-field"
    />
  );
}
