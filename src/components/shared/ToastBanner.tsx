import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const ToastBanner: React.FC = () => {
  const toast = useAppStore((s) => s.toast);
  const dismissToast = useAppStore((s) => s.dismissToast);

  if (!toast) return null;

  return (
    <div className="fixed top-[68px] left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-32px)] max-w-[361px] pointer-events-none flex justify-center animate-fade-in">
      <div className="pointer-events-auto bg-[#1A1A1A]/92 text-white text-[13px] leading-[18px] px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3">
        <span>{toast.text}</span>
        {toast.undoLabel && toast.onUndo && (
          <button
            type="button"
            onClick={() => {
              toast.onUndo?.();
              dismissToast();
            }}
            className="text-[#FFCF00] font-bold underline shrink-0"
          >
            {toast.undoLabel}
          </button>
        )}
      </div>
    </div>
  );
};
