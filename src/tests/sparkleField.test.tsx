import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import SparkleField from '../components/SparkleField';

/** Replace window.matchMedia with a stub where `desktop` controls pointer/width queries. */
function setDesktopMode(isDesktop: boolean, reduceMotion = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion')
        ? reduceMotion
        : isDesktop && !query.includes('max-width') && !query.includes('coarse'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('<SparkleField />', () => {
  it('renders an aria-hidden canvas on desktop with fine pointer', () => {
    setDesktopMode(true);
    const { getByTestId } = render(<SparkleField />);
    const canvas = getByTestId('sparkle-field');
    expect(canvas.tagName).toBe('CANVAS');
    expect(canvas).toHaveAttribute('aria-hidden', 'true'); // decorative only
  });

  it('renders nothing on mobile / coarse-pointer devices', () => {
    setDesktopMode(false);
    const { container } = render(<SparkleField />);
    expect(container.firstChild).toBeNull();
  });

  it('stays silent when prefers-reduced-motion is set (no rAF loop)', () => {
    setDesktopMode(true, true);
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
    render(<SparkleField />);
    // canvas element may exist but the animation effect must bail out early
    expect(rafSpy).not.toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('degrades gracefully when no 2d context is available (jsdom)', () => {
    setDesktopMode(true);
    // getContext stubbed to null in setup.ts — mounting must not throw
    expect(() => render(<SparkleField />)).not.toThrow();
  });
});
