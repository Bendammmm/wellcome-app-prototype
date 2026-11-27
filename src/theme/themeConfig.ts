import type { AppTheme } from '../types';

export interface BrandThemeTokens {
  theme: AppTheme;
  isMp: boolean;
  isMpBefore: boolean;
  isMpOpt1: boolean;
  brandName: string;
  /** Primary brand accent (#E40032 WE | #155D2D MP Before | #28443C MP Opt1) */
  primary: string;
  /** Soft tint background for pills/badges/chips */
  primarySoftBg: string;
  /** Secondary accent pill (e.g. Top Sales active pill: #155D2D Before | #0F3655 Opt1) */
  accentBlue: string;
  /** Gold accent (#E5C89C Before | #DDB97D Opt1) */
  gold: string;
  /** Sage accent for Fresh pre-order tag (#155D2D Before | #9CAF88 Opt1) */
  sage: string;
  /** Page canvas background (#F7F7F7 WE & Before | #F7F5F0 Opt1) */
  canvasBg: string;
  /** Section / floor heading color (#1A1A1A WE & Before | #28443C Opt1) */
  headingColor: string;
  /** Section / floor heading font family */
  headingFont: string;
  /** Editorial hero display font family */
  heroFont: string;
  /** Feed active tab color (#E40032 WE & MP Before | #28443C MP Opt1) */
  feedTabActive: string;
  /** Threshold bar bg (#FFF2EB WE & MP Before | #F7F5F0 MP Opt1) */
  thresholdBg: string;
  /** Threshold bar accent (#FF5800/#E40032 WE & MP Before | #28443C MP Opt1) */
  thresholdAccent: string;
  /** TabBar background (#FFFFFF WE | #000000 MP Before | #28443C MP Opt1) */
  tabBarBg: string;
  /** TabBar active color (#E40032 WE | #FFFFFF MP Before | #DDB97D MP Opt1) */
  tabBarActive: string;
  /** TabBar inactive color (#858585 WE | rgba(255,255,255,0.6) MP Before | rgba(255,255,255,0.68) MP Opt1) */
  tabBarInactive: string;
  /** CTA button border radius */
  ctaRadius: string;
  /** Theme-specific SVG icon set (WE vs MP Before vs MP Option 1) */
  icons: {
    tabHome: string;
    tabCategories: string;
    tabYuuId: string;
    tabAi: string;
    tabCart: string;
    tabMe: string;
    addmoreCart: string;
    bellNotice: string;
    store: string;
    truck: string;
    qrScan: string;
    search: string;
  };
}

