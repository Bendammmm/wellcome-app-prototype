import React, { useEffect, useRef, useState } from 'react';
import { Ticket } from 'lucide-react';
import {
  ASSETS,
  BANNERS,
  DELIVERY_ADDRESSES,
  HOME_COUPONS,
  ICONS,
  PICKUP_STORES,
  PRODUCTS,
} from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import { AppTabBar } from '../../components/shared/AppTabBar';
import { CountdownTimer } from '../../components/shared/CountdownTimer';
import { ProductAddControl } from '../../components/shared/ProductAddControl';
import { ProductCard } from '../../components/shared/ProductCard';
import { ThresholdProgressBar } from '../../components/shared/ThresholdProgressBar';

const TOP_SALES_CATS = [
  'All',
  'Fruit & Vegetable',
  'Meat & Seafood',
  'Wine & Spirits',
] as const;

const PREORDER_SLOT_1 = [
  { id: 'zespri-kiwi', img: ASSETS.kiwiCut, price: 32, badge: '50% Off' },
  { id: 'fuji-apple', img: ASSETS.fujiApple, price: 28, badge: '40% Off' },
  { id: 'jumbo-blueberry', img: ASSETS.blueberry, price: 29, badge: '30% Off' },
];

const PREORDER_SLOT_2 = [
  { id: 'flash-orange', img: ASSETS.orange, price: 32 },
  { id: 'us-beef-blade', img: ASSETS.beef, price: 58 },
  { id: 'emina-cheese', img: ASSETS.eminaCheese, price: 45 },
];

const NEW_SLOT = [
  { id: 'flash-tea', img: ASSETS.greenPouch, price: 49 },
  { id: 'ferrarini-ham', img: ASSETS.ferrariniHam, price: 78 },
  { id: 'bin-180-wine', img: ASSETS.wineBin180, price: 19 },
];

const SIGNATURE_SLOT = [
  { id: 'jumbo-blueberry', img: ASSETS.blueberry, price: 2 },
  { id: 'red-apple', img: ASSETS.redApple, price: 5 },
  { id: 'nissin-bowl', img: ASSETS.nissinBowl, price: 14 },
];

const BOGO_ROTATION = [
  { id: 'zespri-kiwi', img: ASSETS.kiwi },
  { id: 'jumbo-blueberry', img: ASSETS.blueberry },
  { id: 'fuji-apple', img: ASSETS.fujiApple },
  { id: 'us-beef-blade', img: ASSETS.beef },
];

const FREE_GIFT_ROTATION = [
  { id: 'nissin-bowl', img: ASSETS.nissinBowl },
  { id: 'flash-orange', img: ASSETS.orange },
  { id: 'flash-tea', img: ASSETS.greenPouch },
  { id: 'bin-180-wine', img: ASSETS.wineBin180 },
];

