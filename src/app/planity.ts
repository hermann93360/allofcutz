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

export function mountPlanity(
  container: HTMLElement,
  options: PlanityOptions = {}
): void {
  const w = window as any;

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
