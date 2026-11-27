import React from 'react';
import { Check, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';

interface PromoTagProps {
  label: string;
  applied?: boolean;
  variant?: 'yellow' | 'leadtime' | 'gift' | 'new' | 'coming-soon';
  className?: string;
}

export const PromoTag: React.FC<PromoTagProps> = ({
  label,
  applied = false,
  variant = 'yellow',
  className = '',
}) => {
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);

  if (variant === 'new') {
    return (
      <span
        className={`inline-flex items-center justify-center h-[16px] text-white text-[11px] font-medium leading-[16px] px-[5px] ${
          t.isMp ? 'bg-[#9E0E11] rounded-none' : 'bg-[#E40032] rounded-[4px] text-[12px] font-normal px-[4px]'
        } ${className}`}
      >
        {label}
      </span>
    );
  }

  if (variant === 'coming-soon') {
    return (
      <span
        className={`inline-flex items-center justify-center bg-[#666666]/85 text-white text-[10px] font-medium leading-[14px] px-2 py-[2px] rounded-full ${className}`}
      >
        {label}
      </span>
    );
  }

  if (variant === 'gift') {
    return (
      <span
        className={`inline-flex items-center justify-center border text-[10px] font-semibold leading-[12px] px-1.5 py-[1px] rounded-[3px] ${className}`}
        style={{
          borderColor: t.primary,
          color: t.primary,
          backgroundColor: t.primarySoftBg,
        }}
      >
        {label}
      </span>
    );
  }

  if (variant === 'leadtime') {
    return (
      <span
        className={`inline-flex items-center gap-1 bg-[#FFF5CC] text-[#3D3D3D] text-[10px] font-medium leading-[14px] px-1.5 py-[2px] rounded-[4px] ${className}`}
      >
        <Clock className="w-2.5 h-2.5 text-[#3D3D3D]" strokeWidth={2.2} />
        {label}
      </span>
    );
  }

  // MP uses subtle sage-tinted promo pills instead of WE's bright yellow
  if (t.isMp) {
    return (
      <span
        className={`inline-flex items-center gap-1 h-[18px] text-[11px] font-medium leading-[16px] px-[6px] rounded-[2px] whitespace-nowrap ${className}`}
        style={{
          backgroundColor: t.primarySoftBg,
          color: t.primary,
        }}
      >
        {applied && (
          <span
            className="inline-flex items-center justify-center w-3 h-3 rounded-full text-white shrink-0"
            style={{ backgroundColor: t.primary }}
          >
            <Check className="w-2 h-2" strokeWidth={3} />
          </span>
        )}
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 h-[16px] bg-[#FFEC99] text-[#1A1A1A] text-[12px] font-normal leading-[16px] px-[4px] rounded-[4px] whitespace-nowrap ${className}`}
    >
      {applied && (
        <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-[#2C8232] text-white shrink-0">
          <Check className="w-2 h-2" strokeWidth={3} />
        </span>
      )}
      {label}
    </span>
  );
};
