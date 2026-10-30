import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// jsdom lacks matchMedia — provide a controllable stub.
// Default: desktop viewport (>=1024px) with a fine hovering pointer.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => {
    const desktop = !query.includes('max-width') && !query.includes('coarse');
    return {
      matches: desktop,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  },
});

// jsdom has no canvas 2d context — SparkleField should degrade gracefully.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;

afterEach(() => {
  cleanup();
});