export function getThemeTokens(theme: AppTheme): BrandThemeTokens {
  if (theme === 'mp-before') {
    return {
      theme,
      isMp: true,
      isMpBefore: true,
      isMpOpt1: false,
      brandName: 'Market Place',
      primary: '#155D2D',
      primarySoftBg: '#EBF3ED',
      accentBlue: '#155D2D',
      gold: '#E5C89C',
      sage: '#155D2D',
      canvasBg: '#F7F7F7',
      headingColor: '#1A1A1A',
      headingFont: "'Noto Serif HK', Georgia, serif",
      heroFont: "'Noto Serif HK', Georgia, serif",
      feedTabActive: '#E40032',
      thresholdBg: '#FFF2EB',
      thresholdAccent: '#FF5800',
      tabBarBg: '#000000',
      tabBarActive: '#FFFFFF',
      tabBarInactive: 'rgba(255, 255, 255, 0.58)',
      ctaRadius: '0px',
      icons: {
        tabHome: '/assets/figma/icons-mp-before/tab-home.svg',
        tabCategories: '/assets/figma/icons-mp-before/tab-categories.svg',
        tabYuuId: '/assets/figma/icons-mp-before/tab-yuuid.svg',
        tabAi: '/assets/figma/icons-mp-before/tab-ai.svg',
        tabCart: '/assets/figma/icons-mp-before/tab-cart.svg',
        tabMe: '/assets/figma/icons-mp-before/tab-me.svg',
        addmoreCart: '/assets/figma/icons-mp-before/addmore-cart.svg',
        bellNotice: '/assets/figma/icons-mp-before/bell-notice.svg',
        store: '/assets/figma/icons-mp-before/store.svg',
        truck: '/assets/figma/icons-mp-before/truck.svg',
        qrScan: '/assets/figma/icons-mp-before/qr-scan.svg',
        search: '/assets/figma/icons-mp-before/search.svg',
      },
    };
  }

  if (theme === 'mp-opt1') {
    return {
      theme,
      isMp: true,
      isMpBefore: false,
      isMpOpt1: true,
      brandName: 'Market Place',
      primary: '#28443C',
      primarySoftBg: '#EBF0EE',
      accentBlue: '#28443C',
      gold: '#DDB97D',
      sage: '#9CAF88',
      canvasBg: '#F7F5F0',
      headingColor: '#28443C',
      headingFont: "'Lora', Georgia, serif",
      heroFont: "'Lora', Georgia, serif",
      feedTabActive: '#28443C',
      thresholdBg: '#F7F5F0',
      thresholdAccent: '#28443C',
      tabBarBg: '#28443C',
      tabBarActive: '#DDB97D',
      tabBarInactive: 'rgba(255, 255, 255, 0.6)',
      ctaRadius: '0px',
      icons: {
        tabHome: '/assets/figma/icons-mp-opt1/tab-home.svg',
        tabCategories: '/assets/figma/icons-mp-opt1/tab-categories.svg',
        tabYuuId: '/assets/figma/icons-mp-opt1/tab-yuuid.svg',
        tabAi: '/assets/figma/icons-mp-opt1/tab-ai.svg',
        tabCart: '/assets/figma/icons-mp-opt1/tab-cart.svg',
        tabMe: '/assets/figma/icons-mp-opt1/tab-me.svg',
        addmoreCart: '/assets/figma/icons-mp-opt1/addmore-cart.svg',
        bellNotice: '/assets/figma/icons-mp-opt1/bell-notice.svg',
        store: '/assets/figma/icons-mp-opt1/store.svg',
        truck: '/assets/figma/icons-mp-opt1/truck.svg',
        qrScan: '/assets/figma/icons-mp-opt1/qr-scan.svg',
        search: '/assets/figma/icons-mp-opt1/search.svg',
      },
    };
  }

  return {
    theme: 'we',
    isMp: false,
    isMpBefore: false,
    isMpOpt1: false,
    brandName: 'Wellcome',
    primary: '#E40032',
    primarySoftBg: '#FFF0F2',
    accentBlue: '#E40032',
    gold: '#FFCF00',
    sage: '#2C8232',
    canvasBg: '#F7F7F7',
    headingColor: '#1A1A1A',
    headingFont: "'Noto Sans', sans-serif",
    heroFont: "'Noto Sans', sans-serif",
    feedTabActive: '#E40032',
    thresholdBg: '#FFF2EB',
    thresholdAccent: '#FF5800',
    tabBarBg: '#FFFFFF',
    tabBarActive: '#E40032',
    tabBarInactive: '#858585',
    ctaRadius: '8px',
    icons: {
      tabHome: '/assets/figma/tab-home.svg',
      tabCategories: '/assets/figma/tab-categories.svg',
      tabYuuId: '/assets/figma/tab-yuuid.svg',
      tabAi: '/assets/figma/tab-ai.svg',
      tabCart: '/assets/figma/tab-cart.svg',
      tabMe: '/assets/figma/tab-me.svg',
      addmoreCart: '/assets/figma/addmore-cart.svg',
      bellNotice: '/assets/figma/bell-notice.svg',
      store: '/assets/figma/store.svg',
      truck: '/assets/figma/truck.svg',
      qrScan: '/assets/figma/qr-scan.svg',
      search: '/assets/figma/search.svg',
    },
  };
}