export const HomePage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const selectedAddressId = useAppStore((s) => s.selectedAddressId);
  const selectedStoreId = useAppStore((s) => s.selectedStoreId);
  const openFulfillmentSheet = useAppStore((s) => s.openFulfillmentSheet);
  const coupons = useAppStore((s) => s.coupons);
  const claimCoupon = useAppStore((s) => s.claimCoupon);
  const showToast = useAppStore((s) => s.showToast);

  const [scrolled, setScrolled] = useState(false);
  const [topSalesCat, setTopSalesCat] =
    useState<(typeof TOP_SALES_CATS)[number]>('All');
  const [feedTab, setFeedTab] = useState<'recommend' | 'coke' | 'cny'>('recommend');
  const [bentoSlide, setBentoSlide] = useState(0);
  const [tick3s, setTick3s] = useState(0);

  const bentoTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3-second rotation timer for Pre-Order/New/Signature & Offers carousels
  useEffect(() => {
    const id = setInterval(() => {
      setTick3s((t) => t + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const handleBentoScroll = () => {
    const el = bentoTrackRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setBentoSlide(Math.min(1, Math.max(0, idx)));
  };

  const scrollToBento = (idx: number) => {
    const el = bentoTrackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
    setBentoSlide(idx);
  };

  const currentAddr =
    DELIVERY_ADDRESSES.find((a) => a.id === selectedAddressId) ?? DELIVERY_ADDRESSES[0];
  const currentStore =
    PICKUP_STORES.find((s) => s.id === selectedStoreId) ?? PICKUP_STORES[0];

  const isDelivery = fulfillmentMode === 'delivery';
  const navLocation = isDelivery
    ? `to ${currentAddr.shortNavLabel}`
    : `· ${currentStore.shortNavLabel}`;

  const flashProducts = PRODUCTS.filter((p) => p.isFlashDeal);
  const topSalesProducts = PRODUCTS.filter(
    (p) => !p.isFlashDeal && (topSalesCat === 'All' || p.category === topSalesCat)
  ).slice(0, 6);

  const feedProducts = (() => {
    const base = PRODUCTS.filter(
      (p) =>
        !p.isFlashDeal &&
        [
          'belena-shiraz',
          'bin-180-wine',
          'jumbo-blueberry',
          'nissin-bowl',
          'us-beef-blade',
          'fuji-apple',
          'zespri-kiwi',
        ].includes(p.id)
    );
    if (feedTab === 'coke') return [...base].reverse();
    if (feedTab === 'cny') return [...base].sort((a, b) => b.price - a.price);
    return base;
  })();

  const pickupGroups = [
    {
      title: 'Buy it again',
      items: [
        { img: ASSETS.buyAgain1, id: 'belena-shiraz' },
        { img: ASSETS.buyAgain2, id: 'redeem-oil' },
        { img: ASSETS.buyAgain3, id: 'us-beef-blade' },
      ],
    },
    {
      title: 'Recently Viewed',
      items: [
        { img: ASSETS.recentlyViewed1, id: 'ferrarini-ham' },
        { img: ASSETS.wineBelenaAward, id: 'belena-shiraz' },
        { img: ASSETS.kiwi, id: 'zespri-kiwi' },
      ],
    },
    {
      title: 'My lists',
      items: [
        { img: ASSETS.blueberry, id: 'jumbo-blueberry' },
        { img: ASSETS.fujiApple, id: 'fuji-apple' },
        { img: ASSETS.beef, id: 'us-beef-blade' },
      ],
    },
    {
      title: 'Not yet rated',
      items: [
        { img: ASSETS.nissinBowl, id: 'nissin-bowl' },
        { img: ASSETS.eminaCheese, id: 'emina-cheese' },
        { img: ASSETS.ferrariniHam, id: 'ferrarini-ham' },
      ],
    },
  ];

  const topFruits = [
    { rank: 1, product: PRODUCTS.find((p) => p.id === 'fuji-apple')!, displayPrice: 40 },
    { rank: 2, product: PRODUCTS.find((p) => p.id === 'jumbo-blueberry')!, displayPrice: 35 },
    { rank: 3, product: PRODUCTS.find((p) => p.id === 'zespri-kiwi')!, displayPrice: 60 },
  ];

  const pre1 = PREORDER_SLOT_1[tick3s % PREORDER_SLOT_1.length];
  const pre2 = PREORDER_SLOT_2[tick3s % PREORDER_SLOT_2.length];
  const newItem = NEW_SLOT[tick3s % NEW_SLOT.length];
  const sigItem = SIGNATURE_SLOT[tick3s % SIGNATURE_SLOT.length];
  const bogoItem = BOGO_ROTATION[tick3s % BOGO_ROTATION.length];
  const giftItem = FREE_GIFT_ROTATION[tick3s % FREE_GIFT_ROTATION.length];

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[136px]">
      {/* Scrolled Sticky Solid Red Bar (Full width on mobile via .app-fixed-bar) */}
      {scrolled && (
        <header className="app-fixed-bar top-0 z-50 bg-[#E40032] px-3 pt-[max(12px,env(safe-area-inset-top))] pb-2.5 flex items-center gap-2 shadow-md">
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
            className="flex-1 h-[36px] bg-white rounded-[8px] pl-3 pr-1 flex items-center gap-1.5 text-left"
          >
            <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
            <span className="text-[14px] leading-[20px] text-[#858585] truncate flex-1">
              Coca-Cola
            </span>
            <img src={ICONS.qrScan} alt="" className="w-[24px] h-[24px] object-contain shrink-0 mr-1" />
            <span className="h-[28px] px-3 rounded-[6px] bg-[#FFF0F2] text-[#E40032] text-[12px] leading-[16px] font-semibold inline-flex items-center">
              Search
            </span>
          </button>

          <button
            type="button"
            onClick={() => showToast('No new notifications')}
            className="flex flex-col items-center text-white shrink-0"
          >
            <img
              src={ICONS.bellNotice}
              alt="Notice"
              className="w-[24px] h-[24px] object-contain brightness-0 invert"
            />
            <span className="text-[10px] leading-[12px] font-medium">Notice</span>
          </button>
          <button
            type="button"
            onClick={openFulfillmentSheet}
            className="flex flex-col items-center text-white shrink-0"
          >
            <img
              src={ICONS.store}
              alt="Store"
              className="w-[24px] h-[24px] object-contain brightness-0 invert"
            />
            <span className="text-[10px] leading-[12px] font-medium">Store</span>
          </button>
        </header>
      )}

      {/* Immersive Christmas Header (291px, Figma 2329:171344) */}
      <section className="relative w-full h-[291px] overflow-hidden rounded-b-[16px]">
        <img
          src={ASSETS.christmasHeader}
          alt="Christmas Specials Up to 50% OFF"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-sky-200/70 via-sky-100/40 to-transparent pointer-events-none" />

        <div className="relative z-10 px-3 pt-[max(14px,env(safe-area-inset-top))] space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0 flex-1 pr-2">
              <div className="inline-flex items-center gap-1 text-[12px] leading-[16px] font-medium text-[#1A1A1A]">
                <span className="font-semibold">1,110,316</span>
                <img src={ASSETS.yuuCoin} alt="yuu" className="w-[16px] h-[16px] object-contain" />
                <span>= &#36;112,123</span>
              </div>

              <button
                type="button"
                onClick={openFulfillmentSheet}
                className="flex items-center gap-1 text-[14px] leading-[20px] text-[#1A1A1A] max-w-full"
              >
                <span
                  aria-hidden="true"
                  className="block w-[16px] h-[16px] shrink-0"
                  style={{
                    backgroundColor: '#1A1A1A',
                    WebkitMaskImage: `url(${isDelivery ? ICONS.truck : ICONS.cncBag})`,
                    maskImage: `url(${isDelivery ? ICONS.truck : ICONS.cncBag})`,
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                  }}
                />
                <span className="font-semibold shrink-0">
                  {isDelivery ? 'Delivery' : 'Click & Collect'}
                </span>
                <span className="truncate font-normal">{navLocation}</span>
                <img
                  src={ICONS.chevronDown}
                  alt=""
                  className="w-[16px] h-[16px] object-contain shrink-0"
                />
              </button>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-0.5">
              <button
                type="button"
                onClick={() => showToast('No new notifications')}
                className="flex flex-col items-center text-[#1A1A1A]"
              >
                <img src={ICONS.bellNotice} alt="Notice" className="w-[24px] h-[24px] object-contain" />
                <span className="text-[10px] leading-[14px] font-medium">Notice</span>
              </button>
              <button
                type="button"
                onClick={openFulfillmentSheet}
                className="flex flex-col items-center text-[#1A1A1A]"
              >
                <img src={ICONS.store} alt="Store" className="w-[24px] h-[24px] object-contain" />
                <span className="text-[10px] leading-[14px] font-medium">Store</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('search')}
            className="w-full h-[40px] bg-white rounded-[10px] pl-3 pr-1 flex items-center gap-2 shadow-sm"
          >
            <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
            <span className="text-[14px] leading-[20px] text-[#858585]">Coca-Cola</span>
            <span className="bg-[#FFEC99] text-[#1A1A1A] text-[12px] leading-[16px] font-normal px-1.5 py-[1px] rounded-[4px]">
              20% Off
            </span>
            <div className="flex-1" />
            <img src={ICONS.qrScan} alt="" className="w-[24px] h-[24px] object-contain shrink-0 mr-1" />
            <span className="h-[32px] w-[68px] rounded-[8px] bg-[#FFF0F2] text-[#E40032] text-[12px] leading-[16px] font-semibold inline-flex items-center justify-center">
              Search
            </span>
          </button>
        </div>
      </section>

      {/* Main Content Floors */}
      <div className="px-2 pt-2.5 space-y-2.5">
        {/* 1. Pick up where you left off — ALL 4 modules from Figma 6634:49944 */}
        <section className="bg-white rounded-[12px] py-3 overflow-hidden">
          <h2 className="px-3 text-[16px] leading-[24px] font-bold text-[#1A1A1A] mb-2.5">
            Pick up where you left off
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3">
            {pickupGroups.map((group) => (
              <div
                key={group.title}
                className="w-[268px] shrink-0 bg-[#F7F7F7] rounded-[8px] p-2"
              >
                <div className="flex items-center justify-between mb-2 px-0.5">
                  <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                    {group.title}
                  </span>
                  <img
                    src={ICONS.chevronRight}
                    alt=""
                    className="w-[14px] h-[14px] object-contain"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {group.items.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigate('pdp', item.id)}
                      className="w-[80px] h-[80px] bg-white rounded-[6px] p-1.5 flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <img src={item.img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Weekly Deals Bento Carousel — Horizontal Swipeable 2 Slides */}
        <section className="space-y-2">
          <div
            ref={bentoTrackRef}
            onScroll={handleBentoScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-2"
          >
            {/* Slide 1: Exact 3x Figma Banners */}
            <div className="w-full shrink-0 snap-center grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('smart-tips')}
                className="rounded-[12px] overflow-hidden active:opacity-95"
              >
                <img
                  src={BANNERS.weeklyDeals}
                  alt="Weekly Deals 20% off"
                  className="w-full h-auto block rounded-[12px]"
                />
              </button>
              <div className="relative rounded-[12px] overflow-hidden">
                <img
                  src={BANNERS.freshQuality}
                  alt="Fresh & Tasty / Quality Picks"
                  className="w-full h-auto block rounded-[12px]"
                />
                <button
                  type="button"
                  aria-label="Fresh & Tasty"
                  onClick={() => navigate('pdp', 'zespri-kiwi')}
                  className="absolute inset-x-0 top-0 h-1/2"
                />
                <button
                  type="button"
                  aria-label="Quality Picks"
                  onClick={() => navigate('pdp', 'us-beef-blade')}
                  className="absolute inset-x-0 bottom-0 h-1/2"
                />
              </div>
            </div>

            {/* Slide 2: Generated Companion Bento Banners */}
            <div className="w-full shrink-0 snap-center grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('smart-tips')}
                className="rounded-[12px] overflow-hidden active:opacity-95"
              >
                <img
                  src={BANNERS.weeklyDeals2}
                  alt="Member Specials Save 30%"
                  className="w-full h-full object-cover block rounded-[12px]"
                />
              </button>
              <div className="relative rounded-[12px] overflow-hidden">
                <img
                  src={BANNERS.freshQuality2}
                  alt="Bakery Fresh / Wine & Dine"
                  className="w-full h-full object-cover block rounded-[12px]"
                />
                <button
                  type="button"
                  aria-label="Bakery Fresh"
                  onClick={() => navigate('pdp', 'emina-cheese')}
                  className="absolute inset-x-0 top-0 h-1/2"
                />
                <button
                  type="button"
                  aria-label="Wine & Dine"
                  onClick={() => navigate('pdp', 'belena-shiraz')}
                  className="absolute inset-x-0 bottom-0 h-1/2"
                />
              </div>
            </div>
          </div>

          {/* Interactive Indicator Dots */}
          <div className="flex justify-center gap-1.5">
            {[0, 1].map((idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => scrollToBento(idx)}
                className={`h-[4px] rounded-full transition-all ${
                  bentoSlide === idx ? 'w-5 bg-[#E40032]' : 'w-4 bg-[#D9D9D9]'
                }`}
              />
            ))}
          </div>
        </section>

        {/* 3. Flash Deals — 🔥 icon before title, chevron-circle AFTER title */}
        <section
          className="rounded-[12px] p-2.5"
          style={{
            backgroundImage:
              'linear-gradient(73.45deg, #F5DF7E 1.3%, #FFF0AD 70%, #FFB001 107%)',
          }}
        >
          <div className="flex items-center justify-between mb-2 px-0.5">
            <button
              type="button"
              onClick={() => navigate('smart-tips')}
              className="inline-flex items-center gap-1 text-[16px] leading-[22px] font-bold text-black"
            >
              <span aria-hidden="true">🔥</span>
              <span>Flash Deals</span>
              <img
                src={ICONS.flashSpark}
                alt=""
                className="w-[14px] h-[14px] object-contain ml-0.5"
              />
            </button>
            <CountdownTimer initialSeconds={29 * 60 + 59} />
          </div>

          <div className="bg-white rounded-[10px] divide-y divide-[#F3F3F3] overflow-hidden">
            {flashProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="row" className="rounded-none" />
            ))}
          </div>
        </section>

        {/* 4. Pre-Order / New / Signature — Coded + 3s Animated Product Swap */}
        <section className="flex gap-[4px] items-stretch">
          {/* Pre-Order (2x width) */}
          <div
            className="flex-[2] min-w-0 rounded-[12px] flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #B5C92A 0%, #E7EEB0 55%, #FFFFFF 100%)',
            }}
          >
            <div className="h-[38px] px-[8px] flex items-center">
              <span className="text-[14px] font-bold text-black">Pre-Order</span>
            </div>
            <div className="grid grid-cols-2 gap-[4px] px-[4px] pb-[4px] flex-1">
              <button
                type="button"
                onClick={() => navigate('pdp', pre1.id)}
                className="bg-white rounded-[8px] pb-[4px] flex flex-col items-center overflow-hidden"
              >
                <div
                  key={`pre1-${tick3s}`}
                  className="animate-card-swap relative w-full aspect-square p-1 flex items-center justify-center"
                >
                  <img src={pre1.img} alt="" className="w-[86%] h-[86%] object-contain" />
                  <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 h-[16px] px-[4px] rounded-[2px] bg-[#FFEC99] text-[#444444] text-[11px] leading-[16px] whitespace-nowrap">
                    {pre1.badge}
                  </span>
                </div>
                <div className="text-[#E40032] font-bold leading-[20px] flex items-baseline">
                  <span className="text-[14px]">&#36;{pre1.price}</span>
                  <span className="text-[10px]">.00</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('pdp', pre2.id)}
                className="bg-white rounded-[8px] pb-[4px] flex flex-col items-center overflow-hidden"
              >
                <div
                  key={`pre2-${tick3s}`}
                  className="animate-card-swap w-full aspect-square p-1 flex items-center justify-center"
                >
                  <img src={pre2.img} alt="" className="w-[86%] h-[86%] object-contain" />
                </div>
                <div className="text-[#E40032] font-bold leading-[20px] flex items-baseline">
                  <span className="text-[14px]">&#36;{pre2.price}</span>
                  <span className="text-[10px]">.00</span>
                </div>
              </button>
            </div>
          </div>

          {/* New */}
          <div
            className="flex-1 min-w-0 rounded-[12px] flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #FFAE49 0%, #FFE2BD 55%, #FFFFFF 100%)',
            }}
          >
            <div className="h-[38px] px-[8px] flex items-center">
              <span className="text-[14px] font-bold text-black">New</span>
            </div>
            <div className="px-[4px] pb-[4px] flex-1 flex">
              <button
                type="button"
                onClick={() => navigate('pdp', newItem.id)}
                className="bg-white rounded-[8px] pb-[4px] flex flex-col items-center w-full overflow-hidden"
              >
                <div
                  key={`new-${tick3s}`}
                  className="animate-card-swap w-full aspect-square p-1 flex items-center justify-center"
                >
                  <img src={newItem.img} alt="" className="w-[84%] h-[84%] object-contain" />
                </div>
                <div className="text-[#E40032] font-bold leading-[20px] flex items-baseline">
                  <span className="text-[14px]">&#36;{newItem.price}</span>
                  <span className="text-[10px]">.00</span>
                </div>
              </button>
            </div>
          </div>

          {/* Signature */}
          <div
            className="flex-1 min-w-0 rounded-[12px] flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #FF8A71 0%, #FFD5CC 55%, #FFFFFF 100%)',
            }}
          >
            <div className="h-[38px] px-[8px] flex items-center">
              <span className="text-[14px] font-bold text-black">Signature</span>
            </div>
            <div className="px-[4px] pb-[4px] flex-1 flex">
              <button
                type="button"
                onClick={() => navigate('pdp', sigItem.id)}
                className="bg-white rounded-[8px] pb-[4px] flex flex-col items-center w-full overflow-hidden"
              >
                <div
                  key={`sig-${tick3s}`}
                  className="animate-card-swap w-full aspect-square p-1 flex items-center justify-center"
                >
                  <img src={sigItem.img} alt="" className="w-[84%] h-[84%] object-contain" />
                </div>
                <div className="text-[#E40032] font-bold leading-[20px] flex items-baseline">
                  <span className="text-[14px]">&#36;{sigItem.price}</span>
                  <span className="text-[10px]">.00</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* 5. Top Sales — Exact Figma Pills (min-w-[64px], white active, borderless inactive) & Borderless Cards */}
        <section className="bg-white rounded-[12px] py-3 overflow-hidden">
          <div className="px-3 flex items-center justify-between mb-2">
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">Top Sales</h2>
            <button
              type="button"
              onClick={() => navigate('smart-tips')}
              className="inline-flex items-center gap-1 text-[12px] leading-[16px] font-semibold text-[#666666]"
            >
              See all <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain" />
            </button>
          </div>

          <div className="flex gap-[8px] overflow-x-auto no-scrollbar px-3 mb-2.5">
            {TOP_SALES_CATS.map((cat) => {
              const active = topSalesCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTopSalesCat(cat)}
                  className={`h-[32px] min-w-[64px] px-[12px] rounded-full text-[12px] leading-[16px] shrink-0 transition-colors ${
                    active
                      ? 'bg-white border border-[#E40032] text-[#E40032] font-bold'
                      : 'bg-[#F7F7F7] border-0 text-[#3D3D3D] font-normal'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 pb-0.5">
            {topSalesProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variant="compact"
                className="w-[132px] shrink-0"
              />
            ))}
          </div>
        </section>

        {/* 6. Hang Seng enJoy Card Exclusive Offer — 3x Figma Banner */}
        <section
          onClick={() => showToast('Hang Seng enJoy Card 8% off on enJoy Day')}
          className="rounded-[12px] overflow-hidden cursor-pointer active:opacity-95"
        >
          <img
            src={BANNERS.hangSeng}
            alt="Hang Seng enJoy Card Exclusive Offer"
            className="w-full h-auto block"
          />
        </section>

        {/* 7. Savings — Exact Figma 106x182 Ticket Coupon Cards with Edge-Bleed Scroll */}
        <section className="bg-white rounded-[12px] py-3 overflow-hidden">
          <div className="px-3 flex items-center justify-between mb-2">
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">Savings</h2>
            <span className="inline-flex items-center gap-1 text-[12px] leading-[16px] font-semibold text-[#3D3D3D]">
              See all <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain" />
            </span>
          </div>

          <div className="flex gap-[8px] overflow-x-auto no-scrollbar px-3 py-1">
            {coupons.map((cp) => (
              <div
                key={cp.id}
                className="relative w-[106px] h-[182px] shrink-0 rounded-[12px] overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-[#F2F2F2] pt-[8px] px-[8px] pb-[10px] flex flex-col items-center text-center"
              >
                {/* Ticket side notches cleanly clipped inside card */}
                <span className="absolute -left-[6px] top-[122px] w-[12px] h-[12px] rounded-full bg-[#F7F7F7] border border-[#EBEBEB]" />
                <span className="absolute -right-[6px] top-[122px] w-[12px] h-[12px] rounded-full bg-[#F7F7F7] border border-[#EBEBEB]" />

                {/* 36px-tall Top Icon / Brand Box */}
                {(() => {
                  const resolvedIcon =
                    cp.brandIcon ?? HOME_COUPONS.find((h) => h.id === cp.id)?.brandIcon;
                  return (
                    <div className="h-[36px] min-w-[36px] max-w-full rounded-[8px] overflow-hidden flex items-center justify-center shrink-0">
                      {resolvedIcon ? (
                        <img src={resolvedIcon} alt={cp.brandLabel} className="w-[36px] h-[36px] object-contain" />
                      ) : cp.brandLabel === 'Wellcome' ? (
                        <div className="w-[36px] h-[36px] bg-[#FFE2E0] flex items-center justify-center text-[#E40032]">
                          <Ticket className="w-[22px] h-[22px]" strokeWidth={2} />
                        </div>
                      ) : (
                        <div className="h-[32px] px-2 rounded-[6px] bg-[#F7F7F7] flex items-center justify-center text-[10px] font-extrabold text-[#1A1A1A] tracking-tight whitespace-nowrap">
                          {cp.brandLabel}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Amount + Condition (exact Figma 16px/14px/12px) */}
                <div className="mt-1 flex-1 flex flex-col items-center">
                  <p className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                    &#36;{cp.amount}
                  </p>
                  <p className="text-[14px] leading-[20px] font-normal text-[#3D3D3D] whitespace-nowrap">
                    off on &#36;{cp.minSpend}
                  </p>
                  <p className="text-[12px] leading-[16px] font-normal text-[#666666] mt-0.5 line-clamp-2">
                    {cp.condition}
                  </p>
                </div>

                {/* Dashed divider + 32px CTA */}
                <div className="w-full border-t border-dashed border-[#E5E5E5] pt-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (cp.claimed) navigate('cart');
                      else claimCoupon(cp.id);
                    }}
                    className={`w-full h-[32px] rounded-[4px] text-[12px] leading-[16px] font-semibold transition-colors ${
                      cp.claimed
                        ? 'border border-[#C7C7C7] bg-white text-[#1A1A1A]'
                        : 'border border-[#E40032] bg-[#FFF6F5] text-[#E40032]'
                    }`}
                  >
                    {cp.claimed ? 'Use' : 'Get'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Offers — Coded + 3s Stacked-Deck Rotating Product Carousel */}
        <section className="bg-white rounded-[12px] py-3 overflow-hidden">
          <div className="px-3 flex items-center justify-between mb-2">
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">Offers</h2>
            <button
              type="button"
              onClick={() => navigate('smart-tips')}
              className="inline-flex items-center gap-1 text-[12px] leading-[16px] font-semibold text-[#666666]"
            >
              See all <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain" />
            </button>
          </div>

          <div className="flex gap-[8px] overflow-x-auto no-scrollbar px-3">
            {/* Promo 1: Buy 1 Get 1 Free */}
            <button
              type="button"
              onClick={() => navigate('pdp', bogoItem.id)}
              className="w-[218px] h-[96px] shrink-0 rounded-[12px] bg-gradient-to-r from-[#8D8DF8] to-[#B7B6FF] px-3 py-2 flex items-center justify-between active:opacity-95"
            >
              <img
                src={ASSETS.bogoBadge}
                alt="Buy 1 Get 1 Free"
                className="h-[68px] w-auto object-contain"
              />
              {/* Stacked deck with 3s rotating product */}
              <div className="relative w-[80px] h-[76px] mr-1">
                <div className="absolute right-[-6px] top-[6px] bottom-[6px] w-[72px] rounded-[8px] bg-white/55" />
                <div className="absolute right-[-3px] top-[3px] bottom-[3px] w-[74px] rounded-[8px] bg-white/80" />
                <div
                  key={`bogo-${tick3s}`}
                  className="animate-card-swap relative z-10 w-[76px] h-[76px] rounded-[8px] bg-white p-1.5 flex items-center justify-center shadow-xs"
                >
                  <img src={bogoItem.img} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </button>

            {/* Promo 2: Free Gift */}
            <button
              type="button"
              onClick={() => navigate('pdp', giftItem.id)}
              className="w-[218px] h-[96px] shrink-0 rounded-[12px] bg-gradient-to-r from-[#FFE066] to-[#FFF2B2] px-3 py-2 flex items-center justify-between active:opacity-95"
            >
              <img
                src={ASSETS.freeGiftBadge}
                alt="Free Gift"
                className="h-[68px] w-auto object-contain"
              />
              <div className="relative w-[80px] h-[76px] mr-1">
                <div className="absolute right-[-6px] top-[6px] bottom-[6px] w-[72px] rounded-[8px] bg-white/55" />
                <div className="absolute right-[-3px] top-[3px] bottom-[3px] w-[74px] rounded-[8px] bg-white/80" />
                <div
                  key={`gift-${tick3s}`}
                  className="animate-card-swap relative z-10 w-[76px] h-[76px] rounded-[8px] bg-white p-1.5 flex items-center justify-center shadow-xs"
                >
                  <img src={giftItem.img} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* 9. Bottom Feed Tabs (Enlarged Coca-Cola Tab) + 2-Column Waterfall */}
        <section className="pt-1">
          <div className="flex items-center justify-around bg-[#F7F7F7] pb-2 pt-1">
            <button
              type="button"
              onClick={() => setFeedTab('recommend')}
              className={`text-[14px] leading-[20px] pb-1.5 border-b-2 transition-colors ${
                feedTab === 'recommend'
                  ? 'border-[#E40032] text-[#E40032] font-bold'
                  : 'border-transparent text-[#3D3D3D] font-medium'
              }`}
            >
              Recommend
            </button>
            <button
              type="button"
              onClick={() => setFeedTab('coke')}
              className={`pb-1 border-b-2 transition-colors ${
                feedTab === 'coke' ? 'border-[#E40032]' : 'border-transparent'
              }`}
            >
              <img
                src={ASSETS.cocaColaLogo}
                alt="Coca-Cola"
                className="w-[64px] h-[28px] rounded-[4px] object-cover"
              />
            </button>
            <button
              type="button"
              onClick={() => setFeedTab('cny')}
              className={`text-[14px] leading-[20px] pb-1.5 border-b-2 transition-colors ${
                feedTab === 'cny'
                  ? 'border-[#E40032] text-[#E40032] font-bold'
                  : 'border-transparent text-[#3D3D3D] font-medium'
              }`}
            >
              Chinese New Year
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {feedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}

            {/* Top Fruits Ranked Card (Figma 2329:171344) */}
            <div
              className="rounded-[8px] p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-[10px]"
              style={{
                background: 'linear-gradient(180deg, #FFFCEB 0%, #FFFFFF 38%)',
              }}
            >
              <div className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">Top Fruits</div>
              <div className="space-y-[12px]">
                {topFruits.map(({ rank, product, displayPrice }) => (
                  <div
                    key={product.id}
                    onClick={() => navigate('pdp', product.id)}
                    className="flex items-center gap-[8px] cursor-pointer"
                  >
                    <div className="relative w-[44px] h-[44px] shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                      <span
                        className={`absolute -top-1 -left-1 w-[16px] h-[16px] rounded-[4px] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center ${
                          rank === 1
                            ? 'bg-[#FFCF00]'
                            : rank === 2
                              ? 'bg-[#D6E4F0]'
                              : 'bg-[#F4D08A]'
                        }`}
                      >
                        {rank}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-[16px] text-[#1A1A1A] line-clamp-2 font-normal">
                        {product.name}
                      </p>
                      <div className="flex items-end justify-between mt-[4px]">
                        <span className="inline-flex items-baseline font-bold text-[#E40032]">
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
        </section>
      </div>

      {/* Fixed Bottom Shell (Full width on mobile via .app-fixed-bar) */}
      <div className="app-fixed-bar bottom-0 z-30 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <ThresholdProgressBar
          variant="compact"
          onClick={() => navigate('smart-tips')}
        />
        <AppTabBar />
      </div>
    </div>
  );
};
