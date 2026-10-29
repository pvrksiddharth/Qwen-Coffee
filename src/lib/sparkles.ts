/**
 * Pure helpers for the SparkleField (tinu star particles).
 * Kept side-effect free so they can be unit tested without a canvas.
 */

export interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number; // seconds remaining
  maxLife: number;
  hue: number;
}

export const MAX_PARTICLES = 120;
export const SPAWN_RADIUS = 3.5; // px of jitter around the pointer
const BASE_SPEED = 0.35; // gentle upward drift

/** Deterministic pseudo-random in [0, 1) from an integer seed (xorshift-ish). */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0xffffffff;
  };
}

/** Create one particle at (x, y) using values from `rand` (injectable for tests). */
export function createParticle(
  x: number,
  y: number,
  rand: () => number = Math.random
): StarParticle {
  return {
    x: x + (rand() - 0.5) * 2 * SPAWN_RADIUS,
    y: y + (rand() - 0.5) * 2 * SPAWN_RADIUS,
    vx: (rand() - 0.5) * BASE_SPEED,
    vy: -(0.2 + rand() * BASE_SPEED), // float upwards
    size: 1.5 + rand() * 3,
    life: 0.8 + rand() * 0.9,
    maxLife: 1,
    hue: 38 + rand() * 14, // warm caramel/gold palette
  };
}

// normalise maxLife after creation so alpha is relative to lifetime
function withMaxLife(p: StarParticle): StarParticle {
  return { ...p, maxLife: p.life };
}

export function spawnBurst(x: number, y: number, count: number, rand: () => number = Math.random): StarParticle[] {
  const out: StarParticle[] = [];
  for (let i = 0; i < count; i++) out.push(withMaxLife(createParticle(x, y, rand)));
  return out;
}

/** Advance physics by dt seconds and drop dead particles. Returns a new array. */
export function stepParticles(particles: StarParticle[], dt: number): StarParticle[] {
  const next: StarParticle[] = [];
  for (const p of particles) {
    const life = p.life - dt;
    if (life <= 0) continue;
    next.push({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy - 0.004, // slight acceleration as they rise
      life,
    });
  }
  return next;
}

/** Alpha fades linearly over the particle's lifetime. */
export function particleAlpha(p: StarParticle): number {
  if (p.maxLife <= 0) return 0;
  return Math.max(0, Math.min(1, p.life / p.maxLife));
}

/** Enforce the hard cap so hover spam never floods the frame budget. */
export function clampParticles(particles: StarParticle[], max: number = MAX_PARTICLES): StarParticle[] {
  return particles.length > max ? particles.slice(particles.length - max) : particles;
}
