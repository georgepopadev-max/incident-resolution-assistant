import { inject, NgZone } from '@angular/core';

/**
 * Composable for automatic scroll-to-bottom behavior
 */
export function useScroll(containerSelector: string = '.messages-container') {
  const zone = inject(NgZone);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function scrollToBottom(delay: number = 100): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      zone.runOutsideAngular(() => {
        const container = document.querySelector(containerSelector);
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }, delay);
  }

  function scrollToTop(): void {
    zone.runOutsideAngular(() => {
      const container = document.querySelector(containerSelector);
      if (container) {
        container.scrollTop = 0;
      }
    });
  }

  return {
    scrollToBottom,
    scrollToTop
  };
}