import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';

interface PriceBlockProps {
  price: number;
  originalPrice?: number;
  unitPriceText?: string; // Case deal average price e.g. "$100/Bottle" (replaces strikethrough)
  savedText?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  inverse?: boolean;
  className?: string;
}

export const PriceBlock: React.FC<PriceBlockProps> = ({
  price,
  originalPrice,
  unitPriceText,
  savedText,
  size = 'md',
  inverse = false,
  className = '',
}) => {
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);

  const fixed = price.toFixed(2);
  const [intPart, decPart] = fixed.split('.');

  const sizeMap = {
    xs: { sym: 'text-[10px] leading-[1] mt-[1px]', main: 'text-[14px] leading-[1]', dec: 'text-[10px] leading-[1] mt-[1px]', sub: 'text-[11px] leading-[1]' },
    sm: { sym: 'text-[10px] leading-[1] mt-[1px]', main: 'text-[15px] leading-[1]', dec: 'text-[10px] leading-[1] mt-[1px]', sub: 'text-[11px] leading-[1]' },
    md: { sym: 'text-[11px] leading-[1] mt-[1px]', main: 'text-[16px] leading-[1]', dec: 'text-[11px] leading-[1] mt-[1px]', sub: 'text-[12px] leading-[1]' },
    lg: { sym: 'text-[12px] leading-[1] mt-[2px]', main: 'text-[20px] leading-[1]', dec: 'text-[12px] leading-[1] mt-[2px]', sub: 'text-[12px] leading-[1]' },
    hero: { sym: 'text-[16px] leading-[1] mt-[3px]', main: 'text-[28px] leading-[1]', dec: 'text-[16px] leading-[1] mt-[3px]', sub: 'text-[13px] leading-[1]' },
  }[size];

  const mainColor = inverse ? '#FFFFFF' : t.primary;
  const unitColor = inverse ? 'text-white/80' : 'text-[#666666]';
  const origColor = inverse ? 'text-white/75' : 'text-[#858585]';

  return (
    <div className={`inline-flex flex-wrap items-end gap-1 ${className}`}>
      <span
        className="inline-flex items-start font-bold tracking-tight"
        style={{
          color: mainColor,
          fontFamily: t.isMp ? t.heroFont : undefined,
        }}
      >
        <span className={`${sizeMap.sym} mr-[0.5px]`}>&#36;</span>
        <span className={sizeMap.main}>{intPart}</span>
        <span className={sizeMap.dec}>.{decPart}</span>
      </span>

      {unitPriceText ? (
        <span className={`${sizeMap.sub} font-normal ${unitColor}`}>{unitPriceText}</span>
      ) : originalPrice && originalPrice > price ? (
        <span className={`${sizeMap.sub} font-normal line-through pb-[1px] ${origColor}`}>
          &#36;{originalPrice.toFixed(2)}
        </span>
      ) : null}

      {savedText && (
        <span
          className="inline-flex items-center px-1.5 py-[1px] rounded-[4px] text-[10px] font-medium leading-[14px]"
          style={{
            backgroundColor: t.primarySoftBg,
            color: t.primary,
          }}
        >
          {savedText}
        </span>
      )}
    </div>
  );
};
