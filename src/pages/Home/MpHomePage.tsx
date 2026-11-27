import React, { useEffect, useState } from 'react';
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
  qualityBg: '/assets/figma/mp/quality-bg.png',
  qualityTitle: '/assets/figma/mp/quality-title.svg',
  qualitySalmon: '/assets/figma/mp/quality-salmon.png',
  qualityRose: '/assets/figma/mp/quality-rose.png',
  qualityOrange: '/assets/figma/mp/quality-orange.png',
  preorderWagyuBg: '/assets/figma/mp/preorder-wagyu-bg.png',
  preorderWagyu1: '/assets/figma/mp/preorder-wagyu-1.png',
  preorderWagyu2: '/assets/figma/mp/preorder-wagyu-2.png',
  brand360Bg: '/assets/figma/mp/brand-360-bg.png',
  brand360Logo: '/assets/figma/mp/brand-360-logo.svg',
  brand360Prod: '/assets/figma/mp/brand-360-prod.png',
  brandOliversBg: '/assets/figma/mp/brand-olivers-bg.png',
  brandOliversLogo: '/assets/figma/mp/brand-olivers-logo.svg',
  brandOliversProd: '/assets/figma/mp/brand-olivers-prod.png',
  featuredZespriBg: '/assets/figma/mp/featured-zespri-bg.png',
  featuredZespriLogo: '/assets/figma/mp/featured-zespri-logo.png',
};

const QUALITY_CATS = ['All', 'Seasonal Pick', 'Healthy Choice', 'Wine & Spirits'] as const;

