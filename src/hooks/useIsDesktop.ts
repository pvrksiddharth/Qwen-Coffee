import { useEffect, useState } from 'react';

/**
 * True only on devices that can genuinely show hover sparkle effects:
 * a pointer-fine device (real mouse) AND a viewport >= 1024px.
 * Mobile / tablets never enable it — saving battery and frame budget.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const wideEnough = window.matchMedia('(min-width: 1024px)').matches;
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    return wideEnough && hasHover;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const wideEnough = 'matches' in e ? e.matches : false;
      const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsDesktop(wideEnough && hasHover);
    };
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}
