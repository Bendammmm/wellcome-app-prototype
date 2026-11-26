export const AUTH_ASSETS = {
  splashWellcomeLogo: '/assets/figma/auth/splash-wellcome-logo.svg',
  yuuQrCode: '/assets/figma/auth/yuu-qr-code.svg',
  wellcomeMark: '/assets/figma/auth/wellcome-mark.svg',
  navClose: '/assets/figma/auth/nav-close.svg',
  chevronLeft: '/assets/figma/auth/chevron-left.svg',
  chevronDown: '/assets/figma/auth/chevron-down.svg',
  clearCircleBg: '/assets/figma/auth/clear-circle-bg.svg',
  clearCircleX: '/assets/figma/auth/clear-circle-x.svg',
  googleG: '/assets/figma/auth/google-g.png',
  appleLogo: '/assets/figma/auth/apple-logo.svg',
  checkboxChecked: '/assets/figma/auth/checkbox-checked.svg',
  checkboxBlank: '/assets/figma/auth/checkbox-blank.svg',
  drawerClose: '/assets/figma/auth/drawer-close.svg',
  radioSelected: '/assets/figma/auth/radio-selected.svg',
  radioUnselected: '/assets/figma/auth/radio-unselected.svg',
  refreshIcon: '/assets/figma/auth/refresh-icon.svg',
  alertCircle: '/assets/figma/auth/alert-circle.svg',
  alertTriangle: '/assets/figma/auth/alert-triangle.svg',
} as const;

export interface RegionOption {
  code: string;
  label: string;
  digitCount: number;
  sample: string;
}

export const REGION_OPTIONS: RegionOption[] = [
  { code: '+852', label: 'Hong Kong SAR', digitCount: 8, sample: '9123 4567' },
  { code: '+86', label: 'Mainland China', digitCount: 11, sample: '138 0013 8000' },
  { code: '+853', label: 'Macao SAR', digitCount: 8, sample: '6123 4567' },
];

export const CAPTCHA_SAMPLES = ['4pux', '7kmn', '9bqr', '3txw'] as const;