const QUICK_CATEGORIES = [
  { label: 'Wine', img: MP_ASSETS.catWine, productId: 'belena-shiraz' },
  { label: 'Meat', img: MP_ASSETS.catMeat, productId: 'us-beef-blade' },
  { label: 'Fruit', img: MP_ASSETS.catFruit, productId: 'fuji-apple' },
  { label: 'Seafood', img: MP_ASSETS.catSeafood, productId: 'jumbo-blueberry' },
  { label: 'Dairy & Deli', img: ASSETS.eminaCheese, productId: 'emina-cheese' },
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
  const [qualityCat, setQualityCat] = useState<(typeof QUALITY_CATS)[number]>('All');
  const [feedTab, setFeedTab] = useState<'recommend' | 'dinner' | 'healthy'>('recommend');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      name: 'Kirkland Signature Fresh Farmed Atlantic Salmon Fillet',
      img: MP_ASSETS.qualitySalmon,
      price: 168.0,
      originalPrice: 198.0,
      promo: '20% Off',
      badge: 'New',
    },
    {
      id: 'belena-shiraz',
      name: "CH D'ESCLANS Whispering Angel Rosé 2024 750ML",
      img: MP_ASSETS.qualityRose,
      price: 178.0,
      originalPrice: 215.0,
    },
    {
      id: 'flash-orange',
      name: 'Australian Navel Orange High Brix 1kg',
      img: MP_ASSETS.qualityOrange,
      price: 78.0,
      originalPrice: 92.0,
    },
  ];

  const preorderPicks = [
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
              src={isDelivery ? ICONS.truck : ICONS.cncBag}
              alt=""
              className="w-[16px] h-[16px] object-contain brightness-0 invert"
            />
          </button>

          <button
            type="button"
            onClick={() => navigate('search')}
            className="flex-1 h-[36px] bg-white rounded-[2px] pl-3 pr-1 flex items-center gap-1.5 text-left"
          >
            <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
            <span className="text-[13px] leading-[18px] text-[#858585] truncate flex-1">
              Coca-Cola
            </span>
            <img src={ICONS.qrScan} alt="" className="w-[20px] h-[20px] object-contain shrink-0 mr-1" />
            <span className="h-[28px] px-3 rounded-[2px] bg-[#F2F4F3] text-[#1A1A1A] text-[12px] leading-[16px] font-medium inline-flex items-center">
              Search
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('in-store')}
            className="flex flex-col items-center text-white shrink-0"
          >
            <img
              src={ICONS.store}
              alt="Store"
              className="w-[22px] h-[22px] object-contain brightness-0 invert"
            />
            <span className="text-[10px] leading-[12px] font-medium">Store</span>
          </button>
        </header>
      )}

      {/* 1. Editorial Hero Banner (Figma 8817:86709 — 298px, real Wagyu steak + golden oil) */}
      <section className="relative w-full h-[298px] overflow-hidden bg-[#0E0E0E]">
        <img
          src={MP_ASSETS.heroSteak}
          alt="Market Place Premium Selection"
          className="absolute inset-x-0 top-[44px] w-full h-[264px] object-cover object-center"
        />
        {/* Left subtle vignette for legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.05) 100%)',
          }}
        />
        {/* Top brand gradient overlay (Annotation #01: Black -> MP Green #28443C) */}
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
                    src={isDelivery ? ICONS.truck : ICONS.cncBag}
                    alt=""
                    className="w-[16px] h-[16px] object-contain brightness-0 invert shrink-0"
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
                    src={ICONS.bellNotice}
                    alt="Notice"
                    className="w-[22px] h-[22px] object-contain brightness-0 invert"
                  />
                  <span className="text-[10px] leading-[13px] text-white/90">Notice</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('in-store')}
                  className="flex flex-col items-center"
                >
                  <img
                    src={ICONS.store}
                    alt="Store"
                    className="w-[22px] h-[22px] object-contain brightness-0 invert"
                  />
                  <span className="text-[10px] leading-[13px] text-white/90">Store</span>
                </button>
              </div>
            </div>

            {/* Sharp Editorial Search Bar (Figma 8817:86709) */}
            <button
              type="button"
              onClick={() => navigate('search')}
              className="w-full h-[40px] bg-white rounded-[2px] pl-3 pr-1 flex items-center gap-2 shadow-sm"
            >
              <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
              <span className="text-[14px] leading-[20px] text-[#858585]">Coca-Cola</span>
              <div className="flex-1" />
              <img src={ICONS.qrScan} alt="" className="w-[22px] h-[22px] object-contain shrink-0 mr-1" />
              <span className="h-[32px] px-4 rounded-[2px] bg-[#F2F4F3] text-[#1A1A1A] text-[13px] leading-[18px] font-medium inline-flex items-center justify-center">
                Search
              </span>
            </button>
          </div>

          {/* Editorial Hero Copy (Annotation #02: #E5C89C -> #DDB97D, Noto Serif HK -> Lora Regular) */}
          <div className="flex items-end justify-between">
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

            <span className="px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-xs text-white text-[11px] leading-[16px] font-medium">
              1/10 &gt;
            </span>
          </div>
        </div>
      </section>

      {/* 2. Circular Editorial Category Strip (Figma 8817:86728 — 56×56 full-bleed photos + indicator) */}
      <section className="bg-white pt-4 pb-3 px-2 flex flex-col items-center gap-3">
        <div className="w-full flex items-start justify-between gap-1 overflow-x-auto no-scrollbar px-1">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => navigate('pdp', cat.productId)}
              className="w-[72px] shrink-0 flex flex-col items-center gap-1.5 active:opacity-80"
            >
              <div className="w-[56px] h-[56px] rounded-full overflow-hidden bg-[#F5F3EE] shrink-0">
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-[12px] leading-[15px] text-[#3D3D3D] font-normal text-center line-clamp-2">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
        <div className="w-[48px] h-[4px] rounded-full bg-[#E5E5E5] overflow-hidden">
          <div
            className="w-[20px] h-full rounded-full transition-colors"
            style={{ backgroundColor: t.primary }}
          />
        </div>
      </section>

      {/* Main Content Floors */}
      <div className="pt-3 space-y-3">
        {/* 3. Pick up where you left off (Annotation #03 & #04) */}
        <section className="px-3 space-y-2">
          <h2
            className="text-[16px] leading-[22px] font-semibold transition-colors"
            style={headingStyle}
          >
            Pick up where you left off
          </h2>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
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
            ].map((group) => (
              <div
                key={group.title}
                className="w-[276px] shrink-0 bg-white rounded-[4px] p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
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
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate('pdp', item.id)}
                      className="aspect-square rounded-[4px] bg-[#FAF9F6] p-1 flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <img src={item.img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Quality Picks (Figma 8817:86862 — real photography bg + scripted title + #0F3655 active pill) */}
        <section className="relative overflow-hidden">
          <div className="relative h-[136px] w-full overflow-hidden">
            <img
              src={MP_ASSETS.qualityBg}
              alt="Quality Picks"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[72px]"
              style={{
                background: `linear-gradient(180deg, rgba(247,245,240,0) 0%, ${t.canvasBg} 100%)`,
              }}
            />
            <div className="relative z-10 pt-7 pl-8">
              <p className="text-[10px] tracking-[0.06em] uppercase text-[#724300] font-normal mb-1">
                CURATED FOR YOU
              </p>
              <img
                src={MP_ASSETS.qualityTitle}
                alt="Quality Picks"
                className="h-[46px] w-auto object-contain"
              />
            </div>
          </div>

          {/* Filter Pills — Annotation #05: Active pill #155D2D (Before) -> MP Blue #0F3655 (Option 1) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
            {QUALITY_CATS.map((cat) => {
              const active = qualityCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setQualityCat(cat)}
                  className="h-[30px] px-3.5 rounded-full text-[12px] leading-[16px] font-medium shrink-0 transition-colors"
                  style={
                    active
                      ? { backgroundColor: t.accentBlue, color: '#FFFFFF' }
                      : { backgroundColor: '#FFFFFF', color: '#3D3D3D', border: '1px solid #EAE7E1' }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Ranked 1-2-3 Gourmet List */}
          <div className="mx-3 bg-white rounded-[4px] divide-y divide-[#F2F0EB] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {qualityPicks.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => navigate('pdp', p.id)}
                className="flex items-center gap-2.5 px-3 py-3 cursor-pointer active:bg-[#FAF9F6]"
              >
                <span
                  className="w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: idx === 0 ? t.gold : '#E6E3DC',
                    color: idx === 0 ? '#1A1A1A' : '#555555',
                  }}
                >
                  {idx + 1}
                </span>
                <div className="relative w-[62px] h-[62px] rounded-[4px] bg-[#FAF9F6] p-1 flex items-center justify-center shrink-0">
                  <img src={p.img} alt={p.name} className="w-full h-full object-contain" />
                  {p.badge && (
                    <div className="absolute -top-1 -right-1">
                      <PromoTag label={p.badge} variant="new" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-[18px] font-medium text-[#1A1A1A] line-clamp-2">
                    {p.name}
                  </p>
                  {p.promo && <PromoTag label={p.promo} className="mt-1" />}
                  <PriceBlock
                    price={p.price}
                    originalPrice={p.originalPrice}
                    size="sm"
                    className="mt-1"
                  />
                </div>
                <ProductAddControl productId={p.id} />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Fresh pre-order (Figma 8817:86863 — real full-bleed Wagyu hotpot photo + Sage #9CAF88 badge) */}
        <section className="relative w-full h-[520px] overflow-hidden bg-[#1D1815]">
          <img
            src={MP_ASSETS.preorderWagyuBg}
            alt="Fresh pre-order Wagyu"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0.88) 100%)',
            }}
          />

          <div className="relative z-10 h-full flex flex-col justify-between p-4">
            {/* Top Copy (Annotation #07) */}
            <div className="space-y-4">
              <span
                className="inline-block px-2.5 py-1 text-[14px] leading-[18px] font-semibold text-white transition-colors"
                style={{ backgroundColor: t.sage, fontFamily: t.heroFont }}
              >
                Fresh pre-order
              </span>

              <div>
                <h2
                  className="text-[24px] leading-[28px] font-normal text-white"
                  style={{ fontFamily: t.heroFont }}
                >
                  Bring Home,
                  <br />
                  <span style={{ color: t.gold }}>Something Special.</span>
                </h2>
                <p className="text-[12px] text-white/85 mt-2">
                  Curated A5 Wagyu for Everyday Indulgence.
                </p>
                <span className="inline-flex items-center justify-center w-8 h-6 mt-2.5 bg-white text-[#1A1A1A] text-[12px] font-medium">
                  →
                </span>
              </div>
            </div>

            {/* Bottom Frosted Wagyu Product Cards */}
            <div className="space-y-2">
              {preorderPicks.map((p) => (
                <div
                  key={p.name}
                  onClick={() => navigate('pdp', p.id)}
                  className="bg-white/95 backdrop-blur-xs rounded-[2px] p-2.5 flex items-center gap-2.5 text-[#1A1A1A] cursor-pointer"
                >
                  <div className="relative w-[68px] h-[68px] rounded-[2px] bg-[#FAF9F6] overflow-hidden shrink-0">
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
                    <p className="text-[12px] leading-[16px] font-medium text-[#1A1A1A] line-clamp-2">
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
        </section>

        {/* 6. Our Brands (Figma 8817:86864 — real 3hreesixty & OLIVER'S photography + official SVG logos) */}
        <section className="px-3 space-y-2">
          <div className="flex items-center justify-between px-1">
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
                className="relative h-[152px] rounded-[4px] overflow-hidden p-3.5 flex items-center justify-between gap-3 text-white cursor-pointer active:opacity-95"
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
                  <span className="inline-flex items-center justify-center w-7 h-5 mt-3 rounded-[2px] border border-white/70 text-[11px]">
                    →
                  </span>
                </div>

                <div className="relative z-10 w-[108px] h-[120px] rounded-[2px] bg-white p-1.5 flex flex-col items-center justify-between shrink-0 shadow-md">
                  <img
                    src={b.prodImg}
                    alt={b.name}
                    className="w-[88px] h-[84px] object-contain"
                  />
                  <span className="text-[12px] font-bold" style={{ color: t.primary }}>
                    &#36;{b.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Today's deal (Annotation #09) */}
        <section className="px-3 space-y-2">
          <div className="flex items-center justify-between px-1">
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

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
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

        {/* 8. Featured Brands (Figma 8817:86904 — real Zespri brand logo & kiwi editorial hero) */}
        <section className="px-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[16px] leading-[22px] font-semibold" style={headingStyle}>
              Featured Brands
            </h2>
            <ChevronRight className="w-4 h-4 text-[#666666]" />
          </div>

          <div className="bg-white rounded-[4px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="relative h-[126px] w-full overflow-hidden">
              <img
                src={MP_ASSETS.featuredZespriBg}
                alt="Zespri SunGold Kiwifruit"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2.5 left-3 bg-white/95 px-2.5 py-1 rounded-[4px] shadow-xs">
                <img
                  src={MP_ASSETS.featuredZespriLogo}
                  alt="Zespri"
                  className="h-[22px] w-auto object-contain"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2">
              {[
                PRODUCTS.find((p) => p.id === 'zespri-kiwi')!,
                PRODUCTS.find((p) => p.id === 'fuji-apple')!,
              ].map((p) => (
                <ProductCard key={p.id} product={p} variant="grid" />
              ))}
            </div>
          </div>
        </section>

        {/* 9. Feed Tabs & Waterfall (Annotation #11: active tab #E40032 -> #28443C; #12: Top Fruits) */}
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
            {/* Left Column */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate('pdp', 'belena-shiraz')}
                className="relative w-full h-[216px] rounded-[4px] overflow-hidden bg-[#1D2421] text-left p-3 flex flex-col justify-between"
              >
                <img
                  src={MP_ASSETS.heroSteak}
                  alt="Good Company Great Moments"
                  className="absolute inset-0 w-full h-full object-cover opacity-55"
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

            {/* Right Column */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {feedProducts
                .filter((_, idx) => idx % 2 === 0)
                .map((p) => (
                  <ProductCard key={p.id} product={p} variant="waterfall" />
                ))}

              {/* Top Fruits Ranked Card (Annotation #12) */}
              <div
                className="rounded-[4px] p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-[10px] bg-white"
                style={{
                  borderTop: `2px solid ${t.gold}`,
                }}
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
                      <div className="relative w-[42px] h-[42px] shrink-0 flex items-center justify-center bg-[#FAF9F6] rounded-[4px]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                        <span
                          className="absolute -top-1 -left-1 w-[15px] h-[15px] rounded-[2px] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center"
                          style={{
                            backgroundColor:
                              rank === 1 ? t.gold : rank === 2 ? '#D6E4F0' : '#E6D5B8',
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
                          <span
                            className="inline-flex items-baseline font-bold"
                            style={{ color: t.primary }}
                          >
                            <span className="text-[10px]">&#36;</span>
                            <span className="text-[14px] leading-[18px]">{displayPrice}</span>
                            <span className="text-[10px]">.00</span>
                          </span>
                          <ProductAddControl productId={product.id} size="sm" />
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

      {/* Fixed Bottom Shell: ThresholdProgressBar (Annotation #13) + AppTabBar (Annotation #14) */}
      <div className="app-fixed-bar bottom-0 z-30 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <ThresholdProgressBar variant="compact" onClick={() => navigate('smart-tips')} />
        <AppTabBar />
      </div>
    </div>
  );
};
