import React, { useEffect, useRef, useState } from 'react';
import {
  BadgePercent,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Info,
  PencilLine,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Truck,
  X,
} from 'lucide-react';
import {
  ASSETS,
  DELIVERY_ADDRESSES,
  ICONS,
  PICKUP_STORES,
  PRODUCTS,
  getEffectiveItemMeta,
} from '../../data/catalog';
import { computePricingSummary, useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';
import type { CartItem, OrderRecord } from '../../types';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { PriceBlock } from '../../components/shared/PriceBlock';
import { ProductAddControl } from '../../components/shared/ProductAddControl';
import { ProductCard } from '../../components/shared/ProductCard';
import { PromoTag } from '../../components/shared/PromoTag';
import { QuantityStepper } from '../../components/shared/QuantityStepper';
import { ThresholdProgressBar } from '../../components/shared/ThresholdProgressBar';

export const CartPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const selectedAddressId = useAppStore((s) => s.selectedAddressId);
  const selectedStoreId = useAppStore((s) => s.selectedStoreId);
  const openFulfillmentSheet = useAppStore((s) => s.openFulfillmentSheet);
  const cartItems = useAppStore((s) => s.cartItems);
  const setCartItemQty = useAppStore((s) => s.setCartItemQty);
  const toggleItemSelected = useAppStore((s) => s.toggleItemSelected);
  const toggleSelectAll = useAppStore((s) => s.toggleSelectAll);
  const removeSelectedItems = useAppStore((s) => s.removeSelectedItems);
  const deselectExtraLeadTimeItems = useAppStore((s) => s.deselectExtraLeadTimeItems);
  const resetDemoCart = useAppStore((s) => s.resetDemoCart);
  const appliedPromoCode = useAppStore((s) => s.appliedPromoCode);
  const promoCodeDiscount = useAppStore((s) => s.promoCodeDiscount);
  const applyPromoCode = useAppStore((s) => s.applyPromoCode);
  const redeemVisible = useAppStore((s) => s.redeemVisible);
  const setRedeemVisible = useAppStore((s) => s.setRedeemVisible);
  const submitMockOrder = useAppStore((s) => s.submitMockOrder);

  const [isEditMode, setIsEditMode] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [recTab, setRecTab] = useState<'like' | 'usuals'>('like');

  const [leadTimeDrawerOpen, setLeadTimeDrawerOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  const [minOrderWarnOpen, setMinOrderWarnOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [activeBasket, setActiveBasket] = useState<'main' | 'preorder' | null>('main');

  const mainBasketRef = useRef<HTMLElement | null>(null);
  const preorderBasketRef = useRef<HTMLElement | null>(null);

  const mainItems = cartItems.filter((i) => i.section === 'main');
  const preorderItems = cartItems.filter((i) => i.section === 'preorder');

  const mainPricing = computePricingSummary(mainItems, fulfillmentMode, promoCodeDiscount);
  const preorderPricing = computePricingSummary(preorderItems, fulfillmentMode, 0);
  const pricing = activeBasket === 'preorder' ? preorderPricing : mainPricing;
  const isDelivery = fulfillmentMode === 'delivery';

  useEffect(() => {
    const updateActiveBasket = () => {
      if (cartItems.length === 0) {
        setActiveBasket(null);
        return;
      }
      const headerBottom = 56;
      const vh = window.innerHeight;
      const mainRect = mainBasketRef.current?.getBoundingClientRect();
      const preRect = preorderBasketRef.current?.getBoundingClientRect();

      const mainVisible = !!mainRect && mainRect.bottom > headerBottom + 40 && mainRect.top < vh - 120;
      const preVisible = !!preRect && preRect.bottom > headerBottom + 40 && preRect.top < vh - 120;

      // Switch to Pre-order once its top enters upper half of viewport or Main basket has scrolled off
      if (preVisible && (!mainVisible || (preRect && preRect.top <= vh * 0.45))) {
        setActiveBasket('preorder');
      } else if (mainVisible) {
        setActiveBasket('main');
      } else {
        setActiveBasket(null);
      }
    };
    updateActiveBasket();
    window.addEventListener('scroll', updateActiveBasket, { passive: true });
    window.addEventListener('resize', updateActiveBasket);
    return () => {
      window.removeEventListener('scroll', updateActiveBasket);
      window.removeEventListener('resize', updateActiveBasket);
    };
  }, [cartItems.length, mainItems.length, preorderItems.length]);

  const currentAddr =
    DELIVERY_ADDRESSES.find((a) => a.id === selectedAddressId) ?? DELIVERY_ADDRESSES[0];
  const currentStore =
    PICKUP_STORES.find((s) => s.id === selectedStoreId) ?? PICKUP_STORES[0];

  const navLocation = isDelivery
    ? `to ${currentAddr.shortNavLabel}`
    : `· ${currentStore.shortNavLabel}`;

  const activeBasketItems = activeBasket === 'preorder' ? preorderItems : mainItems;
  const allSelected =
    activeBasketItems.length > 0 && activeBasketItems.every((i) => i.selected);

  const handleToggleBasketAll = () => {
    if (activeBasket === 'preorder') {
      const allPreSelected = preorderItems.every((i) => i.selected);
      preorderItems.forEach((i) => {
        if (i.selected === allPreSelected) toggleItemSelected(i.key);
      });
    } else if (activeBasket === 'main') {
      const allMainSelected = mainItems.every((i) => i.selected);
      mainItems.forEach((i) => {
        if (i.selected === allMainSelected) toggleItemSelected(i.key);
      });
    } else {
      toggleSelectAll();
    }
  };

  const extraLeadTimeItems = cartItems.filter((i) => {
    const meta = getEffectiveItemMeta(i.productId, i.variantId);
    return i.selected && meta.isExtraLeadTime;
  });

  const recProducts =
    recTab === 'like'
      ? PRODUCTS.filter((p) =>
          ['belena-shiraz', 'bin-180-wine', 'nissin-bowl', 'jumbo-blueberry'].includes(p.id)
        )
      : PRODUCTS.filter((p) =>
          ['fuji-apple', 'zespri-kiwi', 'us-beef-blade', 'emina-cheese'].includes(p.id)
        );

  const handleCheckoutPress = () => {
    if (pricing.totalUnits === 0) return;
    if (!pricing.meetsMinimum) {
      setMinOrderWarnOpen(true);
    } else {
      navigate('checkout');
    }
  };

  const handleConfirmPay = () => {
    const order = submitMockOrder();
    setConfirmedOrder(order);
  };

  const renderCartRow = (item: CartItem) => {
    const meta = getEffectiveItemMeta(item.productId, item.variantId);
    const promoId = meta.product.promoGroupId;

    return (
      <div key={item.key} className="py-[8px] border-b border-[#E0E0E0] last:border-b-0">
        {/* Optional Promo Group Header matching Figma 8585:131791 (_Cart Promo Bar) */}
        {promoId === '10-off' && (
          <div className="flex items-center justify-between gap-[8px] mb-[8px]">
            <div className="flex items-center gap-[8px] min-w-0">
              <PromoTag label="10% off" applied />
              <span className="text-[12px] leading-[16px] text-[#3D3D3D] truncate">
                Saved: &#36;{(meta.price * item.qty * 0.1).toFixed(2)}
              </span>
            </div>
            <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
          </div>
        )}
        {promoId === 'buy2-30' && (
          <div className="flex items-center justify-between gap-[8px] mb-[8px]">
            <div className="flex items-center gap-[8px] min-w-0">
              <PromoTag label="Buy 2 for $30" applied={item.qty >= 2} />
              <span className="text-[12px] leading-[16px] text-[#3D3D3D] truncate">
                {item.qty >= 2
                  ? `Offer applied, Saved: $${(Math.floor(item.qty / 2) * (meta.price * 2 - 30)).toFixed(2)}`
                  : 'Add 1 more to get 2 for $30'}
              </span>
            </div>
            <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
          </div>
        )}
        {promoId === '2-for-20-off' && (
          <div className="flex items-center justify-between gap-[8px] mb-[8px]">
            <div className="flex items-center gap-[8px] min-w-0">
              <PromoTag label="2 for 20% off" applied={item.qty >= 2} />
              <span className="text-[12px] leading-[16px] text-[#3D3D3D] truncate">
                {item.qty >= 2
                  ? `Offer applied, Saved: $${(meta.price * item.qty * 0.2).toFixed(2)}`
                  : 'Add 1 more item to get 20% off'}
              </span>
            </div>
            <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
          </div>
        )}

        <div className="flex items-center gap-[8px] py-[8px]">
          {/* Checkbox (Figma 8461:107347: 24x24px) */}
          <button
            type="button"
            aria-label={item.selected ? 'Deselect item' : 'Select item'}
            onClick={() => toggleItemSelected(item.key)}
            className="w-[24px] h-[24px] flex items-center justify-center shrink-0"
          >
            {item.selected && t.isMp ? (
              <span
                className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: t.primary }}
              >
                <Check className="w-[12px] h-[12px]" strokeWidth={3} />
              </span>
            ) : (
              <img
                src={item.selected ? ICONS.radioChecked : ICONS.radioBlank}
                alt=""
                className="w-[24px] h-[24px] object-contain"
              />
            )}
          </button>

          {/* Product Thumbnail (Figma 8585:131791: 76x76px, radius 4px) */}
          <button
            type="button"
            onClick={() => navigate('pdp', item.productId)}
            className="w-[76px] h-[76px] rounded-[4px] bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden"
          >
            <img src={meta.image} alt={meta.title} className="w-full h-full object-contain" />
          </button>

          {/* Info + Stepper */}
          <div className="flex-1 min-w-0 min-h-[76px] flex flex-col justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate('pdp', item.productId)}
                className="text-left block w-full"
              >
                <p className="text-[14px] leading-[20px] font-normal text-[#1A1A1A] line-clamp-2">
                  {meta.title}
                </p>
              </button>

              <div className="flex flex-wrap items-center gap-[4px] mt-[2px]">
                {meta.product.shortSpec && (
                  <span className="text-[12px] leading-[16px] text-[#666666]">
                    {meta.product.shortSpec}
                  </span>
                )}
                {meta.isExtraLeadTime && (
                  <PromoTag label="Extra lead time" variant="leadtime" />
                )}
              </div>
            </div>

            <div className="mt-[8px] flex items-end justify-between gap-[8px]">
              <PriceBlock
                price={meta.price}
                originalPrice={meta.originalPrice}
                unitPriceText={meta.unitPriceText}
                size="sm"
              />
              <QuantityStepper
                value={item.qty}
                onChange={(next) => setCartItemQty(item.key, next)}
                min={0}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Gift sub-row if present */}
        {meta.product.giftItem && (
          <div className="mt-2 pl-9 flex items-center gap-2 text-[11px] text-[#666666]">
            <img
              src={meta.product.giftItem.image}
              alt=""
              className="w-6 h-6 rounded-[4px] object-contain border border-[#F0F0F0]"
            />
            <PromoTag label="Gift" variant="gift" />
            <span className="truncate flex-1">{meta.product.giftItem.name}</span>
            <span className="shrink-0">x{meta.product.giftItem.qty}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[196px]">
      {/* Sticky Top NavigationBar (Figma 8585:133872 — exact 48px row) */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#EFEFEF] pt-[env(safe-area-inset-top)]">
        <div className="h-[48px] px-[12px] flex items-center justify-between gap-[8px]">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
          >
            <img src={ICONS.chevronLeft} alt="" className="w-[28px] h-[28px] object-contain" />
          </button>

          <button
            type="button"
            onClick={openFulfillmentSheet}
            className="flex items-center gap-[4px] text-[14px] leading-[20px] text-[#1A1A1A] min-w-0 flex-1 justify-start"
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
            <span className="truncate text-[#3D3D3D]">{navLocation}</span>
            <img src={ICONS.chevronDown} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setIsEditMode((e) => !e)}
            aria-label={isEditMode ? 'Done editing' : 'Edit cart'}
            className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
          >
            {isEditMode ? (
              <Check className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2.4} />
            ) : (
              <img src={ICONS.edit} alt="Edit" className="w-[24px] h-[24px] object-contain" />
            )}
          </button>
        </div>
      </header>

      <div className="mp-edge-stack px-[8px] pt-[8px] flex flex-col gap-[8px]">
        {/* Promo Notice Strip (Figma 8585:131776) */}
        <div className="bg-gradient-to-t from-white to-[#FFF6F5] border-2 border-white rounded-[12px] p-[12px] flex items-center gap-[8px]">
          <span className="w-[24px] h-[24px] rounded-full bg-[#E40032] flex items-center justify-center shrink-0">
            <img src={ICONS.promoOutline} alt="" className="w-[14px] h-[14px] object-contain" />
          </span>
          <p className="text-[12px] leading-[16px] text-[#3D3D3D] font-normal truncate">
            Hang Seng enJoy Card Day, Spend over &#36;600 get 8% off
          </p>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <section className="bg-white rounded-[12px] p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFF6F5] flex items-center justify-center text-[#E40032] mb-3">
              <ShoppingCart className="w-8 h-8" strokeWidth={1.8} />
            </div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A]">Your cart is empty</h2>
            <p className="text-[12px] text-[#666666] mt-1 max-w-[240px]">
              Add items below to enjoy Delivery from &#36;200 or Click &amp; Collect from &#36;50.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate('home')}
                className="h-[38px] px-5 rounded-[8px] bg-[#E40032] text-white text-[13px] font-bold"
              >
                Start Shopping
              </button>
              <button
                type="button"
                onClick={resetDemoCart}
                className="h-[38px] px-4 rounded-[8px] border border-[#E0E0E0] text-[#3D3D3D] text-[13px] font-semibold"
              >
                Restore Demo
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Main Fulfillment Cart Card (Figma 8585:131777) — per-basket sticky header */}
            {mainItems.length > 0 && (
              <section ref={mainBasketRef} className="bg-white rounded-[12px] px-[12px] pb-[12px]">
                <div className="sticky top-[48px] z-20 bg-white pt-[12px] pb-[12px] border-b border-[#E0E0E0] space-y-[12px] rounded-t-[12px]">
                  <div className="flex items-center justify-between gap-[4px]">
                    <button
                      type="button"
                      onClick={openFulfillmentSheet}
                      className="inline-flex items-center gap-[2px] text-[16px] leading-[24px] font-bold text-[#1A1A1A]"
                      style={t.isMpOpt1 ? { fontFamily: t.headingFont, color: t.headingColor } : undefined}
                    >
                      <span>{isDelivery ? 'Home Delivery' : 'Click & Collect'}</span>
                      {t.isMp ? (
                        <ChevronRight className="w-[16px] h-[16px]" style={{ color: t.primary }} />
                      ) : (
                        <img src={ICONS.chevronRightRed} alt="" className="w-[16px] h-[16px] object-contain" />
                      )}
                    </button>
                    <div className="inline-flex items-center gap-[2px] shrink-0">
                      <span className="px-[4px] py-[2px] rounded-[4px] bg-[#F7F7F7] text-[10px] leading-[14px] text-[#3D3D3D] font-normal">
                        Earliest
                      </span>
                      <span className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                        {mainPricing.earliestDateLabel}
                      </span>
                    </div>
                  </div>

                  {/* Extra Lead Time Banner (Figma 8585:131788) -> opens 6514:77679 drawer */}
                  {mainPricing.hasExtraLeadTimeSelected && (
                    <button
                      type="button"
                      onClick={() => setLeadTimeDrawerOpen(true)}
                      className="w-full h-[32px] bg-[#FFF5CC] rounded-[8px] px-[12px] py-[4px] flex items-center justify-between gap-[4px] text-left active:opacity-90"
                    >
                      <span className="inline-flex items-center gap-[4px] text-[12px] leading-[16px] text-[#3D3D3D] min-w-0">
                        <img src={ICONS.timeOutline} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
                        <span className="truncate">
                          Get it by <strong className="font-bold">12 Jun</strong> without case items
                        </span>
                      </span>
                      <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
                    </button>
                  )}
                </div>

                <div>{mainItems.map(renderCartRow)}</div>
              </section>
            )}

            {/* Configurable Redeem Module (honoring sticky note 8025:103687) */}
            {redeemVisible && (
              <section className="bg-white rounded-[12px] p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-[#1A1A1A]">
                    Redeem with &#36;49.9 Spend
                  </h3>
                  <button
                    type="button"
                    onClick={() => setRedeemVisible(false)}
                    aria-label="Hide redeem module"
                    className="text-[#858585] p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    PRODUCTS.find((p) => p.id === 'flash-apple')!,
                    PRODUCTS.find((p) => p.id === 'redeem-oil')!,
                  ].map((p) => (
                    <div
                      key={p.id}
                      className="rounded-[8px] border border-[#EFEFEF] p-2 flex items-center gap-2"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-contain shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col items-start">
                        {p.originalPrice && (
                          <span className="text-[11px] leading-[14px] text-[#858585] line-through">
                            &#36;{p.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <PriceBlock price={p.price} size="xs" />
                      </div>
                      <ProductAddControl productId={p.id} size="sm" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Unavailable items (Figma 8585:131831) */}
            <section className="bg-white rounded-[12px] p-[12px]">
              <h3 className="text-[14px] leading-[20px] font-bold text-[#1A1A1A] mb-[12px]">
                Unavailable items
              </h3>
              <div className="flex items-center gap-[8px]">
                <div className="relative w-[76px] h-[76px] rounded-[4px] bg-[#F7F7F7] flex items-center justify-center shrink-0 overflow-hidden opacity-80">
                  <img src={ASSETS.fujiApple} alt="" className="w-[64px] h-[64px] object-contain" />
                  <span className="absolute inset-x-1 bottom-1 bg-black/65 text-white text-[9px] text-center py-[1px] rounded-full">
                    Out of stock
                  </span>
                </div>
                <div className="flex-1 min-w-0 bg-[#F7F7F7] rounded-[8px] p-[8px]">
                  <div className="flex items-center justify-between text-[12px] leading-[16px] text-[#3D3D3D] mb-[8px]">
                    <span className="font-medium">Related Products</span>
                    <img src={ICONS.chevronRight} alt="" className="w-[16px] h-[16px] object-contain" />
                  </div>
                  <div className="flex items-center gap-[8px]">
                    {['jumbo-blueberry', 'zespri-kiwi', 'fuji-apple'].map((id) => {
                      const prod = PRODUCTS.find((p) => p.id === id)!;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => navigate('pdp', id)}
                          className="w-[56px] h-[56px] rounded-[6px] bg-white p-1 flex items-center justify-center shrink-0"
                        >
                          <img src={prod.image} alt="" className="w-full h-full object-contain" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Promo code (Figma 4119:170794 & 4119:170800) */}
            <section className="bg-white rounded-[12px] p-[12px]">
              <div className="flex items-center justify-between mb-[8px]">
                <h3 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">Promo code</h3>
              </div>
              <div className="h-[40px] rounded-[8px] bg-white border border-[#E0E0E0] px-[12px] flex items-center justify-between gap-[8px] focus-within:border-[#E40032]">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter payment promo code"
                  className="flex-1 min-w-0 text-[12px] leading-[16px] text-[#1A1A1A] placeholder:text-[#666666] bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (applyPromoCode(promoInput || 'WELLCOME10')) setPromoInput('');
                  }}
                  className={`text-[12px] leading-[16px] font-medium shrink-0 transition-colors ${
                    promoInput.trim() ? 'text-[#E40032]' : 'text-[#C4C4C4]'
                  }`}
                >
                  Apply
                </button>
              </div>
              {appliedPromoCode && (
                <p className="text-[11px] text-[#2C8232] font-semibold mt-1.5">
                  ✓ {appliedPromoCode} applied (-&#36;{promoCodeDiscount.toFixed(2)})
                </p>
              )}
            </section>

            {/* Pre-order section (Figma 7939:425539) — per-basket sticky header */}
            {preorderItems.length > 0 && (
              <section ref={preorderBasketRef} className="bg-white rounded-[12px] px-[12px] pb-[12px]">
                <div className="sticky top-[48px] z-20 bg-white pt-[12px] pb-[12px] flex items-center justify-between border-b border-[#E0E0E0] rounded-t-[12px]">
                  <span className="inline-flex items-center gap-[2px] text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                    <span>Pre-order</span>
                    {t.isMp ? (
                      <ChevronRight className="w-[16px] h-[16px]" style={{ color: t.primary }} />
                    ) : (
                      <img src={ICONS.chevronRightRed} alt="" className="w-[16px] h-[16px] object-contain" />
                    )}
                  </span>
                  <div className="inline-flex items-center gap-[2px] shrink-0">
                    <span className="px-[4px] py-[2px] rounded-[4px] bg-[#F7F7F7] text-[10px] leading-[14px] text-[#3D3D3D] font-normal">
                      Earliest
                    </span>
                    <span className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                      15 Jun 18:00
                    </span>
                  </div>
                </div>
                {preorderItems.map(renderCartRow)}
              </section>
            )}
          </>
        )}

        {/* You May Like / Your Usuals Waterfall */}
        <section className="pt-1">
          <div className="grid grid-cols-2 border-b border-[#EAEAEA] mb-2.5">
            <button
              type="button"
              onClick={() => setRecTab('like')}
              className={`py-2 text-[14px] border-b-2 transition-colors ${
                recTab === 'like'
                  ? 'border-[#E40032] text-[#E40032] font-bold'
                  : 'border-transparent text-[#666666] font-medium'
              }`}
            >
              You May Like
            </button>
            <button
              type="button"
              onClick={() => setRecTab('usuals')}
              className={`py-2 text-[14px] border-b-2 transition-colors ${
                recTab === 'usuals'
                  ? 'border-[#E40032] text-[#E40032] font-bold'
                  : 'border-transparent text-[#666666] font-medium'
              }`}
            >
              Your Usuals
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {recProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Checkout Bar — contextual to active basket in viewport, slides out when scrolled past all baskets */}
      <footer
        className={`app-fixed-bar bottom-0 z-30 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] transition-transform duration-200 ${
          activeBasket === null && !isEditMode
            ? 'translate-y-full pointer-events-none'
            : 'translate-y-0'
        }`}
      >
        {activeBasket === 'preorder' ? (
          <div className="bg-[#FFF6F5] px-[12px] py-[8px] flex items-center justify-between text-[12px] leading-[16px] text-[#3D3D3D] border-b border-[#F2E4E6]">
            <span className="font-semibold text-[#1A1A1A]">Pre-order Basket</span>
            <span className="text-[#666666]">Earliest 15 Jun 18:00</span>
          </div>
        ) : (
          <ThresholdProgressBar
            variant="compact"
            onClick={() => navigate('smart-tips')}
          />
        )}

        {isEditMode ? (
          <div className="px-[12px] pt-[12px] pb-[max(14px,env(safe-area-inset-bottom))] flex items-center justify-between">
            <button
              type="button"
              onClick={handleToggleBasketAll}
              className="inline-flex items-center gap-[4px] text-[14px] leading-[20px] text-[#3D3D3D]"
            >
              <img
                src={allSelected ? ICONS.radioChecked : ICONS.radioBlank}
                alt=""
                className="w-[24px] h-[24px] object-contain"
              />
              <span>All</span>
            </button>
            <button
              type="button"
              disabled={pricing.selectedCount === 0}
              onClick={() => {
                removeSelectedItems();
                setIsEditMode(false);
              }}
              className="h-[40px] px-7 rounded-[8px] bg-[#E40032] text-white text-[14px] font-bold disabled:opacity-40"
            >
              Delete ({pricing.selectedCount})
            </button>
          </div>
        ) : (
          <div className="px-[12px] pt-[10px] pb-[max(14px,env(safe-area-inset-bottom))] space-y-[10px]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleToggleBasketAll}
                className="inline-flex items-center gap-[4px] text-[14px] leading-[20px] text-[#3D3D3D]"
              >
                {allSelected && t.isMp ? (
                  <span
                    className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: t.primary }}
                  >
                    <Check className="w-[12px] h-[12px]" strokeWidth={3} />
                  </span>
                ) : (
                  <img
                    src={allSelected ? ICONS.radioChecked : ICONS.radioBlank}
                    alt=""
                    className="w-[24px] h-[24px] object-contain"
                  />
                )}
                <span>All</span>
              </button>

              <button
                type="button"
                onClick={() => setBreakdownOpen(true)}
                className="text-right"
              >
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">Total:</span>
                  <PriceBlock
                    price={pricing.finalTotal}
                    savedText={
                      pricing.totalSaved > 0
                        ? `Saved: $${pricing.totalSaved.toFixed(2)}`
                        : undefined
                    }
                    size="md"
                  />
                  <img src={ICONS.chevronDown} alt="" className="w-[16px] h-[16px] object-contain" />
                </div>
                {pricing.subtotalAfterPromo > 0 && (
                  <p className="text-[11px] text-[#666666]">
                    {pricing.hasFreeDelivery
                      ? `Free ${isDelivery ? 'Delivery' : 'Pick-up'} saved $${pricing.freeDeliverySaved}`
                      : `Includes ${isDelivery ? 'delivery' : 'pick-up'} fee $${pricing.deliveryFee}`}
                  </p>
                )}
              </button>
            </div>

            <button
              type="button"
              disabled={pricing.totalUnits === 0}
              onClick={handleCheckoutPress}
              className="w-full h-[46px] rounded-[10px] bg-[#E40032] text-white text-[15px] font-bold active:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {activeBasket === 'preorder'
                ? `Check out Pre-order (${pricing.totalUnits})`
                : `Check out (${pricing.totalUnits})`}
            </button>
          </div>
        )}
      </footer>

      {/* Drawer 1: Extra lead time items (Figma 6514:77679) */}
      <BottomSheetDrawer
        open={leadTimeDrawerOpen}
        onClose={() => setLeadTimeDrawerOpen(false)}
        title="Extra lead time items"
        footer={
          <button
            type="button"
            onClick={() => {
              deselectExtraLeadTimeItems();
              setLeadTimeDrawerOpen(false);
            }}
            className="w-full h-[46px] rounded-[10px] bg-[#E40032] text-white text-[15px] font-bold"
          >
            Get Earlier Delivery
          </button>
        }
      >
        <div className="p-4 space-y-3">
          <p className="text-[13px] text-[#3D3D3D] leading-[19px]">
            Deselect the following items, and the delivery time can be advanced to{' '}
            <strong>12 Jun</strong>.
          </p>
          {extraLeadTimeItems.map((item) => {
            const meta = getEffectiveItemMeta(item.productId, item.variantId);
            return (
              <div
                key={item.key}
                className="flex items-center gap-3 py-2 border-b border-[#F2F2F2] last:border-b-0"
              >
                <img
                  src={meta.image}
                  alt={meta.title}
                  className="w-14 h-14 rounded-[8px] object-contain border border-[#F0F0F0] p-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1A1A1A] line-clamp-2">
                    {meta.title}
                  </p>
                  <div className="mt-1">
                    <PromoTag label="Extra lead time" variant="leadtime" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <PriceBlock price={meta.price} size="sm" />
                    <span className="text-[12px] text-[#666666]">Qty: {item.qty}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BottomSheetDrawer>

      {/* Drawer 2: Price Breakdown (Figma 1844:160847) */}
      <BottomSheetDrawer
        open={breakdownOpen}
        onClose={() => setBreakdownOpen(false)}
        title="Price Breakdown"
      >
        <div className="p-4 space-y-3 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[#3D3D3D]">
              Items Subtotal <Info className="w-3.5 h-3.5 text-[#858585]" />
            </span>
            <span className="font-semibold text-[#1A1A1A]">
              &#36;{pricing.rawSubtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[#3D3D3D]">
              {isDelivery ? 'Delivery Fee' : 'Pick-up Fee'}{' '}
              <Info className="w-3.5 h-3.5 text-[#858585]" />
            </span>
            <span className="font-semibold text-[#1A1A1A]">
              {pricing.deliveryFee === 0 ? 'FREE' : `$${pricing.deliveryFee.toFixed(2)}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[#3D3D3D]">
              Packaging Handling Fee <Info className="w-3.5 h-3.5 text-[#858585]" />
            </span>
            <span className="font-semibold text-[#1A1A1A]">
              &#36;{pricing.packagingFee.toFixed(2)}
            </span>
          </div>

          {pricing.promoDiscount > 0 && (
            <div className="flex items-center justify-between text-[#E40032]">
              <span>Promotion Savings</span>
              <span className="font-semibold">-&#36;{pricing.promoDiscount.toFixed(2)}</span>
            </div>
          )}

          {pricing.tier12Discount > 0 && (
            <div className="flex items-center justify-between text-[#E40032]">
              <span>12% Order Reward ($800+)</span>
              <span className="font-semibold">-&#36;{pricing.tier12Discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
            <span className="inline-flex items-center gap-1.5 text-[#1A1A1A] font-medium">
              <Ticket className="w-4 h-4 text-[#E40032]" />
              Coupon
            </span>
            <span className="font-semibold text-[#E40032]">
              -&#36;{pricing.couponDiscount.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-[#EAEAEA] text-[16px] font-bold text-[#1A1A1A]">
            <span>Total</span>
            <span>&#36;{pricing.finalTotal.toFixed(2)}</span>
          </div>

          <div className="pt-3 border-t border-[#F0F0F0] space-y-2">
            <p className="text-[12px] text-[#666666] font-medium">Estimated reward</p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[#1A1A1A]">
                <img src={ASSETS.yuuCoin} alt="yuu" className="w-4 h-4 object-contain" />
                yuu Points
              </span>
              <span className="font-semibold text-[#1A1A1A]">+{pricing.yuuPoints}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[#1A1A1A]">
                <BadgePercent className="w-4 h-4 text-[#E40032]" />
                Tourister CLEVA Collection Stamps
              </span>
              <span className="font-semibold text-[#1A1A1A]">+{pricing.stamps}</span>
            </div>
          </div>
        </div>
      </BottomSheetDrawer>

      {/* Drawer 3: Minimum Order Warning */}
      <BottomSheetDrawer
        open={minOrderWarnOpen}
        onClose={() => setMinOrderWarnOpen(false)}
        title="Minimum Order Not Reached"
        footer={
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setMinOrderWarnOpen(false);
                navigate('smart-tips');
              }}
              className="w-full h-[44px] rounded-[10px] bg-[#E40032] text-white text-[14px] font-bold"
            >
              Add more items (Smart Tips)
            </button>
            {isDelivery && (
              <button
                type="button"
                onClick={() => {
                  setMinOrderWarnOpen(false);
                  openFulfillmentSheet();
                }}
                className="w-full h-[40px] rounded-[10px] bg-[#FFF0F2] text-[#E40032] text-[13px] font-bold"
              >
                Or switch to Click &amp; Collect (&#36;50 min)
              </button>
            )}
          </div>
        }
      >
        <div className="p-4 text-[13px] text-[#3D3D3D] leading-[20px]">
          Your order is not enough. Please add more items to your cart to reach the minimum
          subtotal of <strong>&#36;{pricing.config.minOrder}</strong>.
        </div>
      </BottomSheetDrawer>

      {/* Drawer 4: Mock Checkout Confirmation & Payment Success */}
      <BottomSheetDrawer
        open={checkoutDrawerOpen}
        onClose={() => setCheckoutDrawerOpen(false)}
        title={confirmedOrder ? 'Order Confirmed' : 'Confirm Checkout'}
        footer={
          confirmedOrder ? (
            <button
              type="button"
              onClick={() => {
                setCheckoutDrawerOpen(false);
                navigate('home');
              }}
              className="w-full h-[46px] rounded-[10px] bg-[#E40032] text-white text-[15px] font-bold"
            >
              Continue Shopping
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmPay}
              className="w-full h-[46px] rounded-[10px] bg-[#E40032] text-white text-[15px] font-bold"
            >
              Confirm &amp; Pay &#36;{pricing.finalTotal.toFixed(2)}
            </button>
          )
        }
      >
        {confirmedOrder ? (
          <div className="p-6 flex flex-col items-center text-center space-y-2.5">
            <CheckCircle2 className="w-14 h-14 text-[#2C8232]" strokeWidth={1.8} />
            <h3 className="text-[18px] font-bold text-[#1A1A1A]">Payment Successful!</h3>
            <p className="text-[12px] text-[#666666]">
              Order #{confirmedOrder.id} · {confirmedOrder.createdAt}
            </p>
            <div className="w-full bg-[#F7F7F7] rounded-[12px] p-3.5 text-left text-[12px] space-y-1.5 mt-2">
              <div className="flex justify-between">
                <span className="text-[#666666]">Method</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {confirmedOrder.fulfillmentMode === 'delivery'
                    ? 'Home Delivery'
                    : 'Click & Collect'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Destination</span>
                <span className="font-semibold text-[#1A1A1A]">{confirmedOrder.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Items</span>
                <span className="font-semibold text-[#1A1A1A]">{confirmedOrder.itemCount}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#E5E5E5] text-[14px] font-bold">
                <span>Paid</span>
                <span className="text-[#E40032]">&#36;{confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3 text-[13px]">
            <div className="bg-[#F7F7F7] rounded-[10px] p-3 space-y-1">
              <p className="text-[11px] font-semibold text-[#858585] uppercase">
                {isDelivery ? 'Home Delivery' : 'Click & Collect'}
              </p>
              <p className="font-bold text-[#1A1A1A]">
                {isDelivery ? currentAddr.title : currentStore.name}
              </p>
              <p className="text-[12px] text-[#666666]">
                Earliest slot: {pricing.earliestDateLabel}
              </p>
            </div>

            <div className="bg-[#F7F7F7] rounded-[10px] p-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-medium text-[#1A1A1A]">
                <CreditCard className="w-4 h-4 text-[#2C8232]" />
                Hang Seng enJoy Visa •••• 8829
              </span>
              <span className="text-[11px] text-[#2C8232] font-semibold">Default</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[#666666]">
                <span>Selected Items ({pricing.totalUnits})</span>
                <span>&#36;{pricing.subtotalAfterPromo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>{isDelivery ? 'Delivery Fee' : 'Pick-up Fee'}</span>
                <span>
                  {pricing.deliveryFee === 0 ? 'FREE' : `$${pricing.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {pricing.totalSaved > 0 && (
                <div className="flex justify-between text-[#E40032]">
                  <span>Total Savings</span>
                  <span>-&#36;{pricing.totalSaved.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#EAEAEA] text-[16px] font-bold text-[#1A1A1A]">
                <span>Total to Pay</span>
                <span className="text-[#E40032]">&#36;{pricing.finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </BottomSheetDrawer>
    </div>
  );
};
