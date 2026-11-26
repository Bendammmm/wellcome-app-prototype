import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  hideHeader?: boolean;
  maxHeightClass?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const BottomSheetDrawer: React.FC<BottomSheetDrawerProps> = ({
  open,
  onClose,
  title,
  hideHeader = false,
  maxHeightClass = 'max-h-[86dvh]',
  footer,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end">
      {/* Scrim */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/45 animate-fade-in"
      />

      {/* Mobile full-width / Desktop 393px constrained drawer */}
      <div
        className={`relative z-10 w-full max-w-[393px] max-[480px]:max-w-full bg-white rounded-t-[16px] flex flex-col overflow-hidden animate-drawer-up shadow-2xl ${maxHeightClass}`}
      >
        {!hideHeader && (
          <div className="relative flex items-center justify-center h-[52px] px-4 shrink-0 border-b border-[#F2F2F2]">
            <button
              type="button"
              aria-label="Close drawer"
              onClick={onClose}
              className="absolute left-3.5 w-8 h-8 flex items-center justify-center rounded-full text-[#1A1A1A] active:bg-[#F5F5F5]"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <h3 className="text-[16px] font-bold text-[#1A1A1A]">{title}</h3>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>

        {footer && (
          <div className="shrink-0 bg-white border-t border-[#F0F0F0] px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
