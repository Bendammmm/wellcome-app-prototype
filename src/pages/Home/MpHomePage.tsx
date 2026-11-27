import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import {
  ASSETS,
  DELIVERY_ADDRESSES,
  ICONS,
  PICKUP_STORES,
  PRODUCTS,
} from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';
import { AppTabBar } from '../../components/shared/AppTabBar';
import { ProductAddControl } from '../../components/shared/ProductAddControl';
import { ProductCard } from '../../components/shared/ProductCard';
import { PriceBlock } from '../../components/shared/PriceBlock';
import { PromoTag } from '../../components/shared/PromoTag';
import { ThresholdProgressBar } from '../../components/shared/ThresholdProgressBar';

const MP_ASSETS = {
  heroSteak: '/assets/figma/mp/hero-steak.png',
  catWine: '/assets/figma/mp/cat-wine.png',
  catMeat: '/assets/figma/mp/cat-meat.png',
  catFruit: '/assets/figma/mp/cat-fruit.png',
  catSeafood: '/assets/figma/mp/cat-seafood.png',
  catDairy: '/assets/figma/mp/cat-dairy.jpg',
  catVegetable: '/assets/figma/mp/cat-vegetable.jpg',
  catBakery: '/assets/figma/mp/cat-bakery.jpg',
  catSnacks: '/assets/figma/mp/cat-snacks.jpg',
  qualityBg: '/assets/figma/mp/quality-bg.png',
  qualityTitle: '/assets/figma/mp/quality-title.svg',
  qualitySalmon: '/assets/figma/mp/quality-salmon.png',
  qualityRose: '/assets/figma/mp/quality-rose.png',
  qualityOrange: '/assets/figma/mp/quality-orange.png',
  rank1: '/assets/figma/mp/rank-1.svg',
  rank2: '/assets/figma/mp/rank-2.svg',
  rank3: '/assets/figma/mp/rank-3.svg',
  preorderWagyuBg: '/assets/figma/mp/preorder-wagyu-bg.png',
  preorderWagyu1: '/assets/figma/mp/preorder-wagyu-1.png',
  preorderWagyu2: '/assets/figma/mp/preorder-wagyu-2.png',
  preorderChampagneBg: '/assets/figma/mp/preorder-champagne-bg.png',
  preorderChampagne1: '/assets/figma/mp/preorder-champagne-1.png',
  preorderChampagne2: '/assets/figma/mp/preorder-champagne-2.png',
  brand360Bg: '/assets/figma/mp/brand-360-bg.png',
  brand360Logo: '/assets/figma/mp/brand-360-logo.svg',
  brand360Prod: '/assets/figma/mp/brand-360-prod.png',
  brandOliversBg: '/assets/figma/mp/brand-olivers-bg.png',
  brandOliversLogo: '/assets/figma/mp/brand-olivers-logo.svg',
  brandOliversProd: '/assets/figma/mp/brand-olivers-prod.png',
  featuredZespriBg: '/assets/figma/mp/featured-zespri-bg.png',
  featuredZespriLogo: '/assets/figma/mp/featured-zespri-logo.png',
  brandTab2: '/assets/figma/mp/brand-tab-2.png',
  brandTab3: '/assets/figma/mp/brand-tab-3.png',
  brandTab4: '/assets/figma/mp/brand-tab-4.png',
  zespri5pc: '/assets/figma/mp/zespri-5pc.png',
};

const QUALITY_CATS = ['All', 'Seasonal Pick', 'Healthy Choice', 'Winter Warmers'] as const;

const QUICK_CATEGORIES = [
  { label: 'Wine', img: MP_ASSETS.catWine, productId: 'belena-shiraz' },
  { label: 'Meat', img: MP_ASSETS.catMeat, productId: 'us-beef-blade' },
  { label: 'Fruit', img: MP_ASSETS.catFruit, productId: 'fuji-apple' },
  { label: 'Seafood', img: MP_ASSETS.catSeafood, productId: 'jumbo-blueberry' },
  { label: 'Dairy & Eggs', img: MP_ASSETS.catDairy, productId: 'emina-cheese' },
  { label: 'Vegetables', img: MP_ASSETS.catVegetable, productId: 'zespri-kiwi' },
  { label: 'Bakery', img: MP_ASSETS.catBakery, productId: 'ferrarini-ham' },
  { label: 'Snacks', img: MP_ASSETS.catSnacks, productId: 'nissin-bowl' },
];

