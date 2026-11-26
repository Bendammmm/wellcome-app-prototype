import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { ASSETS, ICONS, PRODUCTS, getProductById } from '../../data/catalog';
import { getTotalCartCount, useAppStore } from '../../store/useAppStore';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { CountdownTimer } from '../../components/shared/CountdownTimer';
import { PriceBlock } from '../../components/shared/PriceBlock';
import { ProductCard } from '../../components/shared/ProductCard';
import { PromoTag } from '../../components/shared/PromoTag';
import { QuantityStepper } from '../../components/shared/QuantityStepper';

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

  useEffect(() => {
    setSelectedVariantId(defaultVariantId);
    setSlideIndex(0);
    setPendingQty(1);
  }, [activeProductId, defaultVariantId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 220);
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
    addToCart(product.id, pendingQty, activeVariant?.id, true);
    setOptionDrawerOpen(false);
    setAfterAddedOpen(true);
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
    <div className="min-h-dvh bg-[#F7F7F7] pb-[92px]">
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

      {/* 1. Product Gallery (Overview) */}
      <section id="pdp-overview" className="relative bg-white w-full h-[350px] flex items-center justify-center overflow-hidden">
        <img
          src={galleryImages[slideIndex]}
          alt={activeTitle}
          onClick={() => setSlideIndex((i) => (i + 1) % galleryImages.length)}
          className="w-full h-full object-contain p-4 cursor-pointer"
        />
        <span className="absolute bottom-3 right-3 bg-black/45 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
          {slideIndex + 1}/{galleryImages.length}
        </span>
      </section>

      {/* 2. Horizontal Option Chips (Case Deal SKU selector) with pinned right "3 options" */}
      {product.variants && product.variants.length > 0 && (
        <section className="relative bg-white border-t border-[#F2F2F2]">
          <div className="px-3 py-2.5 pr-[76px] flex items-center gap-2 overflow-x-auto no-scrollbar">
            {product.variants.map((v) => {
              const active = v.id === activeVariant?.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`shrink-0 rounded-[8px] px-3 py-2 text-left border transition-colors ${
                    active
                      ? 'border-[#E40032] bg-[#FFF6F5]'
                      : 'border-[#EAEAEA] bg-[#F7F7F7]'
                  }`}
                >
                  <p className="text-[12px] font-semibold text-[#1A1A1A]">{v.label}</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[13px] font-bold text-[#1A1A1A]">
                      &#36;{v.price.toFixed(2)}
                    </span>
                    {v.unitPriceText && (
                      <span className="text-[10px] text-[#666666]">{v.unitPriceText}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setOptionDrawerOpen(true)}
            className="absolute right-0 inset-y-0 w-[68px] bg-white shadow-[-10px_0_12px_-4px_rgba(255,255,255,0.98)] border-l border-[#F5F5F5] flex flex-col items-center justify-center text-[11px] font-medium text-[#3D3D3D]"
          >
            <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain mb-0.5" />
            <span>{product.variants.length} options</span>
          </button>
        </section>
      )}

      {/* Main PDP Cards */}
      <div className="px-2 pt-2 space-y-2">
        {/* 3. Price Banner + Product Info Card */}
        <section className="bg-white rounded-[12px] overflow-hidden">
          {/* Dynamic Price Banner matching Figma 7656:81124 */}
          {fulfillmentMode === 'click_and_collect' ? (
            <div className="bg-gradient-to-r from-[#E40032] to-[#FF2449] px-3.5 py-3 flex items-center justify-between text-white">
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
            <div className="bg-gradient-to-r from-[#FF5500] to-[#FF951C] px-3.5 py-3 flex items-center justify-between text-white">
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
            <div className="px-3.5 pt-3.5">
              {/* Sticky note 8510:328317: Case deal shows average price ($100/Bottle) instead of strikethrough */}
              <PriceBlock
                price={activePrice}
                originalPrice={activeOriginalPrice}
                unitPriceText={activeUnitPrice}
                size="hero"
              />
            </div>
          )}

          <div className="p-3.5 space-y-2.5">
            {product.promoTags && product.promoTags.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {product.promoTags.map((tag) => (
                    <PromoTag key={tag} label={tag} />
                  ))}
                </div>
                <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain" />
              </div>
            )}

            <h1 className="text-[18px] leading-[24px] font-bold text-[#1A1A1A]">
              {activeTitle}
            </h1>

            {product.description && (
              <p className="text-[13px] leading-[19px] text-[#666666]">
                {product.description}
              </p>
            )}

            {/* Highlight Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <div className="px-2.5 py-1.5 rounded-[8px] bg-gradient-to-r from-[#FFF0B3] to-[#FFF7D6] text-[#1A1A1A] text-[12px] font-bold shrink-0">
                {product.highlights?.rank ?? 'Top 10'}
              </div>
              <div className="px-2.5 py-1.5 rounded-[8px] bg-[#F7F7F7] text-[12px] text-[#1A1A1A] inline-flex items-center gap-1 shrink-0">
                <img src={ICONS.star} alt="" className="w-3.5 h-3.5 object-contain" />
                <span className="font-bold">{product.highlights?.rating ?? '4.8'}</span>
                <span className="text-[#858585]">
                  ({product.highlights?.reviewCount ?? '1,932'})
                </span>
              </div>
              <div className="px-2.5 py-1.5 rounded-[8px] bg-[#F7F7F7] text-[12px] font-medium text-[#1A1A1A] shrink-0">
                {product.highlights?.sold ?? product.soldText ?? '2k sold'}
              </div>
              <div className="px-2.5 py-1.5 rounded-[8px] bg-[#F7F7F7] text-[12px] font-medium text-[#1A1A1A] shrink-0">
                {product.highlights?.origin ?? 'Australia'}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Delivery & Click & Collect Info Card */}
        <section className="bg-white rounded-[12px] p-3 space-y-2.5">
          <div className="bg-[#FFF6F5] rounded-[8px] px-3 py-2 text-[12px] text-[#3D3D3D]">
            Please place order for delivery between <strong>12 Jun</strong> to{' '}
            <strong>15 Jun</strong>.
          </div>
          <button
            type="button"
            onClick={() => setDeliveryDrawerOpen(true)}
            className="w-full flex items-center justify-between pt-0.5 text-left"
          >
            <div className="flex items-center gap-3 text-[12px] font-medium text-[#1A1A1A]">
              <span className="inline-flex items-center gap-1">
                <img src={ICONS.cncBag} alt="" className="w-3.5 h-3.5 object-contain" />
                Click &amp; Collect
              </span>
              <span className="inline-flex items-center gap-1">
                <img src={ICONS.truck} alt="" className="w-3.5 h-3.5 object-contain" />
                Home Delivery
              </span>
            </div>
            <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain" />
          </button>
        </section>

        {/* 5. Offers + Stamp + Bundle Discount */}
        <section id="pdp-offers" className="space-y-2">
          <div className="bg-white rounded-[12px] p-3.5 space-y-3">
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Offers</h2>
            <div className="flex items-center gap-3">
              <img
                src={ASSETS.wineBottleClean}
                alt=""
                className="w-10 h-10 object-contain shrink-0"
              />
              <div className="flex-1 min-w-0">
                <PromoTag label="50% Off" />
                <p className="text-[12px] text-[#3D3D3D] mt-1 leading-[16px]">
                  Selected brand items enjoy a 50% off discount, while stocks last.
                </p>
              </div>
              <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain shrink-0" />
            </div>
            <div className="h-[1px] bg-[#F2F2F2]" />
            <div className="flex items-center gap-3">
              <img
                src={ASSETS.eminaCheese}
                alt=""
                className="w-10 h-10 object-contain shrink-0"
              />
              <div className="flex-1 min-w-0">
                <PromoTag label="Free Gift" />
                <p className="text-[12px] text-[#3D3D3D] mt-1 leading-[16px]">
                  Purchase any Burge wine over &#36;100 and receive cheese.
                </p>
              </div>
              <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain shrink-0" />
            </div>
          </div>

          {/* Stamp Card */}
          <div className="bg-white rounded-[12px] p-3 flex items-center gap-3">
            <img src={ASSETS.mugStamp} alt="Stamp" className="w-10 h-10 object-contain shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#1A1A1A]">
                Collect <span className="text-[#E40032]">1 more stamp</span> to redeem a mug.
              </p>
              <p className="text-[11px] text-[#666666] mt-0.5">
                Purchase this item to participate in stamp collecting.
              </p>
            </div>
          </div>

          {/* Bundle Discount Card */}
          <div className="bg-white rounded-[12px] p-3.5">
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Bundle discount</h2>
            <p className="text-[12px] text-[#666666] mt-0.5">
              Buy together and enjoy a special discount!
            </p>
            <div className="mt-3 flex items-center justify-between gap-1">
              {[
                { img: ASSETS.wineBottleClean, name: 'Grant Burge GB51...', price: 128 },
                { img: ASSETS.eminaCheese, name: 'Emina Vanilla De...', price: 67 },
                { img: ASSETS.ferrariniHam, name: 'Ferrarini Italian Par...', price: 80 },
              ].map((b, idx) => (
                <React.Fragment key={b.name}>
                  {idx > 0 && <span className="text-[16px] font-bold text-[#858585]">+</span>}
                  <div className="flex-1 rounded-[8px] border border-[#EFEFEF] p-2 bg-white">
                    <img src={b.img} alt={b.name} className="w-full h-[64px] object-contain" />
                    <p className="text-[11px] text-[#1A1A1A] line-clamp-2 mt-1 leading-[14px]">
                      {b.name}
                    </p>
                    <p className="text-[12px] font-bold text-[#E40032] mt-1">
                      &#36;{b.price}.00
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#F2F2F2] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] text-[#3D3D3D]">Total</span>
                <span className="text-[16px] font-bold text-[#E40032]">&#36;200.00</span>
                <span className="text-[10px] font-medium bg-[#FFF0F2] text-[#E40032] px-1.5 py-0.5 rounded-[4px]">
                  Saved &#36;75.00
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddBundle}
                className="h-[34px] px-4 rounded-[8px] bg-[#E40032] text-white text-[13px] font-bold active:opacity-90"
              >
                Add to cart
              </button>
            </div>
          </div>
        </section>

        {/* 6. Reviews */}
        <section id="pdp-reviews" className="bg-white rounded-[12px] p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">
              Reviews <span className="text-[12px] font-normal text-[#858585]">(1.2k+)</span>
            </h2>
            <div className="inline-flex items-center gap-1 text-[14px] font-bold text-[#1A1A1A]">
              <span>4.9</span>
              <img src={ICONS.star} alt="" className="w-4 h-4 object-contain" />
              <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain" />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['Beautifully packaged (100+)', 'Tastes great (100+)', 'Price is reasonable (100+)'].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#F7F7F7] text-[11px] text-[#3D3D3D]"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex gap-2.5">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#1A1A1A]">Lady · ★★★★★</span>
                  <span className="text-[11px] text-[#858585]">09 Sep 2026</span>
                </div>
                <p className="text-[12px] text-[#3D3D3D] mt-1 leading-[17px]">
                  This bottle of wine is very delicious, and the packaging is also very exquisite.
                </p>
              </div>
              <img
                src={ASSETS.wineBottleClean}
                alt=""
                className="w-12 h-12 rounded-[6px] bg-[#F7F7F7] object-contain p-1 shrink-0"
              />
            </div>
            <div className="h-[1px] bg-[#F2F2F2]" />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1A1A1A]">Ao · ★★★★★</span>
                <span className="text-[11px] text-[#858585]">15 Sep 2026</span>
              </div>
              <p className="text-[12px] text-[#3D3D3D] mt-1">
                I&apos;ve repurchased it many times, and it&apos;s still great.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Related Products — edge-bleed horizontal scroll */}
        <section className="bg-white rounded-[12px] py-3.5 overflow-hidden">
          <h2 className="px-3.5 text-[16px] leading-[24px] font-bold text-[#1A1A1A] mb-2.5">
            Related Products
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3.5">
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

        {/* 8. Product Details */}
        <section id="pdp-details" className="bg-white rounded-[12px] p-3.5">
          <button
            type="button"
            onClick={() => setDetailsOpen((o) => !o)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">Product details</h2>
            {detailsOpen ? (
              <ChevronUp className="w-4 h-4 text-[#666666]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#666666]" />
            )}
          </button>

          {detailsOpen && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5 text-[12px]">
                <div>
                  <p className="text-[#858585]">Size</p>
                  <p className="font-medium text-[#1A1A1A] mt-0.5">
                    {product.specs?.size ?? product.shortSpec ?? 'Standard'}
                  </p>
                </div>
                <div>
                  <p className="text-[#858585]">Storage</p>
                  <p className="font-medium text-[#1A1A1A] mt-0.5">
                    {product.specs?.storage ?? 'Ambient'}
                  </p>
                </div>
                <div>
                  <p className="text-[#858585]">Origin</p>
                  <p className="font-medium text-[#1A1A1A] mt-0.5">
                    {product.specs?.origin ?? 'Imported'}
                  </p>
                </div>
                <div>
                  <p className="text-[#858585]">Brand/Category</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(product.specs?.brandCategories ?? ['Wellcome']).map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-full border border-[#E0E0E0] text-[11px] text-[#3D3D3D]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {product.detailImages && product.detailImages.length > 0 && (
                <div className="space-y-2 pt-2">
                  {product.detailImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-full rounded-[8px] object-contain bg-white"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-[#F2F2F2] flex items-center gap-3">
                <img
                  src={ASSETS.trusted80Logo}
                  alt="Wellcome 80+ Years"
                  className="w-11 h-11 object-contain shrink-0"
                />
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">
                    Wellcome · Trusted for 80+ Years
                  </p>
                  <p className="text-[11px] text-[#666666]">Fresh · Quality · Value</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 9. You May Like */}
        <section id="pdp-recommend" className="pt-1">
          <h2 className="text-[15px] font-bold text-[#1A1A1A] px-1 mb-2">You May Like</h2>
          <div className="grid grid-cols-2 gap-2">
            {youMayLike.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Footer */}
      <footer className="app-fixed-bar bottom-0 z-30 bg-white border-t border-[#EFEFEF] px-3.5 pt-2.5 pb-[max(14px,env(safe-area-inset-bottom))] flex items-center gap-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={() => navigate('cart')}
          aria-label="Open Cart"
          className="relative w-10 h-10 flex items-center justify-center shrink-0"
        >
          <img src={ICONS.tabCart} alt="Cart" className="w-6 h-6 object-contain" />
          {totalCartCount > 0 && (
            <span className="absolute top-0.5 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFCF00] text-[#1A1A1A] text-[10px] font-extrabold flex items-center justify-center border border-white">
              {totalCartCount}
            </span>
          )}
        </button>

        <QuantityStepper value={pendingQty} onChange={setPendingQty} min={1} size="md" />

        <button
          type="button"
          onClick={handlePrimaryAddToCart}
          className="flex-1 h-[42px] rounded-[10px] bg-[#E40032] text-white text-[15px] font-bold active:opacity-90 transition-opacity"
        >
          Add to Cart
        </button>
      </footer>

      {/* Drawer 1: Select Option (Figma 8510:336378) */}
      <BottomSheetDrawer
        open={optionDrawerOpen}
        onClose={() => setOptionDrawerOpen(false)}
        title="Select Option"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOptionDrawerOpen(false);
                navigate('cart');
              }}
              className="relative w-10 h-10 flex items-center justify-center shrink-0"
            >
              <img src={ICONS.tabCart} alt="Cart" className="w-6 h-6 object-contain" />
              {totalCartCount > 0 && (
                <span className="absolute top-0.5 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFCF00] text-[#1A1A1A] text-[10px] font-extrabold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
            <QuantityStepper value={pendingQty} onChange={setPendingQty} min={1} size="md" />
            <button
              type="button"
              onClick={handlePrimaryAddToCart}
              className="flex-1 h-[42px] rounded-[10px] bg-[#E40032] text-white text-[15px] font-bold"
            >
              Add to Cart
            </button>
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
