import React, { useState } from 'react';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { useAppStore } from '../../store/useAppStore';
import { REFUND_ASSETS } from './refundAssets';
import { getLastSubmittedRefund } from './refundState';

function splitPrice(price: number) {
  const [intPart, decPart] = price.toFixed(2).split('.');
  return { intPart, decPart: `.${decPart}` };
}

export const RefundSuccessPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const showToast = useAppStore((s) => s.showToast);

  const [supportOpen, setSupportOpen] = useState(false);

  const record = getLastSubmittedRefund();
  const totalParts = splitPrice(record.totalRefund);

  return (
    <div className="min-h-dvh bg-[#F5F5F5] pb-[92px] flex flex-col gap-[8px]">
      {/* Top White Navigation Bar (Figma 2265:52089 -> 2218:25062) */}
      <div className="bg-white sticky top-0 z-20">
        <header className="pt-[max(4px,env(safe-area-inset-top))] h-[48px] px-[12px] flex items-center">
          <button
            type="button"
            aria-label="Go back"
            onClick={goBack}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:bg-[#F5F5F5] shrink-0"
          >
            <img
              src={REFUND_ASSETS.chevronLeft}
              alt=""
              className="w-[26px] h-[26px] object-contain"
            />
          </button>
          <h1 className="flex-1 text-center text-[16px] leading-[24px] font-medium text-[#1A1A1A]">
            After-sales Details
          </h1>
          <div className="w-[36px] h-[36px] shrink-0" />
        </header>

        {/* 3-Step Progress Bar (Figma 2218:24983) */}
        <div className="border-t border-[#E6E6E6] px-[22px] py-[15px]">
          <div className="flex flex-col items-center gap-[8px] max-w-[325px] mx-auto">
            <div className="w-full px-[36px] flex items-center">
              <span className="w-[12px] h-[12px] rounded-full bg-[#E40032] shrink-0" />
              <span className="flex-1 h-[2px] bg-[#E40032]" />
              <span className="w-[12px] h-[12px] rounded-full bg-[#E40032] shrink-0" />
              <span className="flex-1 h-[2px] bg-[#E40032]" />
              <span className="w-[12px] h-[12px] rounded-full bg-[#E40032] shrink-0" />
            </div>
            <div className="w-full grid grid-cols-3 text-center text-[14px] leading-[20px]">
              <span className="text-[#6B6B6B]">Submit</span>
              <span className="text-[#6B6B6B]">Support</span>
              <span className="text-[#E40032] font-normal">Refunded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refunded Green Status Banner (Figma 2218:24992) */}
      <div className="mx-[16px] bg-[#EAF7EF] rounded-[12px] relative overflow-hidden py-[12px] pl-[18px] pr-[16px] flex flex-col gap-[4px]">
        <span className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#178A4A] rounded-l-[12px]" />
        <p className="text-[16px] leading-[24px] font-bold text-[#178A4A]">
          Refunded
        </p>
        <p className="text-[12px] leading-[16px] text-[#6B6B6B]">
          Refund sent to original payment method.
        </p>
      </div>

      {/* Refunded Items Card (Figma 2233:27447) */}
      <section className="bg-white">
        <div className="border-b border-[#E6E6E6] px-[16px] py-[12px]">
          <h2 className="text-[16px] leading-[24px] font-bold text-black">
            Home Delivery
          </h2>
        </div>

        <div className="px-[20px]">
          {record.items.map((item, idx) => {
            const p = splitPrice(item.unitPrice);
            const isLast = idx === record.items.length - 1;
            return (
              <div
                key={item.id}
                className={`py-[12px] ${!isLast ? 'border-b border-[#E5E5E5]' : ''}`}
              >
                <div className="flex items-start gap-[8px] pl-[24px]">
                  <div className="w-[76px] h-[76px] rounded-[4px] bg-white overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                    <div className="flex flex-col gap-[2px]">
                      <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
                        {item.name}
                      </p>
                      {item.subtitle && (
                        <p className="text-[12px] leading-[16px] text-[#969696]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-[4px]">
                      <div className="flex items-end gap-[4px]">
                        <div className="flex items-start font-bold text-[#E40032] leading-none">
                          <span className="text-[10px] leading-[12px] mt-[1px]">$</span>
                          <span className="text-[16px] leading-[16px]">{p.intPart}</span>
                          <span className="text-[10px] leading-[12px] mt-[1px]">{p.decPart}</span>
                        </div>
                        {item.originalPrice && (
                          <span className="text-[10px] leading-[12px] text-[#969696] line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {item.savedText && (
                        <span className="bg-[#FFF6F5] text-[#E40032] text-[10px] leading-[14px] px-[4px] py-[2px] rounded-[4px]">
                          {item.savedText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Refund Details Breakdown Card (Figma 2218:25030) */}
      <section className="bg-white rounded-[12px] px-[16px] py-[12px] flex flex-col gap-[10px]">
        <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
          Refund details
        </h2>
        <div className="px-[8px] flex flex-col gap-[6px] text-[12px] leading-[16px] font-semibold">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Item subtotal</span>
            <span className="text-[#1A1A1A] tabular-nums">
              HK${record.itemSubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Packaging fee</span>
            <span className="text-[#1A1A1A] tabular-nums">
              HK${record.packagingFee.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Pickup service fee</span>
            <span className="text-[#1A1A1A] tabular-nums">
              HK${record.pickupServiceFee.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="h-px bg-[#E6E6E6] w-full" />
        <div className="px-[8px] flex items-center justify-between">
          <span className="text-[14px] leading-[20px] text-[#1A1A1A]">
            Total refund
          </span>
          <div className="flex items-start font-bold text-[#E40032] leading-none tabular-nums">
            <span className="text-[14px] leading-[18px]">$</span>
            <span className="text-[18px] leading-[20px]">{totalParts.intPart}</span>
            <span className="text-[12px] leading-[16px]">{totalParts.decPart}</span>
          </div>
        </div>
      </section>

      {/* Returned Discounts Card (Figma 2218:25049) */}
      <section className="bg-white rounded-[12px] px-[16px] py-[12px] flex flex-col gap-[10px]">
        <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
          Returned discounts
        </h2>
        <div className="px-[8px] flex flex-col gap-[6px] text-[12px] leading-[16px] font-semibold">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Cash</span>
            <span className="text-[#178A4A]">HK$10.00 returned</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Coupon expiry</span>
            <span className="text-[#1A1A1A]">2026-09-30</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Storewide</span>
            <span className="text-[#1A1A1A]">Not returned with partial refund</span>
          </div>
        </div>
      </section>

      {/* Case Metadata Card (Figma 2218:25057) */}
      <section className="bg-white rounded-[12px] px-[16px] py-[12px]">
        <div className="px-[8px] flex flex-col gap-[6px] text-[12px] leading-[16px] font-semibold">
          <div className="flex items-center justify-between gap-[12px]">
            <span className="text-[#6B6B6B] shrink-0">Reason</span>
            <span className="text-[#1A1A1A] text-right">{record.reasonSummary}</span>
          </div>
          <div className="flex items-center justify-between gap-[12px]">
            <span className="text-[#6B6B6B] shrink-0">Case number</span>
            <span className="text-[#1A1A1A] tabular-nums">{record.caseNumber}</span>
          </div>
        </div>
      </section>

      {/* Fixed Bottom Action Bar (.app-fixed-bar) (Figma 2218:25063) */}
      <div className="app-fixed-bar bottom-0 z-30 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] px-[12px] pt-[16px] pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => setSupportOpen(true)}
          className="w-full h-[36px] rounded-[4px] bg-[#E40032] text-white text-[13px] leading-[18px] font-semibold flex items-center justify-center active:opacity-90"
        >
          Contact support
        </button>
      </div>

      {/* Support Options Drawer */}
      <BottomSheetDrawer
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        title="Contact Wellcome Support"
      >
        <div className="p-[16px] flex flex-col gap-[10px]">
          <p className="text-[13px] text-[#666666]">
            Reference Case <strong className="text-[#1A1A1A]">{record.caseNumber}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              setSupportOpen(false);
              showToast('Connected to Wellcome Customer Support chat');
            }}
            className="w-full h-[44px] rounded-[8px] bg-[#E40032] text-white text-[14px] font-bold"
          >
            Start Live Chat
          </button>
          <button
            type="button"
            onClick={() => {
              setSupportOpen(false);
              navigate('feedback');
            }}
            className="w-full h-[44px] rounded-[8px] border border-[#C7C7C7] bg-white text-[#1A1A1A] text-[14px] font-semibold"
          >
            Share Order Feedback
          </button>
        </div>
      </BottomSheetDrawer>
    </div>
  );
};
