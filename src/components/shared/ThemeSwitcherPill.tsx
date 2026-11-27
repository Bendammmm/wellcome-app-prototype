import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';
import type { AppTheme } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const THEME_OPTIONS: { id: AppTheme; label: string; dot: string }[] = [
  { id: 'we', label: 'WE', dot: '#E40032' },
  { id: 'mp-before', label: 'MP Before', dot: '#155D2D' },
  { id: 'mp-opt1', label: 'MP Opt 1', dot: '#28443C' },
];

/**
 * Floating live theme switcher pill so stakeholders can toggle
 * WE / MP Before / MP Option 1 instantaneously on any page (Home, PDP, Cart, Checkout).
 * Collapsible to a small icon button when capturing clean screenshots.
 */
export const ThemeSwitcherPill: React.FC = () => {
  const appTheme = useAppStore((s) => s.appTheme);
  const setAppTheme = useAppStore((s) => s.setAppTheme);
  const activePage = useAppStore((s) => s.activePage);
  const [collapsed, setCollapsed] = useState(false);

  const currentOpt = THEME_OPTIONS.find((t) => t.id === appTheme) ?? THEME_OPTIONS[0];
  const bottomOffsetClass =
    activePage === 'cart'
      ? 'bottom-[174px]'
      : activePage === 'checkout' || activePage === 'pdp'
        ? 'bottom-[78px]'
        : 'bottom-[126px]';

  if (collapsed) {
    return (
      <div className={`app-fixed-bar ${bottomOffsetClass} z-50 pointer-events-none flex justify-end px-2.5`}>
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Open theme switcher"
          className="pointer-events-auto h-[34px] px-2.5 rounded-full bg-[#1A1A1A]/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.28)] border border-white/15 inline-flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: currentOpt.dot }}
          />
          <span>{currentOpt.label}</span>
          <Palette className="w-3.5 h-3.5 text-white/80" />
        </button>
      </div>
    );
  }

  return (
    <div className={`app-fixed-bar ${bottomOffsetClass} z-50 pointer-events-none flex justify-center px-2`}>
      <div className="pointer-events-auto inline-flex items-center gap-1 p-1 rounded-full bg-[#1A1A1A]/92 backdrop-blur-md shadow-[0_6px_22px_rgba(0,0,0,0.28)] border border-white/15">
        {THEME_OPTIONS.map((opt) => {
          const active = appTheme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAppTheme(opt.id)}
              className={`h-[28px] px-2.5 rounded-full text-[11px] leading-none font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap ${
                active
                  ? 'bg-white text-[#1A1A1A] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: opt.dot,
                  boxShadow:
                    opt.id === 'mp-opt1' && active
                      ? '0 0 0 1.5px #DDB97D'
                      : undefined,
                }}
              />
              <span>{opt.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Minimize theme switcher"
          className="w-[24px] h-[24px] rounded-full text-white/60 hover:text-white inline-flex items-center justify-center shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
