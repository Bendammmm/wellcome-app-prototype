import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { ASSETS, ICONS, PRODUCTS, getProductById } from '../../data/catalog';
import { getTotalCartCount, useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { CountdownTimer } from '../../components/shared/CountdownTimer';
import { PriceBlock } from '../../components/shared/PriceBlock';
import { ProductCard } from '../../components/shared/ProductCard';
import { PromoTag } from '../../components/shared/PromoTag';

const ANCHOR_TABS = [
  { id: 'pdp-overview', label: 'Overview' },
  { id: 'pdp-offers', label: 'Offer(s)' },
  { id: 'pdp-reviews', label: 'Reviews' },
  { id: 'pdp-details', label: 'Details' },
  { id: 'pdp-recommend', label: 'Recommend' },
] as const;

export const PdpPage: React.FC = () => {
  const activeProductId = useAppStore((s) => s.activeProductId);
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const openFulfillmentSheet = useAppStore((s) => s.openFulfillmentSheet);
  const addToCart = useAppStore((s) => s.addToCart);
  const wishlistIds = useAppStore((s) => s.wishlistIds);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const showToast = useAppStore((s) => s.showToast);
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);
  const isMp = t.isMp;
  const totalCartCount = useAppStore((s) => getTotalCartCount(s.cartItems));

  const product = getProductById(activeProductId);
  const isWishlisted = wishlistIds.includes(product.id);

  // Default to Case Deal (6x1lt) on Belena wine matching Figma 2329:176042
  const defaultVariantId =
    product.variants?.find((v) => v.id === '6x1lt')?.id ?? product.variants?.[0]?.id;

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    defaultVariantId
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [pendingQty, setPendingQty] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string>('pdp-overview');
  const [detailsOpen, setDetailsOpen] = useState(true);

  const [optionDrawerOpen, setOptionDrawerOpen] = useState(false);
  const [deliveryDrawerOpen, setDeliveryDrawerOpen] = useState(false);
  const [afterAddedOpen, setAfterAddedOpen] = useState(false);
  const [recPages, setRecPages] = useState(2);
  const recSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = recSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRecPages((prev) => Math.min(prev + 1, 20));
        }
      },
      { rootMargin: '320px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const mpHeadingStyle: React.CSSProperties | undefined = isMp
    ? { fontFamily: t.headingFont, color: t.headingColor }
    : undefined;
  const padX = isMp ? 'px-[16px]' : 'px-[12px]';
  const padAll = isMp ? 'p-[16px]' : 'p-[12px]';

  useEffect(() => {
    setSelectedVariantId(defaultVariantId);
    setSlideIndex(0);
    setPendingQty(1);
  }, [activeProductId, defaultVariantId]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 220);
      const ids = ['pdp-recommend', 'pdp-details', 'pdp-reviews', 'pdp-offers', 'pdp-overview'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveAnchor(id);
          break;
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const activePrice = activeVariant ? activeVariant.price : product.price;
  const activeOriginalPrice = activeVariant?.isCaseDeal
    ? undefined
    : activeVariant?.originalPrice ?? product.originalPrice;
  const activeUnitPrice = activeVariant?.unitPriceText ?? product.unitPriceText;
  const activeTitle = activeVariant ? activeVariant.fullTitle : product.name;

  const galleryImages =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleScrollTo = (id: string) => {
    setActiveAnchor(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handlePrimaryAddToCart = () => {
    addToCart(product.id, pendingQty, activeVariant?.id, !isMp);
    setOptionDrawerOpen(false);
    if (!isMp) {
      setAfterAddedOpen(true);
    }
  };

  const handleAddBundle = () => {
    addToCart('belena-shiraz', 1, '1lt', true);
    addToCart('emina-cheese', 1, undefined, true);
    addToCart('ferrarini-ham', 1, undefined, true);
    showToast('Bundle (3 items) added to cart!');
  };

  const relatedProducts = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      ['zespri-kiwi', 'us-beef-blade', 'jumbo-blueberry', 'fuji-apple'].includes(p.id)
  );
  const youMayLike = PRODUCTS.filter(
    (p) =>
      ['belena-shiraz', 'bin-180-wine', 'nissin-bowl', 'jumbo-blueberry'].includes(p.id)
  );
  const oftenBought = PRODUCTS.filter((p) =>
    ['zespri-kiwi', 'us-beef-blade', 'jumbo-blueberry', 'fuji-apple', 'bin-180-wine', 'nissin-bowl'].includes(
      p.id
    )
  );

  return (
    <div
      className="min-h-dvh pb-[92px]"
      style={{ backgroundColor: isMp ? t.canvasBg : '#F7F7F7' }}
    >
      {/* Floating Top Bar (visible when not scrolled) */}
      <div
        className={`app-fixed-bar top-0 z-30 px-3 pt-[max(12px,env(safe-area-inset-top))] pb-2 flex items-center justify-between transition-opacity duration-200 ${
          scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="w-[36px] h-[36px] rounded-full bg-[#F7F7F7]/90 backdrop-blur-xs shadow-xs flex items-center justify-center active:scale-95"
        >
          <img src={ICONS.chevronLeft} alt="" className="w-[28px] h-[28px] object-contain" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast('Product link copied')}
            aria-label="Share"
            className="w-[36px] h-[36px] rounded-full bg-[#F7F7F7]/90 backdrop-blur-xs shadow-xs flex items-center justify-center active:scale-95"
          >
            <img src={ICONS.share} alt="" className="w-[28px] h-[28px] object-contain" />
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Favorite"
            className="w-[36px] h-[36px] rounded-full bg-[#F7F7F7]/90 backdrop-blur-xs shadow-xs flex items-center justify-center active:scale-95"
          >
            {isWishlisted ? (
              <Heart className="w-[22px] h-[22px] fill-[#E40032] text-[#E40032]" strokeWidth={2} />
            ) : (
              <img src={ICONS.heartOutline} alt="" className="w-[28px] h-[28px] object-contain" />
            )}
          </button>
        </div>
      </div>

      {/* Scrolled Sticky Anchor Bar (Figma 1656:137539) */}
      <header
        className={`app-fixed-bar top-0 z-40 bg-white shadow-xs transition-all duration-200 ${
          scrolled
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="px-3 pt-[max(10px,env(safe-area-inset-top))] pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="w-8 h-8 flex items-center justify-center"
          >
            <img src={ICONS.chevronLeft} alt="" className="w-6 h-6 object-contain" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={activeVariant?.image ?? product.image}
              alt=""
              className="w-7 h-7 object-contain rounded-[4px]"
            />
            <span className="text-[14px] font-bold text-[#1A1A1A]">
              &#36;{activePrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Product link copied')}
              className="w-8 h-8 flex items-center justify-center"
            >
              <img src={ICONS.share} alt="" className="w-5 h-5 object-contain" />
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="w-8 h-8 flex items-center justify-center"
            >
              {isWishlisted ? (
                <Heart className="w-5 h-5 fill-[#E40032] text-[#E40032]" />
              ) : (
                <img src={ICONS.heartOutline} alt="" className="w-5 h-5 object-contain" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 border-t border-[#F2F2F2]">
          {ANCHOR_TABS.map((t) => {
            const active = activeAnchor === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleScrollTo(t.id)}
                className={`py-2 text-[12px] border-b-2 transition-colors ${
                  active
                    ? 'border-[#E40032] text-[#E40032] font-bold'
                    : 'border-transparent text-[#3D3D3D] font-medium'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* 1. Product Gallery (Overview — Figma 7668:107967, 393x393) */}
      <section id="pdp-overview" className="relative bg-white w-full aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={galleryImages[slideIndex]}
          alt={activeTitle}
          onClick={() => setSlideIndex((i) => (i + 1) % galleryImages.length)}
          className="w-full h-full object-contain p-4 cursor-pointer"
        />
        <span className="absolute bottom-[13px] right-[10px] h-[22px] px-[8px] rounded-full bg-black/45 text-white text-[11px] leading-[14px] font-medium inline-flex items-center justify-center">
          {slideIndex + 1}/{galleryImages.length}
        </span>
      </section>

      {/* 2. Horizontal Option Chips (Case Deal SKU selector — Figma 1630:132500) */}
      {product.variants && product.variants.length > 0 && (
        <section className="relative bg-white border-t border-[#E0E0E0] h-[80px] flex items-center">
          <div className="w-full h-full px-[16px] pr-[80px] flex items-center gap-[8px] overflow-x-auto no-scrollbar">
            {product.variants.map((v) => {
              const active = v.id === activeVariant?.id;
              const [intPart, decPart] = v.price.toFixed(2).split('.');
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`shrink-0 min-w-[80px] h-[56px] rounded-[8px] px-[12px] py-[8px] text-left flex flex-col justify-center gap-[4px] transition-colors ${
                    active
                      ? 'border border-[#E40032] bg-[#FFF6F5]'
                      : 'border border-transparent bg-[#F7F7F7]'
                  }`}
                >
                  <p className="text-[12px] leading-[16px] font-normal text-[#3D3D3D] whitespace-nowrap">
                    {v.label}
                  </p>
                  <div className="flex items-end gap-[4px] whitespace-nowrap">
                    <span className="inline-flex items-start font-bold text-[#1A1A1A]">
                      <span className="text-[10px] leading-[16px]">&#36;</span>
                      <span className="text-[16px] leading-[20px]">{intPart}</span>
                      <span className="text-[10px] leading-[16px]">.{decPart}</span>
                    </span>
                    {v.unitPriceText && (
                      <span className="text-[10px] leading-[14px] font-medium text-[#666666]">
                        {v.unitPriceText}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              if (isMp) {
                showToast('当前 MP 演示版暂不开放二级弹窗');
                return;
              }
              setOptionDrawerOpen(true);
            }}
            className="absolute right-0 inset-y-0 w-[69px] bg-white shadow-[-8px_0_14px_-2px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-[2px] text-[10px] leading-[14px] font-medium text-[#666666]"
          >
            <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain" />
            <span>{product.variants.length} options</span>
          </button>
        </section>
      )}

      {/* Main PDP Cards */}
      <div className="mp-edge-stack px-[8px] pt-[8px] flex flex-col gap-[8px]">
        {/* 3. Price Banner + Product Info Card (Figma 7650:77009) */}
        <section className="bg-white rounded-[12px] overflow-hidden">
          {/* Dynamic Price Banner matching Figma 7656:81124 */}
          {fulfillmentMode === 'click_and_collect' ? (
            <div className="bg-gradient-to-r from-[#E40032] to-[#FF2449] px-[12px] py-[12px] flex items-center justify-between text-white">
              <PriceBlock
                price={activePrice}
                originalPrice={activeOriginalPrice}
                unitPriceText={activeUnitPrice}
                size="hero"
                inverse
              />
              <div className="text-right">
                <p className="text-[11px] font-bold">網購店取獨家優惠</p>
                <p className="text-[11px] font-semibold opacity-95">C&amp;C Exclusive Pricing</p>
              </div>
            </div>
          ) : product.priceBannerType === 'flash_deal' ? (
            <div className="bg-gradient-to-r from-[#FF5500] to-[#FF951C] px-[12px] py-[12px] flex items-center justify-between text-white">
              <PriceBlock
                price={activePrice}
                originalPrice={activeOriginalPrice}
                size="hero"
                inverse
              />
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-semibold">Ends in</span>
                <CountdownTimer initialSeconds={3 * 3600 + 59 * 60 + 59} size="sm" />
              </div>
            </div>
          ) : (
            <div className={`${padX} pt-[12px]`}>
              {/* Figma 7650:77009: 28px/36px bold price + 14px/20px unit price */}
              <div className="flex items-baseline gap-[4px] whitespace-nowrap">
                <span
                  className="inline-flex items-start font-bold text-[#E40032] text-[28px] leading-[36px]"
                  style={isMp ? { fontFamily: t.heroFont } : undefined}
                >
                  &#36;{activePrice.toFixed(2)}
                </span>
                {activeUnitPrice ? (
                  <span className="text-[14px] leading-[20px] font-normal text-[#666666]">
                    {activeUnitPrice}
                  </span>
                ) : activeOriginalPrice ? (
                  <span className="text-[14px] leading-[20px] font-normal text-[#666666] line-through">
                    &#36;{activeOriginalPrice.toFixed(2)}
                  </span>
                ) : null}
              </div>
            </div>
          )}

          <div className={`${padX} pb-[12px] pt-[4px] space-y-[12px]`}>
            {product.promoTags && product.promoTags.length > 0 && (
              <div className="flex items-center justify-between gap-[8px]">
                <div className="flex flex-wrap gap-[4px]">
                  {product.promoTags.map((tag) => (
                    <span
                      key={tag}
                      className="h-[20px] px-[8px] rounded-[4px] bg-[#FFEC99] text-[#3D3D3D] text-[12px] leading-[16px] font-normal inline-flex items-center justify-center whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
              </div>
            )}

            <div className="space-y-[4px]">
              <h1
                className="text-[18px] leading-[28px] font-bold text-[#1A1A1A]"
                style={mpHeadingStyle}
              >
                {activeTitle}
              </h1>

              {product.description && (
                <p className="text-[14px] leading-[20px] font-normal text-[#666666]">
                  {product.description}
                </p>
              )}
            </div>

            {/* Highlight Sale Point 2-Line Tiles (Figma I7650:77009;7650:76131) */}
            <div className="flex items-center gap-[4px] overflow-x-auto no-scrollbar">
              <div className="p-[8px] rounded-[4px] bg-gradient-to-r from-[#FFF4C9] to-[#F6DF85] border-b border-[#F3DAA0] flex flex-col gap-[2px] shrink-0 whitespace-nowrap">
                <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                  {product.highlights?.rank ?? 'Top 10'}
                </span>
                <span className="text-[12px] leading-[16px] font-normal text-[#666666]">
                  Wine Hot List
                </span>
              </div>
              <div className="p-[8px] rounded-[4px] bg-[#F7F7F7] flex flex-col gap-[2px] shrink-0 whitespace-nowrap">
                <div className="inline-flex items-center gap-[2px]">
                  <img src={ICONS.star} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
                  <span className="text-[14px] leading-[20px] font-normal text-[#3D3D3D]">
                    {product.highlights?.rating ?? '4.8'}
                  </span>
                  <span className="text-[12px] leading-[16px] font-normal text-[#666666]">
                    ({product.highlights?.reviewCount ?? '1,932'})
                  </span>
                </div>
                <span className="text-[12px] leading-[16px] font-normal text-[#666666]">
                  Rating
                </span>
              </div>
              <div className="p-[8px] rounded-[4px] bg-[#F7F7F7] flex flex-col gap-[2px] shrink-0 whitespace-nowrap">
                <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                  {product.highlights?.sold ?? product.soldText ?? '2k sold'}
                </span>
                <span className="text-[12px] leading-[16px] font-normal text-[#666666]">
                  Sales volume
                </span>
              </div>
              <div className="p-[8px] rounded-[4px] bg-[#F7F7F7] flex flex-col gap-[2px] shrink-0 whitespace-nowrap">
                <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                  {product.highlights?.origin ?? 'Australia'}
                </span>
                <span className="text-[12px] leading-[16px] font-normal text-[#666666]">
                  Origin
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Delivery & Click & Collect Info Card (Figma 1630:129508) */}
        <section className={`bg-white rounded-[12px] ${padAll} space-y-[12px]`}>
          <div className="bg-[#FFF6F5] rounded-[8px] p-[12px] text-[12px] leading-[16px] text-[#1A1A1A]">
            Place an order now to get delivery between{' '}
            <strong className="font-semibold">18:00-21:00 on 19 Nov</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isMp) {
                showToast('当前 MP 演示版暂不开放二级弹窗');
                return;
              }
              setDeliveryDrawerOpen(true);
            }}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex flex-wrap items-center gap-[8px]">
              <span className="bg-[#F7F7F7] px-[8px] py-[4px] rounded-[4px] inline-flex items-center gap-[4px] text-[12px] leading-[16px] font-normal text-[#1A1A1A]">
                <img src={ICONS.truckRed} alt="" className="w-[16px] h-[16px] object-contain" />
                Click &amp; Collect
              </span>
              <span className="bg-[#F7F7F7] px-[8px] py-[4px] rounded-[4px] inline-flex items-center gap-[4px] text-[12px] leading-[16px] font-normal text-[#1A1A1A]">
                <img src={ICONS.truckRed} alt="" className="w-[16px] h-[16px] object-contain" />
                Delivery
              </span>
            </div>
            <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
          </button>
        </section>

        {/* 5. Offers + Stamp + Bundle Discount */}
        <section id="pdp-offers" className="space-y-[8px]">
          {/* Offers Card (Figma 1696:147793) */}
          <div className="bg-white rounded-[12px] overflow-hidden">
            <div className={padAll}>
              <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]" style={mpHeadingStyle}>
                Offers
              </h2>
            </div>
            <div className={padX}>
              <div className="flex items-center gap-[12px] pt-[4px] pb-[12px] border-b border-[#E0E0E0]">
                <img
                  src={ASSETS.wineBottleClean}
                  alt=""
                  className="w-[52px] h-[52px] object-contain shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                  <span className="self-start h-[20px] px-[8px] rounded-[4px] bg-[#FFEC99] text-[#3D3D3D] text-[12px] leading-[16px] inline-flex items-center">
                    50% Off
                  </span>
                  <p className="text-[12px] leading-[16px] text-[#3D3D3D]">
                    Selected brand items enjoy a 50% off discount, while stocks last.
                  </p>
                </div>
                <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
              </div>
              <div className="flex items-center gap-[12px] py-[12px]">
                <div className="w-[56px] h-[56px] bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={ASSETS.eminaCheese}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                  <span className="self-start h-[20px] px-[8px] rounded-[4px] bg-[#FFEC99] text-[#3D3D3D] text-[12px] leading-[16px] inline-flex items-center">
                    Free Gift
                  </span>
                  <p className="text-[12px] leading-[16px] text-[#3D3D3D]">
                    Purchase any Burge wine over &#36;100 and receive cheese.
                  </p>
                </div>
                <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
              </div>
            </div>
          </div>

          {/* Stamp Card (Figma 2268:98492) */}
          <div className={`relative overflow-hidden bg-white rounded-[12px] ${padX} py-[8px] flex items-center gap-[12px]`}>
            <img
              src={ICONS.stampRewardBg}
              alt=""
              className="w-[72px] h-[72px] absolute right-[-9px] top-[-13px] pointer-events-none select-none"
            />
            <div className="w-[40px] h-[40px] rounded-[8px] overflow-hidden relative shrink-0 z-10">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] h-[32.3px] overflow-hidden">
                <img
                  src={ASSETS.mugStamp}
                  alt="Stamp"
                  className="absolute max-w-none h-[350%] w-[673.08%] left-[-32.69%] top-[-125%]"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0 relative z-10 flex flex-col gap-[2px]">
              <p className="text-[12px] leading-[16px] font-semibold text-[#1A1A1A]">
                Collect <span className="text-[#E40032]">1 more stamp</span> to redeem a mug.
              </p>
              <p className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                Purchase this item to participate in stamp collecting.
              </p>
            </div>
          </div>

          {/* Bundle Discount Card (Figma 1630:129543) */}
          <div className="bg-white rounded-[12px] overflow-hidden">
            <div className={`${padAll} flex flex-col gap-[4px]`}>
              <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]" style={mpHeadingStyle}>
                Bundle discount
              </h2>
              <p className="text-[12px] leading-[16px] font-normal text-[#666666]">
                Buy together and enjoy a special discount!
              </p>
            </div>
            <div className={`${padX} pb-[12px] space-y-[12px]`}>
              <div className="pt-[4px] flex items-center gap-[8px]">
                {[
                  { img: ASSETS.wineBottleClean, name: 'Grant Burge GB51 Cabernet Shiraz 750ML', price: 135 },
                  { img: ASSETS.eminaCheese, name: 'Emina Vanilla Dess Nuts 6PC', price: 68 },
                  { img: ASSETS.ferrariniHam, name: 'Ferrarini Italian Parma Ham Slice 18 Mth 90GM', price: 80 },
                ].map((b, idx) => (
                  <React.Fragment key={b.name}>
                    {idx > 0 && (
                      <img
                        src={ICONS.plusDark}
                        alt="+"
                        className="w-[16px] h-[16px] object-contain shrink-0 opacity-70"
                      />
                    )}
                    <div
                      className={`flex-1 min-w-0 overflow-hidden bg-white flex flex-col ${
                        isMp ? '' : 'rounded-[8px] border border-[#E0E0E0]'
                      }`}
                    >
                      <div className="w-full h-[80px] flex items-center justify-center bg-white">
                        <img src={b.img} alt={b.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="px-[4px] pt-[4px] pb-[8px] flex flex-col gap-[8px]">
                        <p className="text-[12px] leading-[16px] font-semibold text-[#1A1A1A] line-clamp-2 min-h-[32px]">
                          {b.name}
                        </p>
                        <span className="inline-flex items-start font-bold text-[#E40032]">
                          <span className="text-[10px] leading-[16px]">&#36;</span>
                          <span className="text-[16px] leading-[20px]">{b.price}</span>
                          <span className="text-[10px] leading-[16px]">.00</span>
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="pt-[12px] border-t border-[#E0E0E0] flex items-center justify-between gap-[12px]">
                <div className="flex items-baseline gap-[4px] min-w-0">
                  <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">Total</span>
                  <span className="text-[16px] leading-[20px] font-bold text-[#E40032]">&#36;200.00</span>
                  <span className="bg-[#FFF6F5] text-[#E40032] text-[10px] leading-[14px] font-medium px-[2px] rounded-[2px] whitespace-nowrap">
                    Saved &#36;83.00
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddBundle}
                  className="h-[32px] px-[12px] rounded-[4px] bg-[#E40032] text-white text-[12px] leading-[16px] font-semibold shrink-0 active:opacity-90"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Reviews (Figma 1630:129586) */}
        <section id="pdp-reviews" className="bg-white rounded-[12px] overflow-hidden">
          <div className={`${padAll} flex items-center gap-[8px]`}>
            <div className="flex-1 flex items-center gap-[4px] min-w-0">
              <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]" style={mpHeadingStyle}>
                Reviews
              </h2>
              <span className="text-[14px] leading-[20px] font-normal text-[#666666]">(1.2k+)</span>
            </div>
            <div className="inline-flex items-center gap-[4px] shrink-0">
              <span className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">4.9</span>
              <img src={ICONS.star} alt="" className="w-[20px] h-[20px] object-contain" />
            </div>
            <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
          </div>

          <div className={`${padX} pt-[4px] pb-[8px] space-y-[8px]`}>
            <div className="flex flex-wrap gap-[8px]">
              {[
                { label: 'Beautifully packaged', count: '(500+)' },
                { label: 'Tastes good', count: '(100+)' },
                { label: 'Price is reasonable', count: '(100+)' },
                { label: 'Stunning', count: '(100+)' },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="h-[28px] px-[12px] rounded-full bg-[#F7F7F7] text-[12px] leading-[16px] inline-flex items-center gap-[4px]"
                >
                  <span className="text-[#1A1A1A]">{tag.label}</span>
                  <span className="text-[#666666]">{tag.count}</span>
                </span>
              ))}
            </div>

            <div>
              <div className="py-[12px] border-b border-[#E0E0E0] space-y-[8px]">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-[8px]">
                    <span className="text-[12px] leading-[16px] font-semibold text-[#1A1A1A]">Lucy</span>
                    <span className="inline-flex items-center gap-[2px]">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <img key={i} src={ICONS.star} alt="" className="w-[14px] h-[14px] object-contain" />
                      ))}
                    </span>
                  </div>
                  <span className="text-[12px] leading-[16px] text-[#666666]">20 Sep 2026</span>
                </div>
                <div className="flex items-start gap-[12px]">
                  <p className="flex-1 text-[14px] leading-[20px] text-[#3D3D3D] line-clamp-3">
                    This bottle of liquor is very delicious, and the packaging is also very exquisite. When I got it, I thought it was a work of art and couldn&apos;t bear to open it.
                  </p>
                  <img
                    src={ASSETS.wineBottleClean}
                    alt=""
                    className="w-[60px] h-[60px] bg-white object-contain shrink-0"
                  />
                </div>
              </div>
              <div className="py-[12px] space-y-[8px]">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-[8px]">
                    <span className="text-[12px] leading-[16px] font-semibold text-[#1A1A1A]">An</span>
                    <span className="inline-flex items-center gap-[2px]">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <img key={i} src={ICONS.star} alt="" className="w-[14px] h-[14px] object-contain" />
                      ))}
                    </span>
                  </div>
                  <span className="text-[12px] leading-[16px] text-[#666666]">19 Sep 2026</span>
                </div>
                <p className="text-[14px] leading-[20px] text-[#3D3D3D]">
                  I&apos;ve repurchased it many times, and it&apos;s still great.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Related Products — edge-bleed horizontal scroll */}
        <section className="bg-white rounded-[12px] py-[12px] overflow-hidden">
          <h2
            className={`${padX} text-[16px] leading-[24px] font-bold text-[#1A1A1A] mb-[8px]`}
            style={mpHeadingStyle}
          >
            Related Products
          </h2>
          <div className={`flex gap-[8px] overflow-x-auto no-scrollbar ${padX}`}>
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variant="compact"
                className="w-[132px] shrink-0"
              />
            ))}
          </div>
        </section>

        {/* 8. Product Details (Figma 1630:129647 / 1630:129650) */}
        <section id="pdp-details" className="bg-white rounded-[12px] overflow-hidden">
          <button
            type="button"
            onClick={() => setDetailsOpen((o) => !o)}
            className={`w-full ${padAll} flex items-center justify-between`}
          >
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]" style={mpHeadingStyle}>
              Product details
            </h2>
            {detailsOpen ? (
              <ChevronUp className="w-4 h-4 text-[#666666]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#666666]" />
            )}
          </button>

          {detailsOpen && (
            <div className="space-y-[16px]">
              <div className={`${padX} space-y-[16px]`}>
                {/* Stacked 1-column grey attribute card (Figma 1630:129651) */}
                <div className="bg-[#F7F7F7] rounded-[12px] p-[12px] space-y-[16px]">
                  <div className="space-y-[8px]">
                    <p className="text-[12px] leading-[16px] text-[#666666]">Size</p>
                    <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
                      {product.specs?.size ?? product.shortSpec ?? '750ML/pc'}
                    </p>
                  </div>
                  <div className="space-y-[8px]">
                    <p className="text-[12px] leading-[16px] text-[#666666]">Storage</p>
                    <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
                      {product.specs?.storage ?? 'Ambient'}
                    </p>
                  </div>
                  <div className="space-y-[8px]">
                    <p className="text-[12px] leading-[16px] text-[#666666]">Origins</p>
                    <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
                      {product.specs?.origin ?? 'Australia'}
                    </p>
                  </div>
                  <div className="space-y-[8px]">
                    <p className="text-[12px] leading-[16px] text-[#666666]">Brand / Category</p>
                    <div className="flex flex-wrap gap-[8px]">
                      {(product.specs?.brandCategories ?? ['Grant Burge', 'Red wine']).map((c) => (
                        <span
                          key={c}
                          className="h-[32px] min-w-[64px] px-[13px] rounded-full border border-[#858585] text-[14px] leading-[20px] text-[#1A1A1A] inline-flex items-center justify-center"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product description text (Figma 1630:129664) */}
                <div className="text-[14px] leading-[20px] text-[#3D3D3D] space-y-[12px]">
                  {product.specs?.grape && <p>Grape: {product.specs.grape}</p>}
                  {product.description && <p>{product.description}</p>}
                </div>

                {product.detailImages && product.detailImages.length > 0 && (
                  <div className="space-y-[8px]">
                    {product.detailImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-full object-contain bg-white"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Brand Message — authentic 3x MP Quality Commitment asset on MP, Wellcome 80+ on WE */}
              {isMp ? (
                <img
                  src="/assets/figma/mp/pdp-brand-message.png"
                  alt="Market Place Quality Commitment"
                  className="w-full h-auto block"
                />
              ) : (
                <div className="px-[12px] pb-[16px] pt-[16px] border-t border-[#F2F2F2] flex items-center gap-[12px]">
                  <img
                    src={ASSETS.trusted80Logo}
                    alt="Wellcome 80+ Years"
                    className="w-[58px] h-[56px] object-contain shrink-0"
                  />
                  <div className="space-y-[4px]">
                    <p className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                      Wellcome · Trusted for 80+ Years
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#666666]">
                      Fresh · Quality · Value
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 9. You May Like — Content-Adaptive Infinite Masonry Waterfall */}
        <section id="pdp-recommend" className={isMp ? 'pt-1 px-[16px]' : 'pt-1'}>
          <h2
            className="text-[16px] leading-[24px] font-bold text-[#1A1A1A] mb-[8px]"
            style={mpHeadingStyle}
          >
            You May Like
          </h2>
          {(() => {
            const expanded = Array.from({ length: recPages }, (_, pageIdx) =>
              youMayLike.map((p, idx) => ({
                product: p,
                renderKey: `pdp-rec-p${pageIdx}-i${idx}-${p.id}`,
              }))
            ).flat();
            const left = expanded.filter((_, idx) => idx % 2 === 0);
            const right = expanded.filter((_, idx) => idx % 2 === 1);
            return (
              <>
                <div className="flex gap-[8px] items-start">
                  <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                    {left.map(({ product: item, renderKey }) => (
                      <ProductCard key={renderKey} product={item} variant="waterfall" />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                    {right.map(({ product: item, renderKey }) => (
                      <ProductCard key={renderKey} product={item} variant="waterfall" />
                    ))}
                  </div>
                </div>
                <div ref={recSentinelRef} className="py-4 text-center text-[11px] text-[#858585]">
                  {recPages < 20 ? 'Loading more picks…' : 'You have reached the end'}
                </div>
              </>
            );
          })()}
        </section>
      </div>

      {/* Sticky Footer (Figma 7589:82698) */}
      <footer className={`app-fixed-bar bottom-0 z-30 bg-white border-t border-[#EFEFEF] ${padX} pt-[12px] pb-[max(14px,env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-2px_8px_rgba(0,0,0,0.06)]`}>
        <button
          type="button"
          onClick={() => navigate('cart')}
          aria-label="Open Cart"
          className="relative w-[36px] h-[40px] flex items-center justify-center shrink-0"
        >
          <img src={ICONS.tabCart} alt="Cart" className="w-[28px] h-[28px] object-contain" />
          {totalCartCount > 0 && (
            <span className="absolute top-[2px] right-0 min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#FFCF00] text-[#1A1A1A] text-[10px] leading-[12px] font-normal flex items-center justify-center border border-white">
              {totalCartCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-[16px]">
          {/* Figma Add Quantity Counter (40x40 #F7F7F7 square buttons) */}
          <div className="flex items-center gap-[4px]">
            <button
              type="button"
              onClick={() => setPendingQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-[40px] h-[40px] rounded-[8px] bg-[#F7F7F7] flex items-center justify-center active:bg-[#EAEAEA]"
            >
              <img src={ICONS.minus} alt="" className="w-[24px] h-[24px] object-contain" />
            </button>
            <span className="w-[40px] text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
              {pendingQty}
            </span>
            <button
              type="button"
              onClick={() => setPendingQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="w-[40px] h-[40px] rounded-[8px] bg-[#F7F7F7] flex items-center justify-center active:bg-[#EAEAEA]"
            >
              <img src={ICONS.plusDark} alt="" className="w-[24px] h-[24px] object-contain" />
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrimaryAddToCart}
            className="h-[40px] px-[16px] rounded-[8px] bg-[#E40032] text-white text-[14px] leading-[20px] font-semibold active:opacity-90 transition-opacity whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
      </footer>

      {/* Drawer 1: Select Option (Figma 8510:336378) */}
      <BottomSheetDrawer
        open={optionDrawerOpen}
        onClose={() => setOptionDrawerOpen(false)}
        title="Select Option"
        footer={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setOptionDrawerOpen(false);
                navigate('cart');
              }}
              className="relative w-[36px] h-[40px] flex items-center justify-center shrink-0"
            >
              <img src={ICONS.tabCart} alt="Cart" className="w-[28px] h-[28px] object-contain" />
              {totalCartCount > 0 && (
                <span className="absolute top-[2px] right-0 min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#FFCF00] text-[#1A1A1A] text-[10px] leading-[12px] flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[4px]">
                <button
                  type="button"
                  onClick={() => setPendingQty((q) => Math.max(1, q - 1))}
                  className="w-[40px] h-[40px] rounded-[8px] bg-[#F7F7F7] flex items-center justify-center active:bg-[#EAEAEA]"
                >
                  <img src={ICONS.minus} alt="" className="w-[24px] h-[24px] object-contain" />
                </button>
                <span className="w-[40px] text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                  {pendingQty}
                </span>
                <button
                  type="button"
                  onClick={() => setPendingQty((q) => q + 1)}
                  className="w-[40px] h-[40px] rounded-[8px] bg-[#F7F7F7] flex items-center justify-center active:bg-[#EAEAEA]"
                >
                  <img src={ICONS.plusDark} alt="" className="w-[24px] h-[24px] object-contain" />
                </button>
              </div>
              <button
                type="button"
                onClick={handlePrimaryAddToCart}
                className="h-[40px] px-[16px] rounded-[8px] bg-[#E40032] text-white text-[14px] leading-[20px] font-semibold whitespace-nowrap"
              >
                Add to Cart
              </button>
            </div>
          </div>
        }
      >
        <div className="p-4 space-y-3">
          {product.variants?.map((v) => {
            const active = v.id === activeVariant?.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`rounded-[12px] p-3 border flex items-center gap-3 cursor-pointer transition-colors ${
                  active ? 'border-[#E40032] bg-[#FFF6F5]' : 'border-[#EAEAEA] bg-white'
                }`}
              >
                <div className="relative w-[72px] h-[72px] rounded-[8px] bg-white border border-[#F2F2F2] p-1 flex items-center justify-center shrink-0">
                  <img src={v.image} alt={v.label} className="w-full h-full object-contain" />
                  {v.badge && (
                    <span className="absolute top-0 right-0 bg-[#E40032] text-white text-[9px] font-bold px-1 rounded-bl-[4px] rounded-tr-[6px]">
                      {v.badge}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1A1A1A] line-clamp-2">
                    {v.fullTitle}
                  </p>
                  {v.soldText && (
                    <p className="text-[11px] text-[#858585] mt-0.5">{v.soldText}</p>
                  )}
                  {v.promoTag && (
                    <div className="mt-1">
                      <PromoTag label={v.promoTag} />
                    </div>
                  )}
                  <div className="mt-1.5">
                    <PriceBlock
                      price={v.price}
                      originalPrice={v.isCaseDeal ? undefined : v.originalPrice}
                      unitPriceText={v.unitPriceText}
                      size="md"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BottomSheetDrawer>

      {/* Drawer 2: Delivery Method (Figma 8510:336377 with confirmed 200/500 & 50/200 thresholds) */}
      <BottomSheetDrawer
        open={deliveryDrawerOpen}
        onClose={() => setDeliveryDrawerOpen(false)}
        title="Delivery method"
        footer={
          <button
            type="button"
            onClick={() => {
              setDeliveryDrawerOpen(false);
              openFulfillmentSheet();
            }}
            className="w-full h-[44px] rounded-[10px] bg-[#E40032] text-white text-[14px] font-bold"
          >
            Switch Delivery / Click &amp; Collect
          </button>
        }
      >
        <div className="p-4 space-y-3 bg-[#F7F7F7]">
          <div className="bg-white rounded-[12px] p-4 border border-[#EFEFEF]">
            <p className="text-[15px] font-bold text-[#1A1A1A]">Home Delivery</p>
            <p className="text-[13px] text-[#3D3D3D] mt-1">
              Min order &#36;200 · Free delivery on orders over &#36;500.
            </p>
            <p className="text-[11px] text-[#858585] mt-1">
              Spend &#36;800+ for 12% extra order savings.
            </p>
          </div>
          <div className="bg-white rounded-[12px] p-4 border border-[#EFEFEF]">
            <p className="text-[15px] font-bold text-[#1A1A1A]">Click &amp; Collect</p>
            <p className="text-[13px] text-[#3D3D3D] mt-1">
              Min order &#36;50 · Free pick-up on orders over &#36;200.
            </p>
            <p className="text-[11px] text-[#858585] mt-1">
              Spend &#36;800+ for 12% extra order savings.
            </p>
          </div>
        </div>
      </BottomSheetDrawer>

      {/* Drawer 3: Users often buy together (Figma 1637:133638) */}
      <BottomSheetDrawer
        open={afterAddedOpen}
        onClose={() => setAfterAddedOpen(false)}
        title="Users often buy together"
        footer={
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setAfterAddedOpen(false);
                navigate('cart');
              }}
              className="h-[44px] rounded-[10px] bg-[#FFF0F2] text-[#E40032] text-[14px] font-bold"
            >
              Go to cart
            </button>
            <button
              type="button"
              onClick={() => setAfterAddedOpen(false)}
              className="h-[44px] rounded-[10px] bg-[#E40032] text-white text-[14px] font-bold"
            >
              Continue shopping
            </button>
          </div>
        }
      >
        <div className="p-3 bg-[#F7F7F7] grid grid-cols-3 gap-2">
          {oftenBought.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variant="compact"
              onCardClick={(item) => {
                setAfterAddedOpen(false);
                navigate('pdp', item.id);
              }}
            />
          ))}
        </div>
      </BottomSheetDrawer>
    </div>
  );
};
