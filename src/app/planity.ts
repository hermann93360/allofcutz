/**
 * Planity widget loader — single global injection guard so a SPA route change
 * doesn't double-load the CDN scripts.
 */

export const PLANITY_KEY = '-OWPz4k9UQ30eFHetQ_u';
export const PLANITY_PRIMARY = '#5B7C99';

const POLYFILLS_URL =
  'https://d2skjte8udjqxw.cloudfront.net/widget/production/2/polyfills.latest.js';
const APP_URL =
  'https://d2skjte8udjqxw.cloudfront.net/widget/production/2/app.latest.js';

const LOADED_FLAG = '__planityScriptsLoaded';

export interface PlanityOptions {
  servicesNotCollapsed?: boolean;
  headerWidth?: string;
  serviceSetsWhitelist?: string[];
  servicesWhitelist?: string[];
  onServiceAdd?: () => void;
}

/** Window scroll calls closer than this to a click in the widget count as Planity's. */
const CLICK_WINDOW_MS = 800;

/**
 * Planity calls `window.scroll(0, 0)` on every button click, which throws the
 * visitor to the top of the page. Calls made right after a click inside the
 * widget are replaced by `onScrollReset` (by default, the top of the widget).
 */
function guardScrollReset(container: HTMLElement, onScrollReset?: () => void): void {
  const w = window as any;
  w.__planityScrollGuard?.();

  let lastClick = -Infinity;
  const onClick = () => (lastClick = performance.now());
  container.addEventListener('click', onClick, true);

  const fallback = () => {
    const y = container.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  };
  const isReset = (args: any[]) => {
    const top = typeof args[0] === 'object' && args[0] !== null ? args[0].top : args[1];
    return top === 0 || top === undefined;
  };
  const wrap = (orig: (...a: any[]) => void) =>
    function (this: Window, ...args: any[]) {
      if (performance.now() - lastClick < CLICK_WINDOW_MS && isReset(args)) {
        (onScrollReset ?? fallback)();
        return;
      }
      return orig.apply(this, args);
    };

  const origScroll = window.scroll;
  const origScrollTo = window.scrollTo;
  window.scroll = wrap(origScroll) as typeof window.scroll;
  window.scrollTo = wrap(origScrollTo) as typeof window.scrollTo;

  w.__planityScrollGuard = () => {
    container.removeEventListener('click', onClick, true);
    window.scroll = origScroll;
    window.scrollTo = origScrollTo;
  };
}

export function mountPlanity(
  container: HTMLElement,
  options: PlanityOptions = {},
  onScrollReset?: () => void
): void {
  const w = window as any;
  guardScrollReset(container, onScrollReset);

  w.planity = {
    key: PLANITY_KEY,
    primaryColor: PLANITY_PRIMARY,
    appointmentContainer: container,
    options
  };

  if (w[LOADED_FLAG]) return;
  w[LOADED_FLAG] = true;

  const inject = (src: string) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
  };
  inject(POLYFILLS_URL);
  inject(APP_URL);
}
