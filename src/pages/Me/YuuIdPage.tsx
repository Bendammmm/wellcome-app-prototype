import React from 'react';
import { Copy, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const YuuIdPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const coupons = useAppStore((s) => s.coupons);
  const showToast = useAppStore((s) => s.showToast);

  const claimedCoupons = coupons.filter((c) => c.claimed);
  const yuuIdNumber = '934480054661206';

  const handleCopy = () => {
    navigator.clipboard?.writeText(yuuIdNumber).catch(() => {});
    showToast('yuu ID copied to clipboard');
  };

  return (
    <div
      className="min-h-dvh flex flex-col justify-between px-[16px] pt-[max(16px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))] text-white relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 12% 45%, #E03A6E 0%, transparent 45%), radial-gradient(circle at 88% 18%, #A2C8FF 0%, transparent 45%), linear-gradient(165deg, #5B96F7 0%, #6A86E8 48%, #3472DF 100%)',
      }}
    >
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between h-[44px]">
          <button
            type="button"
            onClick={goBack}
            aria-label="Close"
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:bg-white/15"
          >
            <X className="w-[24px] h-[24px] text-white" strokeWidth={2.2} />
          </button>

          <div className="flex items-center gap-[12px]">
            <span className="w-[34px] h-[34px] rounded-[8px] bg-[#E40032] text-white flex flex-col items-center justify-center leading-none shadow-sm">
              <span className="text-[11px] font-bold">惠康</span>
              <span className="text-[6px] tracking-tight opacity-90">wellcome</span>
            </span>
            <span className="w-[1px] h-[22px] bg-white/60" />
            <span className="w-[34px] h-[34px] rounded-[8px] bg-[#1D6FE2] text-white flex items-center justify-center font-extrabold italic text-[13px] shadow-sm">
              yuu
            </span>
          </div>

          <div className="w-[36px]" />
        </div>

        {/* EnJoy Card Banner Pill */}
        <div className="mt-[28px] flex justify-center">
          <span className="px-[18px] py-[6px] rounded-full bg-white/25 backdrop-blur-xs text-[12px] leading-[16px] font-semibold text-white">
            Earn up to 4x Points with enJoy Card
          </span>
        </div>

        {/* Main White QR Code Card */}
        <div className="mt-[16px] mx-auto max-w-[276px] bg-white rounded-[14px] p-[20px] shadow-[0_12px_32px_rgba(0,0,0,0.16)] flex flex-col items-center">
          <div className="w-[210px] h-[210px] flex items-center justify-center">
            <img
              src="/assets/figma/me/qr-yuu.png"
              alt="yuu ID QR Code"
              className="w-full h-full object-contain"
            />
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-[16px] w-full rounded-[8px] border border-[#E5E7EB] px-[12px] py-[8px] flex items-center justify-between text-left active:bg-[#F7F7F7]"
          >
            <div>
              <p className="text-[11px] leading-[14px] text-[#666666]">yuu ID</p>
              <p className="text-[13px] leading-[18px] font-medium text-[#1A1A1A] tracking-wide">
                {yuuIdNumber}
              </p>
            </div>
            <Copy className="w-[18px] h-[18px] text-[#2B6DE0] shrink-0" />
          </button>
        </div>
      </div>

      {/* Bottom Coupons Area */}
      <div className="mt-[28px] mx-auto w-full max-w-[320px] rounded-[12px] bg-[#2159B8]/70 backdrop-blur-xs px-[18px] py-[22px] text-center">
        {claimedCoupons.length > 0 ? (
          <div className="space-y-[8px] text-left">
            <p className="text-[13px] font-bold text-white text-center mb-[6px]">
              Your Redeemed Coupons ({claimedCoupons.length})
            </p>
            {claimedCoupons.map((c) => (
              <div
                key={c.id}
                className="bg-white/15 rounded-[8px] px-[12px] py-[8px] flex items-center justify-between text-[12px]"
              >
                <span className="font-semibold text-white">
                  &#36;{c.amount} Off · {c.condition}
                </span>
                <span className="text-[10px] bg-[#FFCF00] text-[#1A1A1A] font-bold px-2 py-0.5 rounded-full">
                  Ready
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-[14px] leading-[20px] font-bold text-white">
              There are no Coupons yet
            </p>
            <p className="mt-[6px] text-[12px] leading-[18px] text-white/85">
              After redeeming your coupons and rewards, you can find them here
            </p>
          </>
        )}
      </div>
    </div>
  );
};
