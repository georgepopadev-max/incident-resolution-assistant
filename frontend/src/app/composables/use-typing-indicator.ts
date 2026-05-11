import { signal, computed } from '@angular/core';

/**
 * Composable for typing indicator state management
 */
export function useTypingIndicator() {
  const isTyping = signal(false);
  const animationFrame = signal(0);

  const dots = computed(() => {
    const frame = animationFrame() % 3;
    return [0, 1, 2].map(i => i <= frame ? 1 : 0);
  });

  function startTyping(): void {
    isTyping.set(true);
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 3;
      animationFrame.set(frame);
    }, 400);
    
    // Store interval ID for cleanup
    (window as any).__typingInterval = interval;
  }

  function stopTyping(): void {
    isTyping.set(false);
    const interval = (window as any).__typingInterval;
    if (interval) {
      clearInterval(interval);
      (window as any).__typingInterval = null;
    }
  }

  function toggleTyping(value: boolean): void {
    if (value) {
      startTyping();
    } else {
      stopTyping();
    }
  }

  return {
    isTyping: isTyping.asReadonly(),
    dots,
    startTyping,
    stopTyping,
    toggleTyping
  };
}