export const FONT = {
  title: '1.25rem',
  heading: '0.9375rem',
  body: '0.875rem',
  meta: '0.8125rem',
  label: '0.6875rem',
} as const;
export const MOTION = {
  fast: 130,
  base: 200,
  reveal: 650,
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const RADIUS = { sm: 4, md: 8 } as const;
export const ICON = { sm: 14, md: 16, xl: 28 } as const;
export const CONTROL_H = 40;
export const CONTENT_MAX_W = 1320;

export interface Ramp {
  bg: string;
  paper: string;
  subtle: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  success: string;
  error: string;
  warning: string;
  errorSurface: string;
  info: string;
  accent: string;
}

const LIGHT: Ramp = {
  bg: '#fafafa',
  paper: '#ffffff',
  subtle: '#f4f4f5',
  border: '#e4e4e7',
  borderStrong: '#d4d4d8',
  text: '#18181b',
  textSecondary: '#52525b',
  textDisabled: '#a1a1aa',
  success: '#15803d',
  error: '#b91c1c',
  warning: '#b45309',
  errorSurface: '#fef2f2',
  info: '#1d4ed8',
  accent: '#6d28d9',
};

const DARK: Ramp = {
  bg: '#09090b',
  paper: '#0e0e11',
  subtle: '#17171a',
  border: 'rgba(255, 255, 255, 0.12)',
  borderStrong: 'rgba(255, 255, 255, 0.26)',
  text: '#fafafa',
  textSecondary: '#a1a1aa',
  textDisabled: '#71717a',
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  errorSurface: 'rgba(248, 113, 113, 0.08)',
  info: '#60a5fa',
  accent: '#a78bfa',
};

export const ramp = (isDark: boolean): Ramp => (isDark ? DARK : LIGHT);
