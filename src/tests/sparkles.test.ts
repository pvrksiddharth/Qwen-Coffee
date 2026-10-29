import { describe, expect, it } from 'vitest';
import {
  MAX_PARTICLES,
  StarParticle,
  clampParticles,
  createParticle,
  particleAlpha,
  seededRandom,
  spawnBurst,
  stepParticles,
} from '../lib/sparkles';

/** Deterministic rand: always returns the same value so fields are predictable. */
const constant = (v: number) => () => v;

describe('seededRandom', () => {
  it('is deterministic for the same seed', () => {
    const seq1 = Array.from({ length: 10 }, seededRandom(7));
    const seq2 = Array.from({ length: 10 }, seededRandom(7));
    expect(seq1).toEqual(seq2);
    // and different seeds diverge
    const other = Array.from({ length: 10 }, seededRandom(8));
    expect(other).not.toEqual(seq1);
  });

  it('produces values in [0, 1)', () => {
    const rand = seededRandom(1234);
    for (let i = 0; i < 1000; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('createParticle', () => {
  it('spawns near the pointer with jitter bounded by SPAWN_RADIUS', () => {
    const p = createParticle(100, 200, constant(1)); // max jitter
    expect(p.x).toBeCloseTo(103.5, 5);
    expect(p.y).toBeCloseTo(203.5, 5);
    const q = createParticle(100, 200, constant(0)); // min jitter
    expect(q.x).toBeCloseTo(96.5, 5);
    expect(q.y).toBeCloseTo(196.5, 5);
  });

  it('always drifts upward (negative vy)', () => {
    for (const v of [0, 0.5, 1]) {
      const p = createParticle(0, 0, constant(v));
      expect(p.vy).toBeLessThan(0);
    }
  });

  it('keeps sizes and lifetimes within design bounds', () => {
    const mid = createParticle(0, 0, constant(0.5));
    expect(mid.size).toBeGreaterThanOrEqual(1.5);
    expect(mid.size).toBeLessThanOrEqual(4.5);
    expect(mid.life).toBeGreaterThanOrEqual(0.8);
    expect(mid.life).toBeLessThanOrEqual(1.7);
    expect(mid.hue).toBeGreaterThanOrEqual(38); // warm gold/caramel family
    expect(mid.hue).toBeLessThanOrEqual(52);
  });
});

describe('spawnBurst', () => {
  it('creates exactly the requested count with maxLife normalised to life', () => {
    const burst = spawnBurst(10, 10, 5, seededRandom(99));
    expect(burst).toHaveLength(5);
    for (const p of burst) expect(p.maxLife).toBe(p.life);
  });

  it('returns an empty array for zero count', () => {
    expect(spawnBurst(0, 0, 0)).toEqual([]);
  });
});

describe('stepParticles', () => {
  const make = (overrides: Partial<StarParticle> = {}): StarParticle => ({
    x: 0, y: 0, vx: 1, vy: -1, size: 2, life: 1, maxLife: 1, hue: 40,
    ...overrides,
  });

  it('advances positions by velocity (frame-based integration)', () => {
    const [p] = stepParticles([make()], 0.5);
    expect(p.x).toBeCloseTo(1, 5); // x += vx
    expect(p.y).toBeCloseTo(-1, 5); // y += vy
  });

  it('decrements life by dt', () => {
    const [p] = stepParticles([make()], 0.3);
    expect(p.life).toBeCloseTo(0.7, 5);
  });

  it('culls particles whose life has run out', () => {
    expect(stepParticles([make({ life: 0.2 })], 0.5)).toHaveLength(0);
    // boundary: exactly-zero life is culled too
    expect(stepParticles([make({ life: 0.5 })], 0.5)).toHaveLength(0);
  });

  it('keeps living particles and preserves order', () => {
    const input = [make({ life: 0.1 }), make({ life: 2 }), make({ life: 5 })];
    const result = stepParticles(input, 0.5);
    expect(result).toHaveLength(2);
    expect(result[0].life).toBeCloseTo(1.5, 5);
    expect(result[1].life).toBeCloseTo(4.5, 5);
  });

  it('does not mutate the original array', () => {
    const input = [make()];
    const before = { ...input[0] };
    stepParticles(input, 0.4);
    expect(input[0]).toEqual(before);
  });
});

const base: StarParticle = {
  x: 0, y: 0, vx: 0, vy: 0, size: 2, life: 1, maxLife: 1, hue: 40,
};

describe('particleAlpha', () => {
  it('is fully opaque at birth', () => {
    expect(particleAlpha(base)).toBe(1);
  });

  it('fades linearly as life drains', () => {
    expect(particleAlpha({ ...base, life: 0.5 })).toBeCloseTo(0.5, 5);
    expect(particleAlpha({ ...base, life: 0.25 })).toBeCloseTo(0.25, 5);
  });

  it('never goes below 0 or above 1', () => {
    expect(particleAlpha({ ...base, life: -1 })).toBe(0);
    expect(particleAlpha({ ...base, life: 3 })).toBe(1);
  });

  it('guards against division by zero', () => {
    expect(particleAlpha({ ...base, maxLife: 0 })).toBe(0);
  });
});

describe('clampParticles', () => {
  // Tag each particle with its index via `x` so we can assert which survived.
  const many = (n: number): StarParticle[] =>
    Array.from({ length: n }, (_, i) => ({ ...base, x: i }));

  it('leaves arrays under the cap untouched', () => {
    const list = many(10);
    expect(clampParticles(list, 20)).toHaveLength(10);
  });

  it('trims oldest particles first when over the cap', () => {
    const list = many(200);
    const clamped = clampParticles(list, 50);
    expect(clamped).toHaveLength(50);
    expect(clamped[0].x).toBe(150); // newest survive
  });

  it('defaults to MAX_PARTICLES', () => {
    const clamped = clampParticles(many(MAX_PARTICLES + 40));
    expect(clamped).toHaveLength(MAX_PARTICLES);
  });
});
