import React, { useState } from 'react';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { useAppStore } from '../../store/useAppStore';
import { CHECKOUT_ASSETS } from './checkoutAssets';

const NEXT_ORDER_COUPONS = [
  {
    id: 'next-cp-1',
    amount: '$30',
    condition: 'off on $100',
    title: 'Exclusive coupon',
    subtitle: 'Specific item only',
    status: 'To be unlocked',
  },
  {
    id: 'next-cp-2',
    amount: '$30',
    condition: 'off on $100',
    title: 'Exclusive coupon',
    subtitle: 'Specific item only',
    status: 'To be unlocked',
  },
];

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const orders = useAppStore((s) => s.orders);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);

  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const latestOrder = orders[0];
  const displayTotal = latestOrder ? latestOrder.total.toFixed(2) : '253.00';
  const displaySlot = latestOrder?.deliverySlot ?? 'Sat 6 May, 21:00-22:00';
  const isDelivery = (latestOrder?.fulfillmentMode ?? fulfillmentMode) === 'delivery';

  return (
    <div className="min-h-dvh bg-[#F7F7F7] flex flex-col">
      {/* Top White Section (Figma 2329:178516 -> 6853:253162 + 1891:42828) */}
      <div className="bg-white">
        {/* Top Navigation Bar */}
        <header className="pt-[max(8px,env(safe-area-inset-top))] h-[48px] px-[12px] flex items-center justify-center">
          <h1 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
            Payment result
          </h1>
        </header>

        {/* Main Result Summary */}
        <section className="flex flex-col items-center gap-[24px] pt-[8px] pb-[24px] px-[16px]">
          <div className="w-full max-w-[320px] flex flex-col items-center gap-[16px]">
            {/* Green Check Circle (48x48) */}
            <div className="p-[4px] rounded-full">
              <img
                src={CHECKOUT_ASSETS.successCheckFilled}
                alt="Payment successful"
                className="w-[48px] h-[48px] object-contain"
              />
            </div>

            {/* Thank you & Amount */}
            <div className="flex flex-col items-center gap-[4px] text-[#1A1A1A] font-bold">
              <p className="text-[16px] leading-[24px]">
                Thank you for your purchase
              </p>
              <p className="text-[18px] leading-[28px]">&#36;{displayTotal}</p>
            </div>

            {/* Expected Delivery Date & Time */}
            <div className="w-full border-y border-[#E0E0E0] py-[16px] flex flex-col items-center gap-[8px] text-center">
              <p className="text-[12px] leading-[16px] font-normal text-[#666666]">
                {isDelivery
                  ? 'Expected delivery date & time:'
                  : 'Expected pick-up date & time:'}
              </p>
              <p className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                {displaySlot}
              </p>
            </div>
          </div>

          {/* CTA Buttons (7537:135944) */}
          <div className="flex flex-col items-center gap-[12px]">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="w-[192px] h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] leading-[24px] font-bold px-[20px] active:opacity-90 transition-opacity"
            >
              Continue shopping
            </button>
            <button
              type="button"
              onClick={() => setOrderModalOpen(true)}
              className="w-[192px] h-[48px] rounded-[8px] border border-[#C7C7C7] bg-white text-[#1A1A1A] text-[16px] leading-[24px] font-bold px-[20px] active:bg-[#F7F7F7] transition-colors"
            >
              View Order
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Rewards Section (Figma 8016:98484) */}
      <section className="flex-1 bg-[#F7F7F7] py-[8px] pb-[32px]">
        {/* Module Title (8016:98485) */}
        <div className="px-[24px] py-[12px] flex items-center gap-[8px]">
          <div className="bg-[#E40032] p-[4px] rounded-[8px] flex items-center justify-center shrink-0">
            <img
              src={CHECKOUT_ASSETS.giftOutlineWhite}
              alt=""
              className="w-[24px] h-[24px] object-contain"
            />
          </div>
          <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
            Unlock your exclusive offer for next purchase
          </h2>
        </div>

        {/* Progress Bar + Exclusive Coupon Cards (8016:98492) */}
        <div className="px-[24px] pt-[8px] pb-[12px] flex flex-col gap-[8px]">
          {/* Progress Bar (8016:98493) */}
          <div className="h-[40px] relative w-full">
            {/* White Track */}
            <div className="absolute left-0 right-0 top-[4px] h-[8px] bg-white rounded-full" />
            {/* Red Fill */}
            <div className="absolute left-0 top-[4px] h-[8px] w-[45%] bg-[#E40032] rounded-full" />
            {/* Midpoint Checked Icon */}
            <div className="absolute left-[45%] -translate-x-1/2 top-0 w-[16px] h-[16px]">
              <img
                src={CHECKOUT_ASSETS.progressCheckRed}
                alt=""
                className="w-[16px] h-[16px] object-contain"
              />
            </div>
            {/* Right Endpoint Coupon Badge */}
            <div className="absolute right-0 -top-[2px] w-[20px] h-[20px] rounded-full bg-white border-[0.5px] border-[#E40032] flex items-center justify-center">
              <img
                src={CHECKOUT_ASSETS.progressCouponRed}
                alt=""
                className="w-[12px] h-[12px] object-contain"
              />
            </div>

            {/* Progress Labels */}
            <span className="absolute left-[45%] -translate-x-1/2 top-[20px] text-[10px] leading-[14px] font-medium text-[#3D3D3D] whitespace-nowrap">
              Payment successful
            </span>
            <span className="absolute right-0 top-[20px] text-[10px] leading-[14px] font-medium text-[#3D3D3D] whitespace-nowrap">
              Order Completed
            </span>
          </div>

          {/* Two Notched Exclusive Coupon Cards (8016:98501 & 8016:98519) */}
          {NEXT_ORDER_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className="relative w-full h-[106px] flex items-center"
            >
              {/* Notched Ticket Background SVG (Figma Exclude with shadow bleed inset) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="-rotate-90 w-[106px] h-[345px] relative shrink-0">
                  <div className="absolute inset-[-2.32%_-11.29%_-4.64%_-11.29%]">
                    <img
                      src={CHECKOUT_ASSETS.couponTicketBg}
                      alt=""
                      className="block w-full h-full max-w-none"
                    />
                  </div>
                </div>
              </div>

              {/* Left Value Block */}
              <div className="relative z-10 w-[115px] shrink-0 flex flex-col items-center justify-center text-center px-2">
                <span className="text-[28px] leading-[36px] font-bold text-[#E40032]">
                  {coupon.amount}
                </span>
                <span className="text-[14px] leading-[20px] font-normal text-[#3D3D3D]">
                  {coupon.condition}
                </span>
              </div>

              {/* Dashed Vertical Divider */}
              <div className="relative z-10 h-[86px] w-[1px] border-l border-dashed border-[#E0E0E0] shrink-0" />

              {/* Right Details Block */}
              <div className="relative z-10 flex-1 min-w-0 px-[16px] flex flex-col gap-[4px]">
                <p className="text-[16px] leading-[24px] font-bold text-[#1A1A1A] truncate">
                  {coupon.title}
                </p>
                <p className="text-[12px] leading-[16px] font-normal text-[#3D3D3D] truncate">
                  {coupon.subtitle}
                </p>
              </div>

              {/* Top-right "To be unlocked" Pill */}
              <div className="absolute top-0 right-0 z-10 bg-[#FFFCF4] px-[8px] py-[4px] rounded-bl-[12px] rounded-tr-[12px]">
                <span className="text-[12px] leading-[16px] font-normal text-[#806800] whitespace-nowrap">
                  {coupon.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* View Order Summary Drawer */}
      <BottomSheetDrawer
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        hideHeader
        footer={
          <button
            type="button"
            onClick={() => {
              setOrderModalOpen(false);
              navigate('home');
            }}
            className="w-full h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] font-bold"
          >
            Continue shopping
          </button>
        }
      >
        <div className="bg-white h-[48px] px-[12px] flex items-center gap-[8px] border-b border-[#F2F2F2]">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOrderModalOpen(false)}
            className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
          >
            <img
              src={CHECKOUT_ASSETS.close}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
          </button>
          <h3 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
            Order Details
          </h3>
          <div className="w-[36px] h-[36px] shrink-0" />
        </div>

        <div className="p-[16px] space-y-3 text-[13px]">
          <div className="rounded-[12px] bg-[#F7F7F7] p-[12px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Order No.</span>
              <span className="font-bold text-[#1A1A1A]">
                {latestOrder?.id ?? 'WE20260506'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Fulfillment</span>
              <span className="font-semibold text-[#1A1A1A]">
                {isDelivery ? 'Home Delivery' : 'Click & Collect'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#666666] shrink-0">Destination</span>
              <span className="font-semibold text-[#1A1A1A] text-right truncate">
                {latestOrder?.destination ?? 'Laguna Verde Tower 3 18/F'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Time Slot</span>
              <span className="font-semibold text-[#1A1A1A]">{displaySlot}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Payment Method</span>
              <span className="font-semibold text-[#1A1A1A]">
                {latestOrder?.paymentMethod ?? 'AMEXcard (7833)'}
              </span>
            </div>
            {latestOrder?.remarks && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#666666] shrink-0">Remarks</span>
                <span className="text-[#1A1A1A] text-right">{latestOrder.remarks}</span>
              </div>
            )}
          </div>

          <div className="rounded-[12px] border border-[#EFEFEF] p-[12px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Items</span>
              <span className="font-semibold text-[#1A1A1A]">
                {latestOrder?.itemCount ?? 5} items
              </span>
            </div>
            {latestOrder && latestOrder.saved > 0 && (
              <div className="flex items-center justify-between text-[#E40032]">
                <span>Total Saved</span>
                <span className="font-bold">-&#36;{latestOrder.saved.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0] text-[15px] font-bold text-[#1A1A1A]">
              <span>Total Paid</span>
              <span>&#36;{displayTotal}</span>
            </div>
          </div>
        </div>
      </BottomSheetDrawer>
    </div>
  );
};
