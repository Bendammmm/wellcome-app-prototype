import React from 'react';
import { Check } from 'lucide-react';
import { ICONS } from '../../data/catalog';
import { computePricingSummary, useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';

interface ThresholdProgressBarProps {
  variant?: 'compact' | 'expanded';
  onClick?: () => void;
  className?: string;
}

/**
 * Matches Figma 5207:218568 (凑单栏升级方案 4 states), 7406:228212 (Smart Tips),
 * and MP Option 1 Annotation #13 (#FFF2EB orange-red -> #F7F5F0 + MP Green #28443C).
 */
export const ThresholdProgressBar: React.FC<ThresholdProgressBarProps> = ({
  variant = 'compact',
  onClick,
  className = '',
}) => {
  const cartItems = useAppStore((s) => s.cartItems);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const promoCodeDiscount = useAppStore((s) => s.promoCodeDiscount);
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);

  const pricing = computePricingSummary(cartItems, fulfillmentMode, promoCodeDiscount);
  const { config, subtotalAfterPromo, meetsMinimum, hasFreeDelivery, hasMaxReward, progressPercent } = pricing;

  const isDelivery = fulfillmentMode === 'delivery';
  const modeLabel = isDelivery ? 'delivery' : 'pick-up';
  const freeLabel = isDelivery ? 'Free Delivery' : 'Free Pick-up';
  const startLabel = isDelivery ? 'Start delivery' : 'Start pick-up';

  const toMin = Math.max(0, Math.ceil(config.minOrder - subtotalAfterPromo));
  const toFree = Math.max(0, Math.ceil(config.freeFeeAt - subtotalAfterPromo));
  const toMax = Math.max(0, Math.ceil(config.bonusRewardAt - subtotalAfterPromo));

  const accentTextColor = t.isMpOpt1 ? '#28443C' : t.isMpBefore ? '#155D2D' : '#E40032';
  const barColor = t.isMpOpt1 ? '#28443C' : t.isMpBefore ? '#155D2D' : '#FF5800';
  const bgColor = t.isMpOpt1 ? '#F7F5F0' : '#FFF2EB';
  const borderColor = t.isMpOpt1 ? '#E6E2D8' : '#FFE4D6';

  const renderMessage = () => {
    if (!meetsMinimum) {
      return (
        <>
          <span className="font-bold" style={{ color: accentTextColor }}>&#36;{toMin}</span> more to start {modeLabel}
        </>
      );
    }
    if (!hasFreeDelivery) {
      return (
        <>
          {isDelivery ? 'Delivery' : 'Pick-up'} available. Add{' '}
          <span className="font-bold" style={{ color: accentTextColor }}>&#36;{toFree}</span> for free {modeLabel}
        </>
      );
    }
    if (!hasMaxReward) {
      return (
        <>
          {freeLabel} earned. Add{' '}
          <span className="font-bold" style={{ color: accentTextColor }}>&#36;{toMax}</span> for 12% savings
        </>
      );
    }
    return <>Maximum rewards reached. Enjoy all your benefits</>;
  };

  if (variant === 'expanded') {
    return (
      <div
        className={`rounded-[12px] p-3.5 border ${className}`}
        style={{ backgroundColor: bgColor, borderColor }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full p-1.5 flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: barColor }}
          >
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

        <div className="h-[1px] my-3" style={{ backgroundColor: borderColor }} />

        {/* Dollar amounts above milestones */}
        <div className="relative flex justify-between text-[11px] font-semibold text-[#3D3D3D] mb-1.5">
          <span className="w-1/4 text-right pr-1">&#36;{config.minOrder}</span>
          <span className="w-3/8 text-right pr-1">&#36;{config.freeFeeAt}</span>
          <span className="w-3/8 text-right">&#36;{config.bonusRewardAt}</span>
        </div>

        {/* 3-milestone track */}
        <div className="relative h-2 rounded-full bg-black/10 my-1">
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%`, backgroundColor: barColor }}
          />
          {[
            { pos: 25, reached: meetsMinimum },
            { pos: 62.5, reached: hasFreeDelivery },
            { pos: 100, reached: hasMaxReward },
          ].map((node, idx) => (
            <span
              key={idx}
              style={{
                left: `${node.pos}%`,
                backgroundColor: node.reached ? barColor : '#FFFFFF',
                borderColor: node.reached ? '#FFFFFF' : '#C7C7C7',
              }}
              className={`-translate-x-1/2 -translate-y-1/2 top-1/2 absolute w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-colors ${
                node.reached ? 'text-white' : ''
              }`}
            >
              {node.reached && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
            </span>
          ))}
        </div>

        {/* Milestone names below */}
        <div className="relative flex justify-between text-[11px] mt-2">
          <span
            className={`w-1/3 text-center ${meetsMinimum ? 'font-semibold' : 'text-[#666666]'}`}
            style={meetsMinimum ? { color: accentTextColor } : undefined}
          >
            {startLabel}
          </span>
          <span
            className={`w-1/3 text-center ${hasFreeDelivery ? 'font-semibold' : 'text-[#666666]'}`}
            style={hasFreeDelivery ? { color: accentTextColor } : undefined}
          >
            {freeLabel}
          </span>
          <span
            className={`w-1/3 text-right ${hasMaxReward ? 'font-semibold' : 'text-[#666666]'}`}
            style={hasMaxReward ? { color: accentTextColor } : undefined}
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
      className={`w-full px-3 py-2 flex items-center gap-2 text-left transition-colors ${className}`}
      style={{
        backgroundColor: bgColor,
        borderTop: t.isMpOpt1 ? '1px solid #E6E2D8' : undefined,
      }}
    >
      <div
        className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: barColor }}
      >
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
            className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%`, backgroundColor: barColor }}
          />
          {[
            { pos: 25, reached: meetsMinimum },
            { pos: 62.5, reached: hasFreeDelivery },
            { pos: 100, reached: hasMaxReward },
          ].map((node, idx) => (
            <span
              key={idx}
              style={{
                left: `${node.pos}%`,
                backgroundColor: node.reached ? barColor : '#FFFFFF',
                borderColor: node.reached ? '#FFFFFF' : '#BDBDBD',
              }}
              className="-translate-x-1/2 -translate-y-1/2 top-1/2 absolute w-[8px] h-[8px] rounded-full border"
            />
          ))}
        </div>
      </div>

      <img src={ICONS.chevronRight} alt="" className="w-4 h-4 object-contain shrink-0" />
    </button>
  );
};
