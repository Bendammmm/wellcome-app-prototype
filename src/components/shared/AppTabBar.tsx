import React from 'react';
import { ICONS } from '../../data/catalog';
import { getTotalCartCount, useAppStore } from '../../store/useAppStore';

export const AppTabBar: React.FC = () => {
  const activePage = useAppStore((s) => s.activePage);
  const navigate = useAppStore((s) => s.navigate);
  const showToast = useAppStore((s) => s.showToast);
  const cartCount = useAppStore((s) => getTotalCartCount(s.cartItems));

  const tabs = [
    { id: 'home', label: 'Home', icon: ICONS.tabHome, active: activePage === 'home' },
    { id: 'categories', label: 'Categories', icon: ICONS.tabCategories, active: false },
    { id: 'yuuid', label: 'yuuID', icon: ICONS.tabYuuId, active: false },
    { id: 'ai', label: 'AI', icon: ICONS.tabAi, active: false },
    { id: 'cart', label: 'Cart', icon: ICONS.tabCart, active: activePage === 'cart', badge: cartCount },
    { id: 'me', label: 'Me', icon: ICONS.tabMe, active: false },
  ] as const;

  return (
    <nav className="w-full bg-white border-t border-[#EFEFEF] pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === 'home') navigate('home');
              else if (tab.id === 'cart') navigate('cart');
              else showToast(`${tab.label} is coming in the next phase`);
            }}
            className="flex flex-col items-center justify-center gap-0.5 py-0.5 relative active:opacity-75"
          >
            <div className="relative w-[28px] h-[28px] flex items-center justify-center">
              <img
                src={tab.icon}
                alt={tab.label}
                className="w-[28px] h-[28px] object-contain"
              />
              {'badge' in tab && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#E40032] text-white text-[10px] font-bold flex items-center justify-center leading-none border border-white tabular-nums">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] leading-[14px] ${
                tab.active ? 'text-[#E40032] font-semibold' : 'text-[#858585] font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
