import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  size?: 'sm' | 'md';
  showTrashOnOne?: boolean;
}

/**
 * 1:1 implementation of Wellcome Component Library `_Cart Quantity Stepper` (1328:547):
 * - size="sm" (Cart row): 24x24 #F7F7F7 rounded-[4px] buttons, 16x16 icons, 32x24 qty text (16px/24px regular), gap 4px -> total 88x24
 * - size="md" (PDP footer): 36x36 #F7F7F7 rounded-[6px] buttons, 18x18 icons, 36px qty text
 */
export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  size = 'sm',
  showTrashOnOne = false,
}) => {
  const btnCls =
    size === 'md'
      ? 'w-[36px] h-[36px] rounded-[6px]'
      : 'w-[24px] h-[24px] rounded-[4px]';
  const numCls =
    size === 'md'
      ? 'w-[36px] h-[36px] text-[16px] leading-[36px]'
      : 'w-[32px] h-[24px] text-[16px] leading-[24px]';
  const iconCls = size === 'md' ? 'w-[18px] h-[18px]' : 'w-[16px] h-[16px]';

  const canDecrease = value > min;

  return (
    <div className="inline-flex items-center justify-center gap-[4px] select-none shrink-0">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrease}
        onClick={(e) => {
          e.stopPropagation();
          if (canDecrease) onChange(value - 1);
        }}
        className={`${btnCls} bg-[#F7F7F7] text-[#1A1A1A] inline-flex items-center justify-center transition-colors active:bg-[#E5E5E5] disabled:opacity-35`}
      >
        {showTrashOnOne && value === 1 ? (
          <Trash2 className={iconCls} strokeWidth={1.8} />
        ) : (
          <Minus className={iconCls} strokeWidth={2} />
        )}
      </button>
      <span className={`${numCls} text-center font-normal text-[#1A1A1A] tabular-nums`}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={(e) => {
          e.stopPropagation();
          onChange(value + 1);
        }}
        className={`${btnCls} bg-[#F7F7F7] text-[#1A1A1A] inline-flex items-center justify-center transition-colors active:bg-[#E5E5E5]`}
      >
        <Plus className={iconCls} strokeWidth={2} />
      </button>
    </div>
  );
};
