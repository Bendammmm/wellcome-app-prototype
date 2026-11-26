import React, { useState } from 'react';
import { Check, Copy, Eye, Info } from 'lucide-react';
import { ASSETS, ICONS, PRODUCTS } from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../../components/shared/ProductCard';

export const OrderDetailPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const showToast = useAppStore((s) => s.showToast);
  const [showAllInfo, setShowAllInfo] = useState(false);

  const orderNumber = '10008099984271';
  const youMayLike = PRODUCTS.filter((p) =>
    ['belena-shiraz', 'bin-180-wine', 'nissin-bowl', 'jumbo-blueberry'].includes(p.id)
  );

  const handleCopyOrderNo = () => {
    navigator.clipboard?.writeText(orderNumber).catch(() => {});
    showToast('Order number copied');
  };

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[28px]">
      {/* 1. Top Map Hero (Figma 5981:291913) */}
      <section className="relative h-[180px] w-full overflow-hidden bg-[#ECE8E0]">
        <img
          src={ASSETS.mapImage}
          alt="Delivery Map"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-[48px] bg-gradient-to-t from-white to-transparent" />

        {/* Floating Nav Buttons */}
        <div className="absolute inset-x-0 top-0 px-[12px] pt-[max(12px,env(safe-area-inset-top))] flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="w-[36px] h-[36px] rounded-full bg-white/95 shadow-sm flex items-center justify-center active:scale-95"
          >
            <img src={ICONS.chevronLeft} alt="" className="w-[24px] h-[24px] object-contain" />
          </button>
          <button
            type="button"
            onClick={() => showToast('Support chat opened')}
            aria-label="Support"
            className="w-[36px] h-[36px] rounded-full bg-white/95 shadow-sm flex items-center justify-center active:scale-95"
          >
            <img src="/assets/figma/me/help-agent.svg" alt="Support" className="w-[20px] h-[20px] object-contain" />
          </button>
        </div>

        {/* Picking Pin Callout */}
        <div className="absolute left-[26%] top-[44%] -translate-y-1/2 flex flex-col items-center">
          <span className="px-[10px] py-[2px] rounded-full bg-white shadow-md text-[11px] font-semibold text-[#1A1A1A] mb-[4px]">
            Picking
          </span>
          <span className="w-[34px] h-[34px] rounded-full bg-[#E40032] border-2 border-white shadow-md flex items-center justify-center">
            <img src={ICONS.store} alt="" className="w-[18px] h-[18px] object-contain brightness-0 invert" />
          </span>
        </div>
      </section>

      {/* 2. Status Summary Header */}
      <section className="bg-white px-[14px] pt-[4px] pb-[14px] space-y-[8px]">
        <span className="inline-flex items-center gap-[4px] bg-[#F7F7F7] px-[8px] py-[3px] rounded-[4px] text-[11px] leading-[14px] text-[#1A1A1A]">
          <img src={ICONS.truckRed} alt="" className="w-[14px] h-[14px] object-contain" />
          Home Delivery
        </span>
        <h1 className="text-[16px] leading-[22px] font-bold text-[#1A1A1A]">
          Preparing your Order
        </h1>
        <p className="text-[12px] leading-[17px] text-[#666666]">
          We are preparing your order with food safety or freshness procedures.
        </p>
        <div className="pt-[2px]">
          <button
            type="button"
            onClick={() => showToast('Connecting to Wellcome Support...')}
            className="h-[32px] px-[12px] rounded-[6px] border border-[#E0E0E0] text-[12px] font-medium text-[#1A1A1A] active:bg-[#F7F7F7]"
          >
            Contact Us
          </button>
        </div>
      </section>

      <div className="px-[8px] pt-[8px] space-y-[8px]">
        {/* 3. Order Node Progress Card */}
        <section className="bg-white rounded-[12px] p-[12px] space-y-[14px]">
          <h2 className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">Order node</h2>

          <div className="relative">
            {/* Connector Line */}
            <div className="absolute left-[14%] right-[14%] top-[9px] h-[2px] bg-[#E5E7EB]" />
            <div className="absolute left-[14%] w-[28%] top-[9px] h-[2px] bg-[#E40032]" />

            <div className="grid grid-cols-3 gap-[4px] relative z-10 text-center">
              <div className="flex flex-col items-center">
                <span className="w-[20px] h-[20px] rounded-full bg-[#E40032] text-white flex items-center justify-center">
                  <Check className="w-[12px] h-[12px]" strokeWidth={3} />
                </span>
                <p className="text-[11px] leading-[14px] font-bold text-[#1A1A1A] mt-[6px]">
                  Preparing your order
                </p>
                <p className="text-[10px] leading-[14px] text-[#858585] mt-[2px]">26 Oct, 16:22</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="w-[10px] h-[10px] mt-[5px] mb-[5px] rounded-full bg-[#9CA3AF]" />
                <p className="text-[11px] leading-[14px] font-medium text-[#666666] mt-[6px]">
                  Preparing for shipment
                </p>
              </div>

              <div className="flex flex-col items-center">
                <span className="w-[10px] h-[10px] mt-[5px] mb-[5px] rounded-full bg-[#9CA3AF]" />
                <p className="text-[11px] leading-[14px] font-medium text-[#666666] mt-[6px]">
                  Expected delivery time
                </p>
                <p className="text-[10px] leading-[14px] text-[#858585] mt-[2px]">
                  15 Oct - 23 Oct 2024
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Order Items & Totals */}
        <section className="bg-white rounded-[12px] p-[12px] space-y-[12px]">
          <h2 className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">Pre-order Fresh</h2>

          <div className="flex items-start gap-[10px]">
            <div className="w-[52px] h-[52px] rounded-[6px] border border-[#F2F2F2] p-1 flex items-center justify-center shrink-0">
              <img src={ASSETS.fujiApple} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-[18px] font-medium text-[#1A1A1A]">
                Tasmania Ruby Jumbo Cherry 28mm+ (Gross Weight: 2KG) 1CS
              </p>
              <p className="text-[11px] text-[#858585] mt-[2px]">2KG</p>
              <div className="mt-[4px] flex items-center justify-between text-[12px]">
                <span className="text-[#3D3D3D]">Qty: 2</span>
                <span className="font-semibold text-[#1A1A1A]">&#36;13.00</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="px-[12px] py-[3px] rounded-full bg-[#F2F2F2] text-[11px] text-[#666666]">
              Total 1 piece/13.81Kg
            </span>
          </div>

          <div className="pt-[8px] border-t border-[#F2F2F2] space-y-[8px] text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-[#3D3D3D]">Items total</span>
              <span className="font-medium text-[#1A1A1A]">&#36;428.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-[4px] text-[#3D3D3D]">
                Handling fee <Info className="w-[13px] h-[13px] text-[#858585]" />
              </span>
              <span className="font-medium text-[#1A1A1A]">+&#36;2.00</span>
            </div>
            <div className="flex items-center justify-end gap-[4px] pt-[6px] border-t border-[#F2F2F2]">
              <span className="text-[12px] text-[#3D3D3D]">Total:</span>
              <span className="text-[16px] font-bold text-[#1A1A1A]">&#36;514.16</span>
            </div>
          </div>
        </section>

        {/* 5. Order Information */}
        <section className="bg-white rounded-[12px] p-[12px] space-y-[10px] text-[12px]">
          <h2 className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">Order Information</h2>

          <div className="flex items-center justify-between">
            <span className="text-[#666666]">Order Number</span>
            <div className="inline-flex items-center gap-[8px]">
              <span className="font-medium text-[#1A1A1A]">{orderNumber}</span>
              <button
                type="button"
                onClick={handleCopyOrderNo}
                className="inline-flex items-center gap-[3px] text-[#666666] active:text-[#1A1A1A]"
              >
                <Copy className="w-[13px] h-[13px]" />
                Copy
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#666666]">Check signature</span>
            <button
              type="button"
              onClick={() => showToast('Delivery signature available upon completion')}
              className="inline-flex items-center gap-[4px] text-[#666666]"
            >
              <Eye className="w-[14px] h-[14px]" />
              View
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#666666]">E-Receipt</span>
            <button
              type="button"
              onClick={() => showToast(`E-Receipt #${orderNumber} opened`)}
              className="inline-flex items-center gap-[4px] text-[#666666]"
            >
              <Eye className="w-[14px] h-[14px]" />
              View
            </button>
          </div>

          {showAllInfo && (
            <div className="pt-[8px] border-t border-[#F2F2F2] space-y-[6px] text-[#666666]">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-[#1A1A1A]">Hang Seng enJoy Card **** 8821</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address</span>
                <span className="text-[#1A1A1A]">Laguna Verde Tower 3 18/F</span>
              </div>
            </div>
          )}

          <div className="pt-[4px] flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllInfo((v) => !v)}
              className="px-[14px] py-[4px] rounded-full bg-[#F2F2F2] text-[11px] text-[#666666]"
            >
              {showAllInfo ? 'Hide order information' : 'View all order information'}
            </button>
          </div>
        </section>

        {/* 6. Rewards Earned */}
        <section className="bg-white rounded-[12px] p-[12px] space-y-[10px] text-[13px]">
          <h2 className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">Rewards Earned</h2>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-[8px] text-[#1A1A1A]">
              <img src={ASSETS.yuuCoin} alt="yuu" className="w-[18px] h-[18px] object-contain" />
              yuu Points
            </span>
            <span className="font-semibold text-[#1A1A1A]">+20</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-[8px] text-[#1A1A1A]">
              <img src={ICONS.promoOutline} alt="" className="w-[18px] h-[18px] object-contain invert-0 bg-[#E40032] rounded-full p-0.5" />
              Tourister CLEVA Collection Stamps
            </span>
            <span className="font-semibold text-[#1A1A1A]">+2</span>
          </div>
        </section>

        {/* 7. You May Like */}
        <section className="pt-[4px]">
          <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A] px-[4px] mb-[8px]">
            You May Like
          </h2>
          <div className="grid grid-cols-2 gap-[8px]">
            {youMayLike.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
