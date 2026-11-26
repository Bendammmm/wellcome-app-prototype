import React from 'react';
import { Check } from 'lucide-react';
import { ICONS } from '../../data/catalog';
import { computePricingSummary, useAppStore } from '../../store/useAppStore';

interface ThresholdProgressBarProps {
  variant?: 'compact' | 'expanded';
  onClick?: () => void;
  className?: string;
}

/**
 * Matches Figma 5207:218568 (凑单栏升级方案 4 states) & 7406:228212 (Smart Tips)
 * Confirmed thresholds:
 * - Home Delivery: $200 Start delivery ($50 fee) -> $500 Free Delivery -> $800 12% off
 * - Click & Collect: $50 Start pick-up ($20 fee) -> $200 Free Pick-up -> $800 12% off
 */
export const ThresholdProgressBar: React.FC<ThresholdProgressBarProps> = ({
  variant = 'compact',
  onClick,
  className = '',
}) => {
  const cartItems = useAppStore((s) => s.cartItems);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const promoCodeDiscount = useAppStore((s) => s.promoCodeDiscount);

  const pricing = computePricingSummary(cartItems, fulfillmentMode, promoCodeDiscount);
  const { config, subtotalAfterPromo, meetsMinimum, hasFreeDelivery, hasMaxReward, progressPercent } = pricing;

  const isDelivery = fulfillmentMode === 'delivery';
  const modeLabel = isDelivery ? 'delivery' : 'pick-up';
  const freeLabel = isDelivery ? 'Free Delivery' : 'Free Pick-up';
  const startLabel = isDelivery ? 'Start delivery' : 'Start pick-up';

  const toMin = Math.max(0, Math.ceil(config.minOrder - subtotalAfterPromo));
  const toFree = Math.max(0, Math.ceil(config.freeFeeAt - subtotalAfterPromo));
  const toMax = Math.max(0, Math.ceil(config.bonusRewardAt - subtotalAfterPromo));

  const renderMessage = () => {
    if (!meetsMinimum) {
      return (
        <>
          <span className="font-bold text-[#E40032]">&#36;{toMin}</span> more to start {modeLabel}
        </>
      );
    }
    if (!hasFreeDelivery) {
      return (
        <>
          {isDelivery ? 'Delivery' : 'Pick-up'} available. Add{' '}
          <span className="font-bold text-[#E40032]">&#36;{toFree}</span> for free {modeLabel}
        </>
      );
    }
    if (!hasMaxReward) {
      return (
        <>
          {freeLabel} earned. Add{' '}
          <span className="font-bold text-[#E40032]">&#36;{toMax}</span> for 12% savings
        </>
      );
    }
    return <>Maximum rewards reached. Enjoy all your benefits</>;
  };

  if (variant === 'expanded') {
    return (
      <div
        className={`bg-[#FFF2EB] rounded-[12px] p-3.5 border border-[#FFE4D6] ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF5800] p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src={ICONS.addmoreCart}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[13px] leading-[18px] text-[#444444] font-medium flex-1">
            {renderMessage()}
          </p>
        </div>

        <div className="h-[1px] bg-[#F2DFD5] my-3" />

        {/* Dollar amounts above milestones */}
        <div className="relative flex justify-between text-[11px] font-semibold text-[#3D3D3D] mb-1.5">
          <span className="w-1/4 text-right pr-1">&#36;{config.minOrder}</span>
          <span className="w-3/8 text-right pr-1">&#36;{config.freeFeeAt}</span>
          <span className="w-3/8 text-right">&#36;{config.bonusRewardAt}</span>
        </div>

        {/* 3-milestone track */}
        <div className="relative h-2 rounded-full bg-black/10 my-1">
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full bg-[#FF5800] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          {[
            { pos: 25, reached: meetsMinimum },
            { pos: 62.5, reached: hasFreeDelivery },
            { pos: 100, reached: hasMaxReward },
          ].map((node, idx) => (
            <span
              key={idx}
              style={{ left: `${node.pos}%` }}
              className={`-translate-x-1/2 -translate-y-1/2 top-1/2 absolute w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-colors ${
                node.reached
                  ? 'bg-[#FF5800] border-white text-white'
                  : 'bg-white border-[#C7C7C7]'
              }`}
            >
              {node.reached && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
            </span>
          ))}
        </div>

        {/* Milestone names below */}
        <div className="relative flex justify-between text-[11px] mt-2">
          <span
            className={`w-1/3 text-center ${
              meetsMinimum ? 'text-[#E40032] font-semibold' : 'text-[#666666]'
            }`}
          >
            {startLabel}
          </span>
          <span
            className={`w-1/3 text-center ${
              hasFreeDelivery ? 'text-[#E40032] font-semibold' : 'text-[#666666]'
            }`}
          >
            {freeLabel}
          </span>
          <span
            className={`w-1/3 text-right ${
              hasMaxReward ? 'text-[#E40032] font-semibold' : 'text-[#666666]'
            }`}
          >
            12% off
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-[#FFF2EB] px-3 py-2 flex items-center gap-2 text-left active:bg-[#FFE8DB] transition-colors ${className}`}
    >
      <div className="w-[24px] h-[24px] rounded-full bg-[#FF5800] flex items-center justify-center shrink-0">
        <img
          src={ICONS.addmoreCart}
          alt=""
          className="w-[15px] h-[15px] object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] leading-[16px] text-[#444444] truncate">
          {renderMessage()}
        </p>
        {/* Slim 3-node bar */}
        <div className="relative h-[4px] rounded-full bg-black/12 mt-1.5 mr-1">
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full bg-[#FF5800] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          {[
            { pos: 25, reached: meetsMinimum },
            { pos: 62.5, reached: hasFreeDelivery },
            { pos: 100, reached: hasMaxReward },
          ].map((node, idx) => (
            <span
              key={idx}
              style={{ left: `${node.pos}%` }}
              className={`-translate-x-1/2 -translate-y-1/2 top-1/2 absolute w-[8px] h-[8px] rounded-full border ${
                node.reached
                  ? 'bg-[#FF5800] border-white'
                  : 'bg-white border-[#BDBDBD]'
              }`}
            />
          ))}
        </div>
      </div>

      <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain shrink-0" />
    </button>
  );
};
