import React from 'react';
import { Check, Clock } from 'lucide-react';

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
  if (variant === 'new') {
    return (
      <span
        className={`inline-flex items-center justify-center h-[16px] bg-[#E40032] text-white text-[12px] font-normal leading-[16px] px-[4px] rounded-[4px] ${className}`}
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
        className={`inline-flex items-center justify-center border border-[#E40032] text-[#E40032] bg-[#FFF6F5] text-[10px] font-semibold leading-[12px] px-1.5 py-[1px] rounded-[3px] ${className}`}
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