export const MpHomePage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const selectedAddressId = useAppStore((s) => s.selectedAddressId);
  const selectedStoreId = useAppStore((s) => s.selectedStoreId);
  const openFulfillmentSheet = useAppStore((s) => s.openFulfillmentSheet);
  const showToast = useAppStore((s) => s.showToast);
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);

  const [scrolled, setScrolled] = useState(false);
  const [catScrollRatio, setCatScrollRatio] = useState(0);
  const [qualityCat, setQualityCat] = useState<(typeof QUALITY_CATS)[number]>('All');
  const [preorderSlide, setPreorderSlide] = useState(0);
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  const [feedTab, setFeedTab] = useState<'recommend' | 'dinner' | 'healthy'>('recommend');

  const catTrackRef = useRef<HTMLDivElement>(null);
  const preorderTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCatScroll = () => {
    const el = catTrackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setCatScrollRatio(0);
      return;
    }
    setCatScrollRatio(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
  };

  const handlePreorderScroll = () => {
    const el = preorderTrackRef.current;
    if (!el || el.clientWidth === 0) return;
    setPreorderSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  const currentAddr =
    DELIVERY_ADDRESSES.find((a) => a.id === selectedAddressId) ?? DELIVERY_ADDRESSES[0];
  const currentStore =
    PICKUP_STORES.find((s) => s.id === selectedStoreId) ?? PICKUP_STORES[0];

  const isDelivery = fulfillmentMode === 'delivery';
  const navLocation = isDelivery
    ? `to ${currentAddr.shortNavLabel}`
    : `· ${currentStore.shortNavLabel}`;

  const qualityPicks = [
    {
      id: 'us-beef-blade',
      rankImg: MP_ASSETS.rank1,
      name: 'Kirkland Signature Fresh Farmed Atlantic Salmon Portions',
      img: MP_ASSETS.qualitySalmon,
      price: 168.0,
      originalPrice: 198.0,
      promo: '20% off',
      saved: 'Saved $20.00',
      badge: 'New',
    },
    {
      id: 'belena-shiraz',
      rankImg: MP_ASSETS.rank2,
      name: "CH D'ESCLANS Whispering Angel 24/25 (750mL)",
      img: MP_ASSETS.qualityRose,
      price: 178.0,
      originalPrice: 200.0,
    },
    {
      id: 'flash-orange',
      rankImg: MP_ASSETS.rank3,
      name: 'Australian Navel Orange High Brix 1kg',
      img: MP_ASSETS.qualityOrange,
      price: 78.0,
      originalPrice: 92.0,
    },
  ];

  const preorderWagyuPicks = [
    {
      id: 'us-beef-blade',
      name: 'YAMAGATA GYU Japan Yamagata Chilled A5 Grade Wagyu Beef Sukiyaki',
      img: MP_ASSETS.preorderWagyu1,
      price: 238.0,
      originalPrice: 288.0,
    },
    {
      id: 'ferrarini-ham',
      name: 'YAMAGATA GYU Japan Yamagata Chilled A5 Grade Wagyu Beef Ribeye',
      img: MP_ASSETS.preorderWagyu2,
      price: 456.0,
      originalPrice: 520.0,
      signature: true,
    },
  ];

  const preorderChampagnePicks = [
    {
      id: 'belena-shiraz',
      name: 'RUINART Rose NV 750mL (750mL)',
      img: MP_ASSETS.preorderChampagne1,
      price: 730.0,
      originalPrice: 800.0,
      promo: '20% off',
    },
    {
      id: 'bin-180-wine',
      name: "CHAMPAGNE JEAN VESSELLE Brut Nature L'Expression Nature NV (750mL)",
      img: MP_ASSETS.preorderChampagne2,
      price: 450.0,
      originalPrice: 546.0,
    },
  ];

  const featuredBrands = [
    {
      id: 'zespri',
      name: 'Zespri',
      logo: MP_ASSETS.featuredZespriLogo,
      bg: '#BAD6EB',
      heroImg: MP_ASSETS.featuredZespriBg,
      products: [
        PRODUCTS.find((p) => p.id === 'zespri-kiwi')!,
        {
          ...PRODUCTS.find((p) => p.id === 'zespri-kiwi')!,
          id: 'fuji-apple',
          name: 'Zespri Gold Kiwifruit 5PC',
          image: MP_ASSETS.zespri5pc,
          price: 120.0,
          originalPrice: undefined,
          promoTags: [],
        },
        PRODUCTS.find((p) => p.id === 'jumbo-blueberry')!,
      ],
    },
    {
      id: 'brand2',
      name: 'Calabria',
      logo: MP_ASSETS.brandTab2,
      bg: '#E8E3D9',
      heroImg: MP_ASSETS.preorderChampagneBg,
      products: [
        PRODUCTS.find((p) => p.id === 'belena-shiraz')!,
        PRODUCTS.find((p) => p.id === 'bin-180-wine')!,
        PRODUCTS.find((p) => p.id === 'emina-cheese')!,
      ],
    },
    {
      id: 'brand3',
      name: 'Wagyu Craft',
      logo: MP_ASSETS.brandTab3,
      bg: '#EDE4DC',
      heroImg: MP_ASSETS.preorderWagyuBg,
      products: [
        PRODUCTS.find((p) => p.id === 'us-beef-blade')!,
        PRODUCTS.find((p) => p.id === 'ferrarini-ham')!,
        PRODUCTS.find((p) => p.id === 'belena-shiraz')!,
      ],
    },
    {
      id: 'brand4',
      name: 'Artisan Fresh',
      logo: MP_ASSETS.brandTab4,
      bg: '#E2ECE7',
      heroImg: MP_ASSETS.brand360Bg,
      products: [
        PRODUCTS.find((p) => p.id === 'fuji-apple')!,
        PRODUCTS.find((p) => p.id === 'jumbo-blueberry')!,
        PRODUCTS.find((p) => p.id === 'zespri-kiwi')!,
      ],
    },
  ];

  const activeBrand = featuredBrands[activeBrandIdx] ?? featuredBrands[0];

  const todaysDeals = PRODUCTS.filter((p) =>
    ['bin-180-wine', 'us-beef-blade', 'jumbo-blueberry', 'zespri-kiwi', 'emina-cheese'].includes(
      p.id
    )
  );

  const feedProducts = (() => {
    const orderedIds = [
      'belena-shiraz',
      'fuji-apple',
      'jumbo-blueberry',
      'bin-180-wine',
      'us-beef-blade',
      'zespri-kiwi',
      'nissin-bowl',
    ];
    const base = orderedIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));
    if (feedTab === 'dinner') return [...base].reverse();
    if (feedTab === 'healthy') return [...base].sort((a, b) => a.price - b.price);
    return base;
  })();

  const topFruits = [
    { rank: 1, product: PRODUCTS.find((p) => p.id === 'fuji-apple')!, displayPrice: 18 },
    { rank: 2, product: PRODUCTS.find((p) => p.id === 'jumbo-blueberry')!, displayPrice: 35 },
    { rank: 3, product: PRODUCTS.find((p) => p.id === 'zespri-kiwi')!, displayPrice: 60 },
  ];

  // Annotation #01: Pure Black (#000000) in Before -> MP Green (#28443C) in Option 1
  const heroTopGradient = t.isMpOpt1
    ? 'linear-gradient(180deg, #28443C 0%, rgba(40,68,60,0.88) 42%, rgba(40,68,60,0) 78%)'
    : 'linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.88) 42%, rgba(0,0,0,0) 78%)';

  const stickyHeaderBg = t.isMpOpt1 ? '#28443C' : '#000000';

  const headingStyle: React.CSSProperties = {
    fontFamily: t.headingFont,
    color: t.headingColor,
  };

  return (
    <div
      className="min-h-dvh pb-[148px] transition-colors duration-200"
      style={{ backgroundColor: t.canvasBg }}
    >
      {/* Scrolled Sticky Dark Header (Black in Before -> MP Green #28443C in Option 1) */}
      {scrolled && (
        <header
          className="app-fixed-bar top-0 z-40 px-3 pt-[max(10px,env(safe-area-inset-top))] pb-2.5 flex items-center gap-2 shadow-md transition-colors duration-200"
          style={{ backgroundColor: stickyHeaderBg }}
        >
          <button
            type="button"
            onClick={openFulfillmentSheet}
            aria-label="Switch delivery or pick-up"
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0"
          >
            <img
              src={isDelivery ? t.icons.truck : ICONS.cncBag}
              alt=""
              className="w-[15px] h-[15px] object-contain"
            />
          </button>

          <button
            type="button"
            onClick={() => navigate('search')}
            className="flex-1 h-[36px] bg-white pl-3 pr-1 flex items-center gap-1.5 text-left"
          >
            <img src={t.icons.search} alt="" className="w-[15px] h-[15px] object-contain shrink-0" />
            <span className="text-[13px] leading-[18px] text-[#858585] truncate flex-1">
              Coca-Cola
            </span>
            <img src={t.icons.qrScan} alt="" className="w-[20px] h-[20px] object-contain shrink-0 mr-1" />
            <span className="h-[28px] px-3 bg-[#F2F4F3] text-[#1A1A1A] text-[12px] leading-[16px] font-medium inline-flex items-center">
              Search
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('in-store')}
            className="flex flex-col items-center text-white shrink-0"
          >
            <img
              src={t.icons.store}
              alt="Store"
              className="w-[22px] h-[22px] object-contain"
            />
            <span className="text-[10px] leading-[12px] font-medium">Store</span>
          </button>
        </header>
      )}

      {/* 1. Editorial Hero Banner (Figma 8817:86709 — 298px, 1/10 pill removed per user feedback) */}
      <section className="relative w-full h-[298px] overflow-hidden bg-[#0E0E0E]">
        <img
          src={MP_ASSETS.heroSteak}
          alt="Market Place Premium Selection"
          className="absolute inset-x-0 top-[44px] w-full h-[264px] object-cover object-center"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.05) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{ backgroundImage: heroTopGradient }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-4 pt-[max(14px,env(safe-area-inset-top))] pb-4">
          {/* Top Bar */}
          <div className="space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                <div className="inline-flex items-center gap-1 text-[12px] leading-[16px] font-medium text-white">
                  <span className="font-semibold">2,3160</span>
                  <img src={ASSETS.yuuCoin} alt="yuu" className="w-[14px] h-[14px] object-contain" />
                  <span>= &#36;156</span>
                </div>

                <button
                  type="button"
                  onClick={openFulfillmentSheet}
                  className="flex items-center gap-1 text-[14px] leading-[20px] text-white max-w-full"
                >
                  <img
                    src={isDelivery ? t.icons.truck : ICONS.cncBag}
                    alt=""
                    className="w-[15px] h-[15px] object-contain shrink-0"
                  />
                  <span className="font-bold shrink-0">
                    {isDelivery ? 'Delivery' : 'Click & Collect'}
                  </span>
                  <span className="truncate font-normal text-white/90">{navLocation}</span>
                  <img
                    src={ICONS.chevronDown}
                    alt=""
                    className="w-[14px] h-[14px] object-contain brightness-0 invert shrink-0"
                  />
                </button>
              </div>

              <div className="flex items-center gap-3.5 shrink-0 pt-0.5 text-white">
                <button
                  type="button"
                  onClick={() => showToast('No new notifications')}
                  className="flex flex-col items-center"
                >
                  <img
                    src={t.icons.bellNotice}
                    alt="Notice"
                    className="w-[22px] h-[22px] object-contain"
                  />
                  <span className="text-[10px] leading-[13px] text-white/90">Notice</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('in-store')}
                  className="flex flex-col items-center"
                >
                  <img
                    src={t.icons.store}
                    alt="Store"
                    className="w-[22px] h-[22px] object-contain"
                  />
                  <span className="text-[10px] leading-[13px] text-white/90">Store</span>
                </button>
              </div>
            </div>

            {/* Sharp Editorial Search Bar */}
            <button
              type="button"
              onClick={() => navigate('search')}
              className="w-full h-[40px] bg-white pl-3 pr-1 flex items-center gap-2 shadow-sm"
            >
              <img src={t.icons.search} alt="" className="w-[15px] h-[15px] object-contain shrink-0" />
              <span className="text-[14px] leading-[20px] text-[#858585]">Coca-Cola</span>
              <div className="flex-1" />
              <img src={t.icons.qrScan} alt="" className="w-[20px] h-[20px] object-contain shrink-0 mr-1" />
              <span className="h-[32px] px-4 bg-[#F2F4F3] text-[#1A1A1A] text-[13px] leading-[18px] font-medium inline-flex items-center justify-center">
                Search
              </span>
            </button>
          </div>

          {/* Editorial Hero Copy */}
          <div className="space-y-1.5">
            <p
              className="text-[10px] tracking-[0.14em] uppercase font-normal transition-colors"
              style={{ color: t.gold }}
            >
              PREMIUM SELECTION
            </p>
            <div className="w-[18px] h-[1px] bg-white/55" />
            <h1
              className="text-[20px] leading-[26px] font-normal text-white"
              style={{ fontFamily: t.heroFont }}
            >
              A great evening,
              <br />
              beautifully simple.
            </h1>
          </div>
        </div>
      </section>

      {/* 2. 8 Circular Editorial Category Strip + Synced Scroll Indicator */}
      <section className="bg-white pt-4 pb-3 flex flex-col items-center gap-3">
        <div
          ref={catTrackRef}
          onScroll={handleCatScroll}
          className="w-full flex items-start gap-1.5 overflow-x-auto no-scrollbar px-3"
        >
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => navigate('pdp', cat.productId)}
              className="w-[74px] shrink-0 flex flex-col items-center gap-1.5 active:opacity-80"
            >
              <div className="w-[56px] h-[56px] rounded-full overflow-hidden bg-[#1A1A1A] shrink-0">
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-[12px] leading-[15px] text-[#3D3D3D] font-normal text-center line-clamp-2">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
        {/* Live scroll-tracking indicator thumb */}
        <div className="w-[48px] h-[4px] rounded-full bg-[#E5E5E5] overflow-hidden relative">
          <div
            className="w-[20px] h-full rounded-full transition-colors"
            style={{
              backgroundColor: t.primary,
              transform: `translateX(${catScrollRatio * 28}px)`,
            }}
          />
        </div>
      </section>

      {/* Main Content Floors */}
      <div className="pt-3 space-y-3">
        {/* 3. Pick up where you left off — 4 Cards, Full-Bleed Zero-Border Product Thumbnails */}
        <section className="space-y-2">
          <h2
            className="px-4 text-[16px] leading-[22px] font-semibold transition-colors"
            style={headingStyle}
          >
            Pick up where you left off
          </h2>

          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            {[
              {
                title: 'Recently Viewed',
                items: [
                  { id: 'us-beef-blade', img: MP_ASSETS.brand360Prod },
                  { id: 'ferrarini-ham', img: MP_ASSETS.preorderWagyu2 },
                  { id: 'zespri-kiwi', img: ASSETS.kiwi },
                ],
              },
              {
                title: 'Buy it again',
                items: [
                  { id: 'belena-shiraz', img: MP_ASSETS.qualityRose },
                  { id: 'jumbo-blueberry', img: ASSETS.blueberry },
                  { id: 'fuji-apple', img: ASSETS.fujiApple },
                ],
              },
              {
                title: 'My Lists',
                items: [
                  { id: 'us-beef-blade', img: MP_ASSETS.qualitySalmon },
                  { id: 'flash-orange', img: MP_ASSETS.qualityOrange },
                  { id: 'belena-shiraz', img: MP_ASSETS.preorderChampagne1 },
                ],
              },
              {
                title: 'Not yet rated',
                items: [
                  { id: 'bin-180-wine', img: MP_ASSETS.preorderChampagne2 },
                  { id: 'emina-cheese', img: MP_ASSETS.brandOliversProd },
                  { id: 'us-beef-blade', img: MP_ASSETS.preorderWagyu1 },
                ],
              },
            ].map((group) => (
              <div
                key={group.title}
                className="w-[276px] shrink-0 bg-white p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[14px] leading-[20px] font-medium transition-colors"
                    style={headingStyle}
                  >
                    {group.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#666666]" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {group.items.map((item, idx) => (
                    <button
                      key={`${group.title}-${idx}`}
                      type="button"
                      onClick={() => navigate('pdp', item.id)}
                      className="aspect-square bg-white overflow-hidden active:scale-95 transition-transform"
                    >
                      <img src={item.img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Quality Picks — Full-Section Background Photography, Exact Rank SVGs, Floating Add Stepper */}
        <section className="relative overflow-hidden pb-3">
          {/* Full-section editorial background matching Figma I8817:86862;5166:207901 */}
          <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none overflow-hidden">
            <img
              src={MP_ASSETS.qualityBg}
              alt=""
              className="w-full h-full object-cover object-top"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[180px]"
              style={{
                background: `linear-gradient(180deg, rgba(247,245,240,0) 0%, ${t.canvasBg} 85%)`,
              }}
            />
          </div>

          {/* Title Block */}
          <div className="relative z-10 h-[120px] pt-7 pl-8">
            <p className="text-[10px] tracking-[0.06em] uppercase text-[#724300] font-normal mb-1">
              CURATED FOR YOU
            </p>
            <img
              src={MP_ASSETS.qualityTitle}
              alt="Quality Picks"
              className="h-[46px] w-auto object-contain"
            />
          </div>

          {/* Filter Pills — Active pill matches theme primary (#155D2D Before / #28443C Opt 1) */}
          <div className="relative z-10 flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
            {QUALITY_CATS.map((cat) => {
              const active = qualityCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setQualityCat(cat)}
                  className="h-[30px] min-w-[64px] px-3.5 rounded-full text-[12px] leading-[16px] font-medium shrink-0 transition-colors"
                  style={
                    active
                      ? { backgroundColor: t.accentBlue, color: '#FFFFFF' }
                      : { backgroundColor: '#FFFFFF', color: '#1A1A1A' }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Ranked 1-2-3 Gourmet List */}
          <div className="relative z-10 mx-4 bg-white divide-y divide-[#F2F0EB] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {qualityPicks.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => navigate('pdp', p.id)}
                className="flex items-center gap-2.5 px-3 py-3 cursor-pointer active:bg-[#FAF9F6]"
              >
                {/* Exact Figma Rank 1 / 2 / 3 SVG circles with white bold digits */}
                <div className="relative w-[24px] h-[24px] shrink-0 flex items-center justify-center">
                  <img src={p.rankImg} alt="" className="absolute inset-0 w-full h-full" />
                  <span className="relative z-10 text-[12px] font-bold text-white leading-none">
                    {idx + 1}
                  </span>
                </div>

                {/* Full-bleed product image (zero extra margin) */}
                <div className="relative w-[82px] h-[82px] bg-white overflow-hidden shrink-0">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  {p.badge && (
                    <div className="absolute top-0 right-0">
                      <PromoTag label={p.badge} variant="new" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-[18px] font-normal text-[#1A1A1A] line-clamp-2">
                    {p.name}
                  </p>
                  {p.promo && <PromoTag label={p.promo} className="mt-1" />}
                  <div className="flex items-end justify-between gap-2 mt-1.5">
                    <div className="min-w-0">
                      <PriceBlock
                        price={p.price}
                        originalPrice={p.originalPrice}
                        size="sm"
                      />
                      {p.saved && (
                        <p className="text-[10px] leading-[12px] text-[#3D3D3D] font-medium mt-0.5">
                          {p.saved}
                        </p>
                      )}
                    </div>

                    {/* Fixed 32×32 slot so expanded 92px stepper floats OVER content without squeezing text */}
                    <div className="relative w-[32px] h-[32px] shrink-0">
                      <ProductAddControl
                        productId={p.id}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Horizontal Swipeable Fresh pre-order Carousel (Slide 1: Wagyu | Slide 2: Champagne) */}
        <section className="space-y-2">
          <div
            ref={preorderTrackRef}
            onScroll={handlePreorderScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          >
            {/* Slide 1: Fresh pre-order A5 Wagyu */}
            <div className="w-full shrink-0 snap-center relative overflow-hidden bg-[#1D1815]">
              <img
                src={MP_ASSETS.preorderWagyuBg}
                alt="Fresh pre-order Wagyu"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.16) 40%, rgba(0,0,0,0.68) 72%, rgba(0,0,0,0.88) 100%)',
                }}
              />

              <div className="relative z-10 p-4 flex flex-col gap-5">
                <div className="space-y-3">
                  <span
                    className="inline-block px-2.5 py-1 text-[14px] leading-[18px] font-semibold text-white transition-colors"
                    style={{ backgroundColor: t.sage, fontFamily: t.heroFont }}
                  >
                    Fresh pre-order
                  </span>
                  <div>
                    <h2
                      className="text-[24px] leading-[28px] font-normal text-white"
                      style={{ fontFamily: t.heroFont, color: '#FFFFFF' }}
                    >
                      Bring Home,
                      <br />
                      <span style={{ color: t.gold }}>Something Special.</span>
                    </h2>
                    <p className="text-[12px] text-white/85 mt-1.5">
                      Curated A5 Wagyu for Everyday Indulgence.
                    </p>
                    <span className="inline-flex items-center justify-center w-8 h-6 mt-2 bg-white text-[#1A1A1A] text-[12px] font-medium">
                      →
                    </span>
                  </div>
                </div>

                {/* Tightly spaced product cards over frosted bottom */}
                <div className="space-y-2">
                  {preorderWagyuPicks.map((p) => (
                    <div
                      key={p.name}
                      onClick={() => navigate('pdp', p.id)}
                      className="bg-white/95 backdrop-blur-xs p-2 flex items-center gap-2.5 text-[#1A1A1A] cursor-pointer"
                    >
                      <div className="relative w-[78px] h-[78px] bg-white overflow-hidden shrink-0">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        {p.signature && (
                          <span
                            className="absolute top-0 left-0 px-1.5 py-0.5 text-[9px] font-semibold text-white"
                            style={{ backgroundColor: t.primary }}
                          >
                            Signature
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] leading-[16px] font-normal text-[#1A1A1A] line-clamp-2">
                          {p.name}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <PriceBlock price={p.price} originalPrice={p.originalPrice} size="sm" />
                          <div className="w-[78px] shrink-0">
                            <ProductAddControl productId={p.id} fullWidth />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide 2: Good Company Great Moments — Champagne (Figma I8817:86863;5065:86670) */}
            <div className="w-full shrink-0 snap-center relative overflow-hidden bg-[#1A1512]">
              <img
                src={MP_ASSETS.preorderChampagneBg}
                alt="Good Company Great Moments"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.75) 75%, rgba(0,0,0,0.9) 100%)',
                }}
              />

              <div className="relative z-10 p-4 flex flex-col gap-5">
                <div className="space-y-2.5">
                  <h2
                    className="text-[22px] leading-[24px] font-normal text-[#DED6C9]"
                    style={{ fontFamily: t.heroFont, color: '#DED6C9' }}
                  >
                    Good Company
                    <br />
                    Great Moments
                  </h2>
                  <div className="w-[30px] h-[1px] bg-[#DED6C9]" />
                  <p className="text-[11px] leading-[14px] tracking-[0.08em] text-[#DED6C9] uppercase">
                    RAISE A BRIGHTER TOMORROW
                  </p>
                  <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#DED6C9] text-black text-[12px] font-medium">
                    VIEW ALL
                  </span>
                </div>

                <div className="space-y-2">
                  {preorderChampagnePicks.map((p) => (
                    <div
                      key={p.name}
                      onClick={() => navigate('pdp', p.id)}
                      className="bg-white/95 backdrop-blur-xs p-2 flex items-center gap-2.5 text-[#1A1A1A] cursor-pointer"
                    >
                      <div className="w-[78px] h-[78px] bg-white overflow-hidden shrink-0">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] leading-[16px] font-normal text-[#1A1A1A] line-clamp-2">
                          {p.name}
                        </p>
                        {p.promo && <PromoTag label={p.promo} className="mt-1" />}
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <PriceBlock price={p.price} originalPrice={p.originalPrice} size="sm" />
                          <div className="w-[78px] shrink-0">
                            <ProductAddControl productId={p.id} fullWidth />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide Dots */}
          <div className="flex justify-center gap-1.5">
            {[0, 1].map((idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Pre-order slide ${idx + 1}`}
                onClick={() => {
                  const el = preorderTrackRef.current;
                  if (el) el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
                }}
                className="h-[4px] rounded-full transition-all"
                style={{
                  width: preorderSlide === idx ? '20px' : '12px',
                  backgroundColor: preorderSlide === idx ? t.primary : '#D4D0C8',
                }}
              />
            ))}
          </div>
        </section>

        {/* 6. Our Brands (3hreesixty & OLIVER'S) */}
        <section className="px-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] leading-[22px] font-semibold" style={headingStyle}>
              Our Brands
            </h2>
            <ChevronRight className="w-4 h-4 text-[#666666]" />
          </div>

          <div className="space-y-2">
            {[
              {
                name: '3hreesixty',
                tagline: 'Healthy, natural & organic living',
                bgImg: MP_ASSETS.brand360Bg,
                logoSvg: MP_ASSETS.brand360Logo,
                prodImg: MP_ASSETS.brand360Prod,
                price: 688.0,
                productId: 'us-beef-blade',
              },
              {
                name: "OLIVER'S",
                tagline: "The world's finest gourmet",
                bgImg: MP_ASSETS.brandOliversBg,
                logoSvg: MP_ASSETS.brandOliversLogo,
                prodImg: MP_ASSETS.brandOliversProd,
                price: 1288.0,
                productId: 'belena-shiraz',
              },
            ].map((b) => (
              <div
                key={b.name}
                onClick={() => navigate('pdp', b.productId)}
                className="relative h-[152px] overflow-hidden p-3.5 flex items-center justify-between gap-3 text-white cursor-pointer active:opacity-95"
              >
                <img
                  src={b.bgImg}
                  alt={b.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative z-10 flex-1 min-w-0">
                  <img
                    src={b.logoSvg}
                    alt={b.name}
                    className="h-[22px] w-auto object-contain brightness-0 invert"
                  />
                  <p className="text-[12px] text-white/90 mt-1.5">{b.tagline}</p>
                  <span className="inline-flex items-center justify-center w-7 h-5 mt-3 border border-white/70 text-[11px]">
                    →
                  </span>
                </div>

                <div className="relative z-10 w-[108px] h-[124px] bg-white flex flex-col items-center justify-between shrink-0 shadow-md overflow-hidden pb-1">
                  <img
                    src={b.prodImg}
                    alt={b.name}
                    className="w-full h-[96px] object-cover"
                  />
                  <PriceBlock price={b.price} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Today's deal */}
        <section className="space-y-2">
          <div className="px-4 flex items-center justify-between">
            <h2 className="text-[16px] leading-[22px] font-semibold" style={headingStyle}>
              Today&apos;s deal
            </h2>
            <button
              type="button"
              onClick={() => navigate('smart-tips')}
              className="inline-flex items-center text-[12px] text-[#666666]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-0.5">
            {todaysDeals.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variant="compact"
                className="w-[136px] shrink-0"
              />
            ))}
          </div>
        </section>

        {/* 8. Featured Brands — 4 Switchable Brand Tabs + Full-Height Left Hero + 3-Card Scroll Shelf (Figma 8817:86904) */}
        <section className="space-y-2">
          <div className="px-4 flex items-center justify-between">
            <h2 className="text-[16px] leading-[22px] font-semibold" style={headingStyle}>
              Featured Brands
            </h2>
            <ChevronRight className="w-4 h-4 text-[#666666]" />
          </div>

          {/* 4 Clickable Brand Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            {featuredBrands.map((brand, idx) => {
              const active = idx === activeBrandIdx;
              const isBenecol = idx === 3;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setActiveBrandIdx(idx)}
                  className="w-[88px] h-[40px] shrink-0 flex items-center justify-center px-2 transition-colors"
                  style={{
                    backgroundColor: isBenecol ? '#007C7B' : '#FFFFFF',
                    border: active ? `1.5px solid ${t.primary}` : '1px solid #E0E0E0',
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-[26px] max-w-[68px] object-contain"
                  />
                </button>
              );
            })}
          </div>

          {/* Full-Height Left Vertical Hero + Horizontal Product Shelf */}
          <div
            className="relative overflow-x-auto no-scrollbar py-2 pl-[116px] pr-2 transition-colors"
            style={{ backgroundColor: activeBrand.bg }}
          >
            {/* Full-height left brand photo with right gradient fade (zero top/bottom truncation) */}
            <div className="absolute left-0 top-0 bottom-0 w-[166px] pointer-events-none overflow-hidden">
              <img
                src={activeBrand.heroImg}
                alt={activeBrand.name}
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-y-0 right-0 w-[52px]"
                style={{
                  background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${activeBrand.bg} 100%)`,
                }}
              />
              <div
                className="absolute top-2 left-2 px-2 py-1 shadow-xs"
                style={{ backgroundColor: activeBrandIdx === 3 ? '#007C7B' : 'rgba(255,255,255,0.95)' }}
              >
                <img
                  src={activeBrand.logo}
                  alt={activeBrand.name}
                  className="h-[20px] w-auto object-contain"
                />
              </div>
            </div>

            {/* Horizontal 3-card product shelf */}
            <div className="relative z-10 inline-flex gap-2 bg-white p-2 shadow-xs">
              {activeBrand.products.map((p, idx) => (
                <ProductCard
                  key={`${activeBrand.id}-${idx}`}
                  product={p}
                  variant="compact"
                  className="w-[132px] shrink-0"
                />
              ))}
            </div>
          </div>
        </section>

        {/* 9. Feed Tabs & Waterfall */}
        <section className="px-3 pt-1">
          <div className="flex items-center gap-5 px-1 pb-2.5 border-b border-black/5 mb-2.5">
            {(
              [
                { id: 'recommend', label: 'Recommend' },
                { id: 'dinner', label: 'Dinner Specials' },
                { id: 'healthy', label: 'Healthy Choice' },
              ] as const
            ).map((tab) => {
              const active = feedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFeedTab(tab.id)}
                  className="text-[14px] leading-[20px] pb-1.5 border-b-2 transition-colors whitespace-nowrap"
                  style={
                    active
                      ? {
                          borderColor: t.feedTabActive,
                          color: t.feedTabActive,
                          fontWeight: 700,
                        }
                      : {
                          borderColor: 'transparent',
                          color: '#555555',
                          fontWeight: 500,
                        }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 2-Column Content-Adaptive Waterfall */}
          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate('pdp', 'belena-shiraz')}
                className="relative w-full h-[216px] overflow-hidden bg-[#1D2421] text-left p-3 flex flex-col justify-between"
              >
                <img
                  src={MP_ASSETS.preorderChampagneBg}
                  alt="Good Company Great Moments"
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />
                <div className="relative z-10">
                  <p className="text-[10px] tracking-[0.14em] uppercase" style={{ color: t.gold }}>
                    CELLAR SELECTION
                  </p>
                  <p
                    className="text-[17px] leading-[22px] text-white mt-1"
                    style={{ fontFamily: t.heroFont }}
                  >
                    Good Company,
                    <br />
                    Great Moments
                  </p>
                </div>
                <span className="relative z-10 inline-flex items-center gap-1 text-[11px] font-medium text-white/90">
                  Explore wines <ArrowRight className="w-3 h-3" />
                </span>
              </button>

              {feedProducts
                .filter((_, idx) => idx % 2 === 1)
                .map((p) => (
                  <ProductCard key={p.id} product={p} variant="waterfall" />
                ))}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {feedProducts
                .filter((_, idx) => idx % 2 === 0)
                .map((p) => (
                  <ProductCard key={p.id} product={p} variant="waterfall" />
                ))}

              <div
                className="p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-[10px] bg-white"
                style={{ borderTop: `2px solid ${t.gold}` }}
              >
                <div className="text-[15px] leading-[20px] font-semibold" style={headingStyle}>
                  Top Fruits
                </div>
                <div className="space-y-[10px]">
                  {topFruits.map(({ rank, product, displayPrice }) => (
                    <div
                      key={product.id}
                      onClick={() => navigate('pdp', product.id)}
                      className="flex items-center gap-[8px] cursor-pointer"
                    >
                      <div className="relative w-[44px] h-[44px] shrink-0 overflow-hidden bg-white">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute top-0 left-0 w-[15px] h-[15px] text-white text-[10px] font-bold flex items-center justify-center"
                          style={{
                            backgroundColor:
                              rank === 1 ? '#D4A853' : rank === 2 ? '#9AA5B1' : '#C08A5B',
                          }}
                        >
                          {rank}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] leading-[16px] text-[#1A1A1A] line-clamp-2 font-normal">
                          {product.name}
                        </p>
                        <div className="flex items-end justify-between mt-[4px]">
                          <PriceBlock price={displayPrice} size="xs" />
                          <div className="relative w-[32px] h-[32px] shrink-0">
                            <ProductAddControl
                              productId={product.id}
                              size="sm"
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Bottom Shell */}
      <div className="app-fixed-bar bottom-0 z-30 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <ThresholdProgressBar variant="compact" onClick={() => navigate('smart-tips')} />
        <AppTabBar />
      </div>
    </div>
  );
};
