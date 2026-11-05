import { useEffect } from 'react';

/** Keep modal navigation inside its surface, then return focus to its trigger. */
export function useFocusScope(active: boolean, selector: string, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const panel = document.querySelector<HTMLElement>(selector);
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,select,[tabindex="0"]')).filter(el => el.getClientRects().length > 0);
    (focusables()[0] || panel).focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0]; const last = items[items.length - 1];
      if (!first) { event.preventDefault(); panel.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', keydown);
      if (previous?.isConnected) previous.focus();
    };
  }, [active, selector, onClose]);
}
