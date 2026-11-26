import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AUTH_ASSETS } from './authAssets';

/**
 * Figma node: 3330:73917 ('Splash Screen', 375x812)
 * - Clean white full-bleed canvas
 * - 96x96 #E40032 rounded-[16px] Wellcome icon with 62.42x64px SVG brand mark
 * - Bottom 64x64 #2A7DE1 yuu ID circular badge with 28x28 QR code SVG + 'yuu ID' label
 * - Supports tap-to-enter (to Login or Home) and smooth optional auto-transition
 */
export const SplashPage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const authUser = useAppStore((s) => s.authUser);
  const showToast = useAppStore((s) => s.showToast);

  const [exiting, setExiting] = useState(false);
  const transitionedRef = useRef(false);

  const enterApp = (target?: 'login' | 'home', toastText?: string) => {
    if (transitionedRef.current) return;
    transitionedRef.current = true;
    setExiting(true);
    const destination = target ?? (authUser ? 'home' : 'login');
    window.setTimeout(() => {
      navigate(destination);
      if (toastText) {
        showToast(toastText);
      }
    }, 240);
  };

  // Gentle auto-transition after 6s if the user doesn't tap first
  useEffect(() => {
    const timer = window.setTimeout(() => {
      enterApp();
    }, 6000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Enter Wellcome App"
      onClick={() => enterApp()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          enterApp();
        }
      }}
      className={`min-h-dvh w-full bg-white relative flex flex-col items-center justify-between select-none cursor-pointer transition-opacity duration-250 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Center-top Wellcome Banner Logo (Figma: py-[245px] on 812px viewport ≈ 30.2vh) */}
      <div className="w-full flex items-start justify-center pt-[min(245px,30.2dvh)]">
        <div
          className="bg-[#E40032] relative rounded-[16px] overflow-hidden shrink-0 size-[96px] active:scale-95 transition-transform"
          data-node-id="I3330:73917;17127:66107"
        >
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[64px] left-[calc(50%+0.21px)] top-1/2 w-[62.419px]">
            <img
              src={AUTH_ASSETS.splashWellcomeLogo}
              alt="Wellcome 惠康"
              className="block size-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Bottom yuu ID circular badge (Figma: 6240:119384, bottom-[38px]) */}
      <div className="pb-[max(38px,calc(env(safe-area-inset-bottom)+24px))] flex flex-col items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            enterApp(
              authUser ? 'home' : 'login',
              authUser ? 'yuu ID linked' : 'Sign in to link your yuu ID'
            );
          }}
          aria-label="yuu ID"
          className="bg-[#2A7DE1] border-2 border-white relative rounded-full size-[64px] active:scale-95 transition-transform"
          data-node-id="6240:119384"
        >
          <span
            className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 p-[2px] top-[calc(50%-8px)]"
            aria-hidden="true"
          >
            <img
              src={AUTH_ASSETS.yuuQrCode}
              alt=""
              className="block size-[28px] object-contain"
            />
          </span>
          <span className="absolute inset-[65.63%_12%_18%_12%] flex items-center justify-center font-black text-[12px] leading-[14px] tracking-[-0.36px] text-white whitespace-nowrap">
            yuu ID
          </span>
        </button>
      </div>
    </div>
  );
};
