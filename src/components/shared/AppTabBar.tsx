import React from 'react';
import { ICONS } from '../../data/catalog';
import { getTotalCartCount, useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';

export const AppTabBar: React.FC = () => {
  const activePage = useAppStore((s) => s.activePage);
  const navigate = useAppStore((s) => s.navigate);
  const showToast = useAppStore((s) => s.showToast);
  const cartCount = useAppStore((s) => getTotalCartCount(s.cartItems));
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);

  const tabs = [
    { id: 'home', label: 'Home', icon: ICONS.tabHome, active: activePage === 'home' },
    { id: 'categories', label: 'Categories', icon: ICONS.tabCategories, active: activePage === 'categories' },
    { id: 'yuuid', label: 'yuuID', icon: ICONS.tabYuuId, active: activePage === 'yuu-id' },
    { id: 'ai', label: 'AI', icon: ICONS.tabAi, active: false },
    { id: 'cart', label: 'Cart', icon: ICONS.tabCart, active: activePage === 'cart', badge: cartCount },
    { id: 'me', label: 'Me', icon: ICONS.tabMe, active: activePage === 'me' || activePage === 'order-list' || activePage === 'order-detail' },
  ] as const;

  return (
    <nav
      className="w-full pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] transition-colors duration-200"
      style={{
        backgroundColor: t.tabBarBg,
        borderTop: t.isMp ? '1px solid rgba(255,255,255,0.08)' : '1px solid #EFEFEF',
      }}
    >
      <div className="grid grid-cols-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === 'home') navigate('home');
              else if (tab.id === 'categories') navigate('categories');
              else if (tab.id === 'yuuid') navigate('yuu-id');
              else if (tab.id === 'cart') navigate('cart');
              else if (tab.id === 'me') navigate('me');
              else showToast(`${tab.label} assistant coming soon`);
            }}
            className="flex flex-col items-center justify-center gap-0.5 py-0.5 relative active:opacity-75"
          >
            <div className="relative w-[28px] h-[28px] flex items-center justify-center">
              <span
                role="img"
                aria-label={tab.label}
                className="block w-[28px] h-[28px] transition-colors"
                style={{
                  backgroundColor: tab.active ? t.tabBarActive : t.tabBarInactive,
                  WebkitMaskImage: `url(${tab.icon})`,
                  maskImage: `url(${tab.icon})`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
              {'badge' in tab && tab.badge > 0 && (
                <span
                  className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center leading-none tabular-nums"
                  style={{
                    backgroundColor: t.isMpOpt1 ? '#DDB97D' : t.isMpBefore ? '#FFFFFF' : '#E40032',
                    color: t.isMp ? '#1A1A1A' : '#FFFFFF',
                    border: `1px solid ${t.tabBarBg}`,
                  }}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] leading-[14px] ${
                tab.active ? 'font-semibold' : 'font-medium'
              }`}
              style={{
                color: tab.active ? t.tabBarActive : t.tabBarInactive,
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
