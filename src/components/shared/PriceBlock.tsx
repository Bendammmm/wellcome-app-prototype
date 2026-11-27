import React from 'react';

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
  const fixed = price.toFixed(2);
  const [intPart, decPart] = fixed.split('.');

  const sizeMap = {
    xs: { sym: 'text-[10px]', main: 'text-[14px] leading-[18px]', dec: 'text-[10px]', sub: 'text-[11px]' },
    sm: { sym: 'text-[10px]', main: 'text-[15px] leading-[18px]', dec: 'text-[10px]', sub: 'text-[11px]' },
    md: { sym: 'text-[10px]', main: 'text-[16px] leading-[20px]', dec: 'text-[10px]', sub: 'text-[12px]' },
    lg: { sym: 'text-[12px]', main: 'text-[20px] leading-[24px]', dec: 'text-[12px]', sub: 'text-[12px]' },
    hero: { sym: 'text-[16px]', main: 'text-[28px] leading-[34px]', dec: 'text-[16px]', sub: 'text-[13px]' },
  }[size];

  const mainColor = inverse ? 'text-white' : 'text-[#E40032]';
  const unitColor = inverse ? 'text-white/80' : 'text-[#666666]';
  const origColor = inverse ? 'text-white/75' : 'text-[#858585]';

  return (
    <div className={`inline-flex flex-wrap items-baseline gap-1 ${className}`}>
      <span className={`inline-flex items-baseline font-bold tracking-tight ${mainColor}`}>
        <span className={`${sizeMap.sym} mr-[0.5px]`}>&#36;</span>
        <span className={sizeMap.main}>{intPart}</span>
        <span className={sizeMap.dec}>.{decPart}</span>
      </span>

      {unitPriceText ? (
        <span className={`${sizeMap.sub} font-normal ${unitColor}`}>{unitPriceText}</span>
      ) : originalPrice && originalPrice > price ? (
        <span className={`${sizeMap.sub} font-normal line-through ${origColor}`}>
          &#36;{originalPrice.toFixed(2)}
        </span>
      ) : null}

      {savedText && (
        <span className="inline-flex items-center px-1.5 py-[1px] rounded-[4px] bg-[#FFF0F2] text-[#E40032] text-[10px] font-medium leading-[14px]">
          {savedText}
        </span>
      )}
    </div>
  );
};
