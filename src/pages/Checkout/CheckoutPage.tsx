import React, { useMemo, useState } from 'react';
import {
  DELIVERY_ADDRESSES,
  PICKUP_STORES,
  getEffectiveItemMeta,
} from '../../data/catalog';
import { computePricingSummary, useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';
import {
  CHECKOUT_ASSETS,
  CHECKOUT_CASH_VOUCHERS,
  CHECKOUT_COUPONS,
  CHECKOUT_VOUCHERS,
  OUT_OF_STOCK_OPTIONS,
  PAYMENT_METHODS,
  WORRY_FREE_GUARANTEES,
  type DiscountChoice,
  type PaymentMethodOption,
} from './checkoutAssets';
import {
  DiscountPickerDrawer,
  OrderItemsDrawer,
  OutOfStockDrawer,
  PaymentMethodDrawer,
  RemarksDrawer,
  TimeSlotDrawer,
} from './CheckoutDrawers';

export const CheckoutPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const selectedAddressId = useAppStore((s) => s.selectedAddressId);
  const selectedStoreId = useAppStore((s) => s.selectedStoreId);
  const openFulfillmentSheet = useAppStore((s) => s.openFulfillmentSheet);
  const cartItems = useAppStore((s) => s.cartItems);
  const promoCodeDiscount = useAppStore((s) => s.promoCodeDiscount);
  const applyPromoCode = useAppStore((s) => s.applyPromoCode);
  const submitMockOrder = useAppStore((s) => s.submitMockOrder);
  const showToast = useAppStore((s) => s.showToast);
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);
  const isMpOpt1 = t.isMpOpt1;

  const isDelivery = fulfillmentMode === 'delivery';
  const currentAddr =
    DELIVERY_ADDRESSES.find((a) => a.id === selectedAddressId) ?? DELIVERY_ADDRESSES[0];
  const currentStore =
    PICKUP_STORES.find((s) => s.id === selectedStoreId) ?? PICKUP_STORES[0];

  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.selected && item.qty > 0),
    [cartItems]
  );

  const pricing = computePricingSummary(cartItems, fulfillmentMode, promoCodeDiscount);

  // Delivery/Pick-up time slot state
  const [slotMode, setSlotMode] = useState<'recommended' | 'custom'>('recommended');
  const [customDateId, setCustomDateId] = useState('tue-10');
  const [customSlotId, setCustomSlotId] = useState('slot-2');
  const [customSlotLabel, setCustomSlotLabel] = useState<string | null>(null);

  // Payment method & payment promo code state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>(PAYMENT_METHODS[0]);
  const [paymentPromoInput, setPaymentPromoInput] = useState('');

  // Discount rows state (matching Figma Coupon -$10, Voucher -$10, Cash Voucher choose, Payment discount -$40)
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountChoice>(CHECKOUT_COUPONS[0]);
  const [selectedVoucher, setSelectedVoucher] = useState<DiscountChoice>(CHECKOUT_VOUCHERS[0]);
  const [selectedCashVoucher, setSelectedCashVoucher] = useState<DiscountChoice>(
    CHECKOUT_CASH_VOUCHERS[0]
  );

  // Remarks & Out of Stock state
  const [allowPhone, setAllowPhone] = useState(true);
  const [allowKnock, setAllowKnock] = useState(true);
  const [remarksNote, setRemarksNote] = useState('');
  const [outOfStockId, setOutOfStockId] = useState('replace');

  // Drawer open flags
  const [timeDrawerOpen, setTimeDrawerOpen] = useState(false);
  const [itemsDrawerOpen, setItemsDrawerOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [remarksDrawerOpen, setRemarksDrawerOpen] = useState(false);
  const [outOfStockDrawerOpen, setOutOfStockDrawerOpen] = useState(false);
  const [discountDrawerKind, setDiscountDrawerKind] = useState<
    null | 'coupon' | 'voucher' | 'cash'
  >(null);

  const recommendedLabel = 'Today 18:00-21:00';
  const activeDeliverySlot =
    slotMode === 'custom' && customSlotLabel ? customSlotLabel : recommendedLabel;

  const couponAmount = pricing.couponDiscount > 0 ? pricing.couponDiscount : selectedCoupon.amount;
  const voucherAmount = selectedVoucher.amount;
  const cashVoucherAmount = selectedCashVoucher.amount;
  const paymentDiscountAmount = paymentMethod.discountAmount;

  const extraCheckoutDiscount =
    (pricing.couponDiscount > 0 ? 0 : couponAmount) +
    voucherAmount +
    cashVoucherAmount +
    paymentDiscountAmount;

  const payableTotal = Math.max(
    0,
    Number(
      (pricing.finalTotal + pricing.packagingFee - extraCheckoutDiscount).toFixed(2)
    )
  );

  const remarksSummary = useMemo(() => {
    const parts: string[] = [];
    if (allowPhone) parts.push('Allow phone notification');
    if (allowKnock) parts.push('Allow knocking');
    if (remarksNote) parts.push(remarksNote);
    return parts.length > 0 ? parts.join('; ') : 'No special instructions';
  }, [allowPhone, allowKnock, remarksNote]);

  const outOfStockLabel =
    OUT_OF_STOCK_OPTIONS.find((o) => o.id === outOfStockId)?.label ?? 'Suggest replacement';

  const handleApplyPaymentPromo = () => {
    const trimmed = paymentPromoInput.trim();
    if (!trimmed) return;
    applyPromoCode(trimmed);
    setPaymentPromoInput('');
  };

  const handlePay = () => {
    submitMockOrder({
      deliverySlot: activeDeliverySlot,
      paymentMethod: paymentMethod.last4
        ? `${paymentMethod.name} ${paymentMethod.last4}`
        : paymentMethod.name,
      remarks: remarksSummary,
      outOfStockPreference: outOfStockLabel,
      extraDiscount: extraCheckoutDiscount,
    });
    navigate('payment-success');
  };

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[96px]">
      {/* Sticky Top Header (Figma 2329:198483 / 7953:77299) */}
      <header className="sticky top-0 z-30 bg-[#F7F7F7]/95 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
        <div className="h-[48px] flex items-center justify-between px-[16px]">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="w-[32px] h-[32px] flex items-center justify-center shrink-0"
          >
            <img
              src={CHECKOUT_ASSETS.chevronLeft}
              alt=""
              className="w-[32px] h-[32px] object-contain"
            />
          </button>
          <h1 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#000000] truncate">
            Checkout
          </h1>
          <div className="w-[32px] h-[32px] shrink-0" />
        </div>
      </header>

      {/* Main Content Stack (WE: gap 8px, px 8px; MP: full-bleed px 0, gap 12px) */}
      <div className="mp-edge-stack px-[8px] pt-[4px] flex flex-col gap-[8px]">
        {/* 1. Deliver & Recipient Card (2329:198217 / 7953:77019) */}
        <section
          onClick={openFulfillmentSheet}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openFulfillmentSheet();
          }}
          className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[12px] text-left cursor-pointer active:bg-[#FAFAFA] transition-colors"
        >
          {/* Fulfillment Tag Pill */}
          <div className="bg-[#F7F7F7] rounded-[4px] px-[8px] py-[4px] inline-flex items-center gap-[4px] self-start">
            {t.isMp ? (
              <span
                aria-hidden="true"
                className="block w-[16px] h-[16px] shrink-0"
                style={{
                  backgroundColor: t.primary,
                  WebkitMaskImage: `url(${isDelivery ? CHECKOUT_ASSETS.truckOutline : CHECKOUT_ASSETS.cncBagOutline})`,
                  maskImage: `url(${isDelivery ? CHECKOUT_ASSETS.truckOutline : CHECKOUT_ASSETS.cncBagOutline})`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            ) : (
              <img
                src={isDelivery ? CHECKOUT_ASSETS.truckOutline : CHECKOUT_ASSETS.cncBagOutline}
                alt=""
                className="w-[16px] h-[16px] shrink-0"
              />
            )}
            <span className="text-[12px] leading-[16px] font-normal text-[#1A1A1A]">
              {isDelivery ? 'Home Delivery' : 'Click & collect'}
            </span>
          </div>

          {/* Address or Pickup Store */}
          {isDelivery ? (
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-[6px] min-w-0">
                <span className="h-[16px] px-[4px] rounded-[4px] border border-[#E40032] bg-white text-[10px] leading-[14px] text-[#E40032] inline-flex items-center justify-center shrink-0">
                  {currentAddr.tag || 'Home'}
                </span>
                <p
                  className="text-[16px] leading-[24px] font-bold text-[#1A1A1A] truncate"
                  style={isMpOpt1 ? { fontFamily: t.headingFont } : undefined}
                >
                  {currentAddr.title}
                </p>
              </div>
              <p className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                {currentAddr.address}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[4px]">
              <p className="text-[16px] leading-[24px] font-bold text-[#1A1A1A] uppercase">
                {currentStore.name}
              </p>
              <p className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                {currentStore.address}
              </p>
            </div>
          )}

          {/* Recipient Details Row */}
          <div className="flex items-center justify-between gap-[16px] h-[16px]">
            <div className="flex items-center gap-[16px] text-[12px] leading-[16px] text-[#666666]">
              <span>{currentAddr.recipient}</span>
              <span>{currentAddr.phone}</span>
            </div>
            <img
              src={CHECKOUT_ASSETS.chevronRightMuted}
              alt=""
              className="w-[16px] h-[16px] shrink-0"
            />
          </div>
        </section>

        {/* 2. Delivery / Pick-up Time + Order Items Preview Card (2329:198230 / 7953:77032) */}
        <section className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[12px]">
          {/* Time Selection */}
          <div className="border-b border-[#E0E0E0] pb-[12px] flex flex-col gap-[8px]">
            <p className="text-[14px] leading-[20px] font-normal text-[#3D3D3D]">
              {isDelivery ? 'Deliver time:' : 'Pick-up time:'}
            </p>
            <div className="grid grid-cols-2 gap-[8px]">
              {/* Recommended Option */}
              <button
                type="button"
                onClick={() => setSlotMode('recommended')}
                className={`rounded-[8px] p-[8px] flex flex-col gap-[4px] text-left border transition-colors ${
                  slotMode === 'recommended'
                    ? 'bg-[#FFF6F5] border-[#E40032]'
                    : 'bg-white border-[#E0E0E0]'
                }`}
              >
                <span className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                  Recommended
                </span>
                <span className="text-[15px] leading-[22px] font-bold text-[#1A1A1A]">
                  {recommendedLabel}
                </span>
              </button>

              {/* More Options -> TimeSlotDrawer */}
              <button
                type="button"
                onClick={() => setTimeDrawerOpen(true)}
                className={`rounded-[8px] p-[8px] flex flex-col gap-[4px] text-left border transition-colors ${
                  slotMode === 'custom' && customSlotLabel
                    ? 'bg-[#FFF6F5] border-[#E40032]'
                    : 'bg-white border-[#E0E0E0]'
                }`}
              >
                <div className="flex items-center justify-between gap-[4px] w-full">
                  <span className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                    More Options
                  </span>
                  <img
                    src={CHECKOUT_ASSETS.chevronRightMuted}
                    alt=""
                    className="w-[16px] h-[16px] shrink-0"
                  />
                </div>
                <span
                  className={`font-bold truncate w-full ${
                    slotMode === 'custom' && customSlotLabel
                      ? 'text-[13px] leading-[22px] text-[#1A1A1A]'
                      : 'text-[15px] leading-[22px] text-[#858585]'
                  }`}
                >
                  {slotMode === 'custom' && customSlotLabel
                    ? customSlotLabel
                    : 'Please select'}
                </span>
              </button>
            </div>
          </div>

          {/* Item Thumbnails Preview Row (2329:198239) */}
          <button
            type="button"
            onClick={() => setItemsDrawerOpen(true)}
            className="w-full flex items-center text-left relative"
          >
            <div className="flex-1 flex items-center gap-[8px] overflow-hidden pr-[8px]">
              {selectedItems.length > 0 ? (
                selectedItems.slice(0, 5).map((item) => {
                  const meta = getEffectiveItemMeta(item.productId, item.variantId);
                  return (
                    <div
                      key={item.key}
                      className="w-[64px] h-[64px] rounded-[4px] bg-white border border-[#F2F2F2] p-1 flex items-center justify-center shrink-0"
                    >
                      <img
                        src={meta.image}
                        alt={meta.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                })
              ) : (
                <span className="text-[12px] text-[#858585] py-4">No items selected</span>
              )}
            </div>

            {/* Pinned right item count badge with soft edge shadow */}
            <div className="h-[64px] pl-[12px] pr-[2px] flex flex-col items-center justify-center bg-white relative shrink-0 shadow-[-10px_0_12px_-6px_rgba(0,0,0,0.08)]">
              <img
                src={CHECKOUT_ASSETS.viewItemsChevron}
                alt=""
                className="w-[16px] h-[16px] shrink-0"
              />
              <span className="text-[10px] leading-[14px] font-medium text-[#666666] whitespace-nowrap">
                {pricing.totalUnits} {pricing.totalUnits === 1 ? 'item' : 'items'}
              </span>
            </div>
          </button>
        </section>

        {/* 3. Payment Method Card (2329:198315 / 7953:77120) */}
        <section className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[12px]">
          <button
            type="button"
            onClick={() => setPaymentDrawerOpen(true)}
            className="w-full flex items-center justify-between gap-[12px] text-left"
          >
            <div className="flex-1 flex flex-col gap-[8px] min-w-0">
              <span className="text-[14px] leading-[20px] font-normal text-[#3D3D3D]">
                Payment Method:
              </span>
              <div className="flex items-center gap-[8px]">
                {paymentMethod.icon ? (
                  <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                    <img
                      src={paymentMethod.icon}
                      alt={paymentMethod.name}
                      className="w-[20px] h-[20px] object-contain"
                    />
                  </div>
                ) : (
                  <span className="w-[24px] h-[24px] rounded-[4px] bg-[#1A1A1A] text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                    {paymentMethod.badgeText}
                  </span>
                )}
                <div className="flex items-baseline gap-[4px] truncate">
                  <span className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                    {paymentMethod.name}
                  </span>
                  {paymentMethod.last4 && (
                    <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                      {paymentMethod.last4}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <img
              src={CHECKOUT_ASSETS.chevronRightMuted}
              alt=""
              className="w-[16px] h-[16px] shrink-0"
            />
          </button>

          {/* Payment Promo Code Input (2329:198330) */}
          <div className="h-[40px] rounded-[8px] border border-[#E0E0E0] bg-white px-[12px] flex items-center justify-between gap-[8px]">
            <input
              type="text"
              value={paymentPromoInput}
              onChange={(e) => setPaymentPromoInput(e.target.value)}
              placeholder="Enter payment promo code"
              className="flex-1 text-[12px] leading-[16px] text-[#1A1A1A] placeholder:text-[#666666] outline-none bg-transparent"
            />
            <button
              type="button"
              disabled={!paymentPromoInput.trim()}
              onClick={handleApplyPaymentPromo}
              className={`text-[10px] leading-[14px] font-medium shrink-0 transition-colors ${
                paymentPromoInput.trim()
                  ? 'text-[#E40032] font-bold'
                  : 'text-[#C4C4C4]'
              }`}
            >
              Apply
            </button>
          </div>
        </section>

        {/* 4. Order Summary Card (2329:198334 / 7953:77138) */}
        <section className="bg-white rounded-[12px] px-[12px] py-[16px] flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[12px]">
            {/* Items Subtotal */}
            <div className="flex items-center justify-between text-[14px] leading-[20px]">
              <button
                type="button"
                onClick={() =>
                  showToast('Subtotal before delivery fees and vouchers')
                }
                className="inline-flex items-center gap-[2px] text-[#3D3D3D]"
              >
                <span>Items Subtotal</span>
                <img
                  src={CHECKOUT_ASSETS.infoOutlineSm}
                  alt=""
                  className="w-[14px] h-[14px] shrink-0"
                />
              </button>
              <span className="text-[#1A1A1A]">&#36;{pricing.rawSubtotal.toFixed(2)}</span>
            </div>

            {/* Delivery / Pick-up Fee */}
            <div className="flex items-center justify-between text-[14px] leading-[20px]">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    isDelivery
                      ? 'Free Home Delivery on orders $500+'
                      : 'Free Click & Collect on orders $200+'
                  )
                }
                className="inline-flex items-center gap-[2px] text-[#3D3D3D]"
              >
                <span>{isDelivery ? 'Delivery Fee' : 'Pick-up Fee'}</span>
                <img
                  src={CHECKOUT_ASSETS.infoOutlineSm}
                  alt=""
                  className="w-[14px] h-[14px] shrink-0"
                />
              </button>
              <span
                className={
                  pricing.deliveryFee === 0 ? 'text-[#2C8232] font-semibold' : 'text-[#1A1A1A]'
                }
              >
                {pricing.deliveryFee === 0
                  ? 'FREE'
                  : `$${pricing.deliveryFee.toFixed(2)}`}
              </span>
            </div>

            {/* Packaging Handling Fee */}
            <div className="flex items-center justify-between text-[14px] leading-[20px]">
              <button
                type="button"
                onClick={() =>
                  showToast('Standard plastic bag & chilled packaging handling fee')
                }
                className="inline-flex items-center gap-[2px] text-[#3D3D3D]"
              >
                <span>Packaging Handling Fee</span>
                <img
                  src={CHECKOUT_ASSETS.infoOutlineSm}
                  alt=""
                  className="w-[14px] h-[14px] shrink-0"
                />
              </button>
              <span className="text-[#1A1A1A]">
                &#36;{pricing.packagingFee.toFixed(2)}
              </span>
            </div>

            {/* Auto-applied Cart Promotion Savings (if any) */}
            {pricing.promoDiscount > 0 && (
              <div className="flex items-center justify-between text-[14px] leading-[20px]">
                <span className="text-[#3D3D3D]">Promotion Savings</span>
                <span className="text-[#E40032]">
                  -&#36;{pricing.promoDiscount.toFixed(2)}
                </span>
              </div>
            )}

            {pricing.tier12Discount > 0 && (
              <div className="flex items-center justify-between text-[14px] leading-[20px]">
                <span className="text-[#3D3D3D]">12% Order Reward ($800+)</span>
                <span className="text-[#E40032]">
                  -&#36;{pricing.tier12Discount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="h-[1px] bg-[#EFEFEF] w-full" />

            {/* Coupon Row */}
            <button
              type="button"
              onClick={() => setDiscountDrawerKind('coupon')}
              className="w-full flex items-center justify-between text-[14px] leading-[20px]"
            >
              <span className="inline-flex items-center gap-[8px] text-[#3D3D3D]">
                <img
                  src={CHECKOUT_ASSETS.couponIcon}
                  alt=""
                  className="w-[24px] h-[24px] shrink-0"
                />
                <span>Coupon</span>
              </span>
              <span className="inline-flex items-center gap-[4px]">
                {couponAmount > 0 ? (
                  <span className="text-[#E40032]">-&#36;{couponAmount.toFixed(2)}</span>
                ) : (
                  <span className="text-[#858585]">choose</span>
                )}
                <img
                  src={CHECKOUT_ASSETS.chevronRightMuted}
                  alt=""
                  className="w-[16px] h-[16px] shrink-0"
                />
              </span>
            </button>

            {/* Voucher Row */}
            <button
              type="button"
              onClick={() => setDiscountDrawerKind('voucher')}
              className="w-full flex items-center justify-between text-[14px] leading-[20px]"
            >
              <span className="inline-flex items-center gap-[8px] text-[#3D3D3D]">
                <img
                  src={CHECKOUT_ASSETS.voucherIcon}
                  alt=""
                  className="w-[24px] h-[24px] shrink-0"
                />
                <span>Voucher</span>
              </span>
              <span className="inline-flex items-center gap-[4px]">
                {voucherAmount > 0 ? (
                  <span className="text-[#E40032]">-&#36;{voucherAmount.toFixed(2)}</span>
                ) : (
                  <span className="text-[#858585]">choose</span>
                )}
                <img
                  src={CHECKOUT_ASSETS.chevronRightMuted}
                  alt=""
                  className="w-[16px] h-[16px] shrink-0"
                />
              </span>
            </button>

            {/* Cash Voucher Row (yuu) */}
            <button
              type="button"
              onClick={() => setDiscountDrawerKind('cash')}
              className="w-full flex items-center justify-between text-[14px] leading-[20px]"
            >
              <span className="inline-flex items-center gap-[8px] text-[#3D3D3D]">
                <span className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                  <img
                    src={CHECKOUT_ASSETS.yuuInnerLine}
                    alt="yuu"
                    className="w-[20px] h-[14px] object-contain"
                  />
                </span>
                <span>Cash Voucher</span>
              </span>
              <span className="inline-flex items-center gap-[4px]">
                {cashVoucherAmount > 0 ? (
                  <span className="text-[#E40032]">
                    -&#36;{cashVoucherAmount.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[#858585]">choose</span>
                )}
                <img
                  src={CHECKOUT_ASSETS.chevronRightMuted}
                  alt=""
                  className="w-[16px] h-[16px] shrink-0"
                />
              </span>
            </button>

            {/* Payment Discount Row */}
            <button
              type="button"
              onClick={() => setPaymentDrawerOpen(true)}
              className="w-full flex items-center justify-between text-[14px] leading-[20px]"
            >
              <span className="inline-flex items-center gap-[8px] text-[#3D3D3D]">
                <img
                  src={CHECKOUT_ASSETS.paymentDiscountIcon}
                  alt=""
                  className="w-[24px] h-[24px] shrink-0"
                />
                <span>Payment discount</span>
              </span>
              <span className="inline-flex items-center gap-[4px]">
                {paymentDiscountAmount > 0 ? (
                  <span className="text-[#E40032]">
                    -&#36;{paymentDiscountAmount.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[#858585]">choose</span>
                )}
                <img
                  src={CHECKOUT_ASSETS.chevronRightMuted}
                  alt=""
                  className="w-[16px] h-[16px] shrink-0"
                />
              </span>
            </button>

            {/* Divider */}
            <div className="h-[1px] bg-[#EFEFEF] w-full" />
          </div>

          {/* Total Row */}
          <div
            className="flex items-center justify-end text-[16px] leading-[24px] font-bold text-[#1A1A1A]"
            style={isMpOpt1 ? { fontFamily: t.headingFont } : undefined}
          >
            <span>Total: &#36;{payableTotal.toFixed(2)}</span>
          </div>
        </section>

        {/* 5. Will Be Rewarded Card (2329:198386 / 7953:77201) */}
        <section className="bg-white rounded-[12px] px-[12px] py-[16px] flex flex-col gap-[12px]">
          <p className="text-[14px] leading-[20px] font-normal text-[#3D3D3D]">
            Will Be Rewarded
          </p>
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between gap-[12px]">
              <span className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] text-[#3D3D3D]">
                <span className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                  <img
                    src={CHECKOUT_ASSETS.yuuCoin}
                    alt="yuu"
                    className="w-[20px] h-[20px] object-contain"
                  />
                </span>
                <span>yuu Points</span>
              </span>
              <span className="text-[14px] leading-[20px] text-[#1A1A1A]">
                +{pricing.yuuPoints}
              </span>
            </div>

            <div className="flex items-center justify-between gap-[12px]">
              <span className="inline-flex items-center gap-[8px] text-[14px] leading-[20px] text-[#3D3D3D]">
                <img
                  src={CHECKOUT_ASSETS.stampsIcon}
                  alt=""
                  className="w-[24px] h-[24px] shrink-0"
                />
                <span>Tourister CLEVA Collection Stamps</span>
              </span>
              <span className="text-[14px] leading-[20px] text-[#1A1A1A]">
                +{pricing.stamps}
              </span>
            </div>
          </div>
        </section>

        {/* 6. Remarks Row Card (2329:198415 / 7953:77230) */}
        <button
          type="button"
          onClick={() => setRemarksDrawerOpen(true)}
          className="bg-white rounded-[12px] p-[12px] flex items-center gap-[4px] w-full text-left active:bg-[#FAFAFA]"
        >
          <span className="text-[14px] leading-[20px] font-normal text-[#3D3D3D] shrink-0">
            Remarks
          </span>
          <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#1A1A1A] text-right truncate">
            {remarksSummary}
          </span>
          <img
            src={CHECKOUT_ASSETS.chevronRightDark}
            alt=""
            className="w-[16px] h-[16px] shrink-0"
          />
        </button>

        {/* 7. If Out of Stock Row Card (2329:198433 / 7953:77248) */}
        <button
          type="button"
          onClick={() => setOutOfStockDrawerOpen(true)}
          className="bg-white rounded-[12px] p-[12px] flex items-center gap-[4px] w-full text-left active:bg-[#FAFAFA]"
        >
          <span className="text-[14px] leading-[20px] font-normal text-[#3D3D3D] shrink-0">
            If Out of Stock
          </span>
          <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#1A1A1A] text-right truncate">
            {outOfStockLabel}
          </span>
          <img
            src={CHECKOUT_ASSETS.chevronRightDark}
            alt=""
            className="w-[16px] h-[16px] shrink-0"
          />
        </button>

        {/* 8. Worry-Free Shopping Card (2329:198452 / 7953:77267) */}
        <section className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[12px]">
          <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
            Worry-Free Shopping
          </h2>
          {WORRY_FREE_GUARANTEES.map((item) => (
            <div key={item.title} className="flex items-center gap-[8px]">
                {t.isMp ? (
                  <span
                    aria-hidden="true"
                    className="block w-[24px] h-[24px] shrink-0"
                    style={{
                      backgroundColor: t.primary,
                      WebkitMaskImage: `url(${CHECKOUT_ASSETS.checkGreenOutline})`,
                      maskImage: `url(${CHECKOUT_ASSETS.checkGreenOutline})`,
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                    }}
                  />
                ) : (
                  <img
                    src={CHECKOUT_ASSETS.checkGreenOutline}
                    alt=""
                    className="w-[24px] h-[24px] shrink-0"
                  />
                )}
              <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                <div className="flex items-center gap-[2px]">
                  <span className="text-[14px] leading-[20px] font-semibold text-[#1A1A1A]">
                    {item.title}
                  </span>
                  <img
                    src={CHECKOUT_ASSETS.infoOutlineMd}
                    alt=""
                    className="w-[16px] h-[16px] shrink-0"
                  />
                </div>
                <p className="text-[12px] leading-[16px] font-normal text-[#3D3D3D]">
                  {isMpOpt1
                    ? item.description.replace('Wellcome', 'Market Place')
                    : item.description}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Sticky Footer (Figma 6628:24920 / 7953:77298) */}
      <footer className="app-fixed-bar bottom-0 z-30 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] px-[12px] pt-[12px] pb-[max(14px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={handlePay}
          className="w-full h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] leading-[24px] font-bold active:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Pay &#36;{payableTotal.toFixed(2)}
        </button>
      </footer>

      {/* Interactive Drawers */}
      <TimeSlotDrawer
        open={timeDrawerOpen}
        onClose={() => setTimeDrawerOpen(false)}
        fulfillmentMode={fulfillmentMode}
        selectedDateId={customDateId}
        selectedSlotId={customSlotId}
        onConfirm={(dateId, slotId, label) => {
          setCustomDateId(dateId);
          setCustomSlotId(slotId);
          setCustomSlotLabel(label);
          setSlotMode('custom');
        }}
      />

      <OrderItemsDrawer
        open={itemsDrawerOpen}
        onClose={() => setItemsDrawerOpen(false)}
        items={selectedItems}
      />

      <RemarksDrawer
        open={remarksDrawerOpen}
        onClose={() => setRemarksDrawerOpen(false)}
        allowPhone={allowPhone}
        allowKnock={allowKnock}
        note={remarksNote}
        onConfirm={({ allowPhone: p, allowKnock: k, note: n }) => {
          setAllowPhone(p);
          setAllowKnock(k);
          setRemarksNote(n);
        }}
      />

      <PaymentMethodDrawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        selectedId={paymentMethod.id}
        onSelect={(pm) => setPaymentMethod(pm)}
      />

      <OutOfStockDrawer
        open={outOfStockDrawerOpen}
        onClose={() => setOutOfStockDrawerOpen(false)}
        selectedId={outOfStockId}
        onSelect={(id) => setOutOfStockId(id)}
      />

      <DiscountPickerDrawer
        open={discountDrawerKind === 'coupon'}
        onClose={() => setDiscountDrawerKind(null)}
        title="Select Coupon"
        choices={CHECKOUT_COUPONS}
        selectedId={selectedCoupon.id}
        onSelect={(c) => setSelectedCoupon(c)}
      />

      <DiscountPickerDrawer
        open={discountDrawerKind === 'voucher'}
        onClose={() => setDiscountDrawerKind(null)}
        title="Select Voucher"
        choices={CHECKOUT_VOUCHERS}
        selectedId={selectedVoucher.id}
        onSelect={(c) => setSelectedVoucher(c)}
      />

      <DiscountPickerDrawer
        open={discountDrawerKind === 'cash'}
        onClose={() => setDiscountDrawerKind(null)}
        title="Select yuu Cash Voucher"
        choices={CHECKOUT_CASH_VOUCHERS}
        selectedId={selectedCashVoucher.id}
        onSelect={(c) => setSelectedCashVoucher(c)}
      />
    </div>
  );
};
