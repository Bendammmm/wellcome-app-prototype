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
import { ThresholdProgressBar } from '../../components/shared/ThresholdProgressBar';

const QUALITY_CATS = ['All', 'Seasonal Pick', 'Healthy Choice', 'Wine & Spirits'] as const;

const QUICK_CATEGORIES = [
  { label: 'Wine', img: ASSETS.wineBelenaAward, productId: 'belena-shiraz' },
  { label: 'Meat', img: ASSETS.beef, productId: 'us-beef-blade' },
  { label: 'Fruit', img: ASSETS.fujiApple, productId: 'fuji-apple' },
  { label: 'Berries', img: ASSETS.blueberry, productId: 'jumbo-blueberry' },
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
    const onScroll = () => setScrolled(window.scrollY > 150);
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
    PRODUCTS.find((p) => p.id === 'us-beef-blade')!,
    PRODUCTS.find((p) => p.id === 'belena-shiraz')!,
    PRODUCTS.find((p) => p.id === 'flash-orange') ?? PRODUCTS[0],
  ];

  const preorderPicks = [
    PRODUCTS.find((p) => p.id === 'us-beef-blade')!,
    PRODUCTS.find((p) => p.id === 'ferrarini-ham') ?? PRODUCTS[1],
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
  const heroOverlayBg = t.isMpOpt1
    ? 'linear-gradient(180deg, #28443C 0%, rgba(40,68,60,0.92) 48%, rgba(40,68,60,0.45) 78%, rgba(40,68,60,0.82) 100%)'
    : 'linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.88) 48%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0.82) 100%)';

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
            className="flex-1 h-[36px] bg-white rounded-[4px] pl-3 pr-1 flex items-center gap-1.5 text-left"
          >
            <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
            <span className="text-[13px] leading-[18px] text-[#858585] truncate flex-1">
              Search Market Place
            </span>
            <img src={ICONS.qrScan} alt="" className="w-[22px] h-[22px] object-contain shrink-0 mr-1" />
            <span
              className="h-[28px] px-3 rounded-[2px] text-[12px] leading-[16px] font-semibold inline-flex items-center"
              style={{ backgroundColor: t.primarySoftBg, color: t.primary }}
            >
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

      {/* 1. Editorial Hero Banner (Annotation #01 & #02) */}
      <section className="relative w-full h-[276px] overflow-hidden bg-[#111]">
        <img
          src={ASSETS.beef}
          alt="Market Place Heritage Culinary"
          className="absolute inset-0 w-full h-full object-cover object-center scale-110 opacity-85"
        />
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{ backgroundImage: heroOverlayBg }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between px-3 pt-[max(14px,env(safe-area-inset-top))] pb-4">
          {/* Top Bar */}
          <div className="space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="space-y-1 min-w-0 flex-1 pr-2">
                <div className="inline-flex items-center gap-1 text-[11px] leading-[15px] font-medium text-white/90">
                  <span className="font-semibold">2,100</span>
                  <img src={ASSETS.yuuCoin} alt="yuu" className="w-[14px] h-[14px] object-contain" />
                  <span>= &#36;105</span>
                </div>

                <button
                  type="button"
                  onClick={openFulfillmentSheet}
                  className="flex items-center gap-1 text-[13px] leading-[18px] text-white max-w-full"
                >
                  <img
                    src={isDelivery ? ICONS.truck : ICONS.cncBag}
                    alt=""
                    className="w-[15px] h-[15px] object-contain brightness-0 invert shrink-0"
                  />
                  <span className="font-semibold shrink-0">
                    {isDelivery ? 'Delivery' : 'Click & Collect'}
                  </span>
                  <span className="truncate font-normal text-white/85">{navLocation}</span>
                  <img
                    src={ICONS.chevronDown}
                    alt=""
                    className="w-[14px] h-[14px] object-contain brightness-0 invert shrink-0"
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-0.5 text-white">
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
                  <span className="text-[10px] leading-[13px] text-white/85">Notice</span>
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
                  <span className="text-[10px] leading-[13px] text-white/85">Store</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <button
              type="button"
              onClick={() => navigate('search')}
              className="w-full h-[38px] bg-white rounded-[4px] pl-3 pr-1 flex items-center gap-2 shadow-sm"
            >
              <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
              <span className="text-[13px] leading-[18px] text-[#858585]">Coca-Cola</span>
              <div className="flex-1" />
              <img src={ICONS.qrScan} alt="" className="w-[22px] h-[22px] object-contain shrink-0 mr-1" />
              <span
                className="h-[30px] px-3.5 rounded-[2px] text-[12px] leading-[16px] font-semibold inline-flex items-center justify-center"
                style={{ backgroundColor: t.primarySoftBg, color: t.primary }}
              >
                Search
              </span>
            </button>
          </div>

          {/* Editorial Hero Copy (Annotation #02: #E5C89C -> #DDB97D, Noto Serif HK -> Lora Regular) */}
          <div className="pt-4">
            <p
              className="text-[10px] tracking-[0.16em] uppercase font-medium mb-1 transition-colors"
              style={{ color: t.gold }}
            >
              CURATED BY MARKET PLACE
            </p>
            <h1
              className="text-[22px] leading-[28px] font-normal text-white max-w-[240px]"
              style={{ fontFamily: t.heroFont }}
            >
              A great evening,
              <br />
              beautifully simple.
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Circular Editorial Category Strip */}
      <section className="bg-white px-3 py-3 border-b border-black/5">
        <div className="grid grid-cols-5 gap-2">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => navigate('pdp', cat.productId)}
              className="flex flex-col items-center gap-1.5 active:opacity-80"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-[#F5F3EE] p-1.5 overflow-hidden flex items-center justify-center border border-black/5">
                <img src={cat.img} alt={cat.label} className="w-full h-full object-contain" />
              </div>
              <span className="text-[11px] leading-[14px] text-[#3D3D3D] font-medium text-center">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Floors */}
      <div className="px-2.5 pt-3 space-y-3">
        {/* 3. Pick up where you left off (Annotation #03 & #04) */}
        <section className="space-y-2">
          <h2
            className="px-0.5 text-[17px] leading-[24px] font-semibold transition-colors"
            style={headingStyle}
          >
            Pick up where you left off
          </h2>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              {
                title: 'Recently Viewed',
                items: [
                  { id: 'us-beef-blade', img: ASSETS.beef },
                  { id: 'ferrarini-ham', img: ASSETS.ferrariniHam },
                  { id: 'zespri-kiwi', img: ASSETS.kiwi },
                ],
              },
              {
                title: 'Buy it again',
                items: [
                  { id: 'belena-shiraz', img: ASSETS.wineBelenaAward },
                  { id: 'jumbo-blueberry', img: ASSETS.blueberry },
                  { id: 'fuji-apple', img: ASSETS.fujiApple },
                ],
              },
            ].map((group) => (
              <div
                key={group.title}
                className="w-[272px] shrink-0 bg-white rounded-[6px] p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
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
                      className="aspect-square rounded-[4px] bg-[#FAF9F6] p-1.5 flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <img src={item.img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Quality Picks (Annotation #05: All pill #155D2D -> MP Blue #0F3655; #06 global brand green) */}
        <section className="bg-white rounded-[8px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div
            className="px-3.5 pt-3.5 pb-3"
            style={{
              background: t.isMpOpt1
                ? 'linear-gradient(135deg, #F3EEE2 0%, #E7DFCE 100%)'
                : 'linear-gradient(135deg, #F3EFE6 0%, #E8E0D0 100%)',
            }}
          >
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#6E6352] font-semibold">
              CHEF&apos;S SELECTION
            </p>
            <h2
              className="text-[20px] leading-[26px] font-semibold mt-0.5"
              style={headingStyle}
            >
              Quality Picks
            </h2>
          </div>

          {/* Filter Pills — Active pill switches #155D2D -> MP Blue #0F3655 in Option 1 */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2.5 border-b border-[#F2F0EB]">
            {QUALITY_CATS.map((cat) => {
              const active = qualityCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setQualityCat(cat)}
                  className="h-[28px] px-3 rounded-full text-[12px] leading-[16px] font-medium shrink-0 transition-colors"
                  style={
                    active
                      ? { backgroundColor: t.accentBlue, color: '#FFFFFF' }
                      : { backgroundColor: '#F5F3EE', color: '#444444' }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Ranked 1-2-3 List */}
          <div className="divide-y divide-[#F2F0EB]">
            {qualityPicks.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => navigate('pdp', p.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer active:bg-[#FAF9F6]"
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
                <div className="w-[54px] h-[54px] rounded-[4px] bg-[#FAF9F6] p-1 flex items-center justify-center shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-[18px] font-medium text-[#1A1A1A] line-clamp-2">
                    {p.name}
                  </p>
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

        {/* 5. Fresh pre-order (Annotation #07: badge #155D2D -> Sage #9CAF88; Lora Regular title) */}
        <section className="rounded-[8px] overflow-hidden bg-[#1D1C1A] text-white shadow-sm">
          <div className="relative px-3.5 pt-4 pb-3">
            <span
              className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-[2px] text-white mb-2 transition-colors"
              style={{ backgroundColor: t.sage }}
            >
              Fresh pre-order
            </span>
            <h2
              className="text-[22px] leading-[28px] font-normal text-white"
              style={{ fontFamily: t.heroFont }}
            >
              Bring Home,
              <br />
              Something Special.
            </h2>
            <p className="text-[11px] text-white/70 mt-1">
              Air-flown Wagyu &amp; seasonal delicacies, reserved to order.
            </p>
          </div>

          <div className="px-3 pb-3 space-y-2">
            {preorderPicks.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate('pdp', p.id)}
                className="bg-white rounded-[4px] p-2.5 flex items-center gap-2.5 text-[#1A1A1A] cursor-pointer"
              >
                <div className="w-[58px] h-[58px] rounded-[4px] bg-[#FAF9F6] p-1 flex items-center justify-center shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-[16px] font-medium text-[#1A1A1A] line-clamp-2">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <PriceBlock price={p.price} originalPrice={p.originalPrice} size="sm" />
                    <div className="w-[74px] shrink-0">
                      <ProductAddControl productId={p.id} fullWidth />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Our Brands (Annotation #08) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-[17px] leading-[24px] font-semibold" style={headingStyle}>
              Our Brands
            </h2>
            <ChevronRight className="w-4 h-4 text-[#666666]" />
          </div>

          <div className="space-y-2">
            {[
              {
                brand: '3hreesixty',
                tagline: 'Healthy, natural & organic living',
                bg: 'linear-gradient(110deg, #5C555B 0%, #83757C 100%)',
                product: PRODUCTS.find((p) => p.id === 'us-beef-blade')!,
              },
              {
                brand: "OLIVER'S",
                tagline: "The world's finest gourmet",
                bg: 'linear-gradient(110deg, #6E4730 0%, #9E6842 100%)',
                product: PRODUCTS.find((p) => p.id === 'belena-shiraz')!,
              },
            ].map((b) => (
              <div
                key={b.brand}
                onClick={() => navigate('pdp', b.product.id)}
                className="rounded-[6px] p-3 flex items-center justify-between gap-3 text-white cursor-pointer active:opacity-95"
                style={{ background: b.bg }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[18px] leading-[22px] font-semibold tracking-wide"
                    style={{ fontFamily: t.heroFont }}
                  >
                    {b.brand}
                  </p>
                  <p className="text-[11px] text-white/85 mt-1">{b.tagline}</p>
                  <span className="inline-flex items-center justify-center w-6 h-5 mt-2 rounded-[2px] border border-white/60 text-[11px]">
                    →
                  </span>
                </div>
                <div className="w-[82px] h-[82px] rounded-[4px] bg-white p-1.5 flex flex-col items-center justify-between shrink-0">
                  <img
                    src={b.product.image}
                    alt={b.product.name}
                    className="w-[54px] h-[54px] object-contain"
                  />
                  <span className="text-[11px] font-bold" style={{ color: t.primary }}>
                    &#36;{b.product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Today's deal (Annotation #09) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-[17px] leading-[24px] font-semibold" style={headingStyle}>
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

        {/* 8. Featured Brands (Annotation #10) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-[17px] leading-[24px] font-semibold" style={headingStyle}>
              Featured Brands
            </h2>
            <ChevronRight className="w-4 h-4 text-[#666666]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              PRODUCTS.find((p) => p.id === 'zespri-kiwi')!,
              PRODUCTS.find((p) => p.id === 'fuji-apple')!,
            ].map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        </section>

        {/* 9. Feed Tabs & Waterfall (Annotation #11: active tab #E40032 -> #28443C; #12: Top Fruits Lora SemiBold) */}
        <section className="pt-1">
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
              {/* Editorial Wine Moment Card */}
              <button
                type="button"
                onClick={() => navigate('pdp', 'belena-shiraz')}
                className="relative w-full h-[210px] rounded-[6px] overflow-hidden bg-[#1D2421] text-left p-3 flex flex-col justify-between"
              >
                <img
                  src={ASSETS.wineBelenaAward}
                  alt="Good Company Great Moments"
                  className="absolute right-[-10px] bottom-[-10px] w-[120px] h-[160px] object-contain opacity-45"
                />
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
                className="rounded-[6px] p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-[10px] bg-white"
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
