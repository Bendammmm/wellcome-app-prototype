import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { ASSETS, ICONS, PRODUCTS } from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import { AppTabBar } from '../../components/shared/AppTabBar';
import { ProductCard } from '../../components/shared/ProductCard';
import { ThresholdProgressBar } from '../../components/shared/ThresholdProgressBar';

const ME_ASSETS = {
  qrYuu: '/assets/figma/me/qr-yuu.png',
  settings: '/assets/figma/me/settings.svg',
  wallet: '/assets/figma/me/wallet.svg',
  truck: '/assets/figma/me/truck.svg',
  package: '/assets/figma/me/package.svg',
  refund: '/assets/figma/me/refund.svg',
  creditCard: '/assets/figma/me/credit-card.svg',
  heart: '/assets/figma/me/heart.svg',
  helpAgent: '/assets/figma/me/help-agent.svg',
  survey: '/assets/figma/me/survey.svg',
  searchRed: '/assets/figma/me/search-red.svg',
};

export const MePage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const coupons = useAppStore((s) => s.coupons);
  const wishlistIds = useAppStore((s) => s.wishlistIds);
  const orders = useAppStore((s) => s.orders);
  const showToast = useAppStore((s) => s.showToast);

  const claimedCouponsCount = Math.max(2, coupons.filter((c) => c.claimed).length);

  const youMayLike = PRODUCTS.filter((p) =>
    ['belena-shiraz', 'bin-180-wine', 'nissin-bowl', 'jumbo-blueberry', 'zespri-kiwi', 'fuji-apple'].includes(
      p.id
    )
  );

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[118px]">
      {/* Top Navigation Bar (Figma 6860:81578) */}
      <header className="sticky top-0 z-30 bg-[#F7F7F7]/95 backdrop-blur-xs px-[12px] pt-[max(12px,env(safe-area-inset-top))] pb-[8px] flex items-center justify-between">
        <div className="w-[32px]" />
        <h1 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">Me</h1>
        <button
          type="button"
          onClick={() => showToast('Account settings')}
          aria-label="Settings"
          className="w-[32px] h-[32px] flex items-center justify-center active:opacity-70"
        >
          <img src={ME_ASSETS.settings} alt="Settings" className="w-[24px] h-[24px] object-contain" />
        </button>
      </header>

      <div className="px-[12px] space-y-[12px]">
        {/* User Greeting + yuu Points + QR Code */}
        <section className="pt-[4px] flex items-center justify-between gap-[12px]">
          <div className="space-y-[10px] min-w-0">
            <h2 className="text-[18px] leading-[24px] font-bold text-[#1A1A1A]">Hello Lucy</h2>
            <button
              type="button"
              onClick={() => navigate('yuu-id')}
              className="inline-flex items-center gap-[6px] bg-white rounded-[8px] px-[10px] py-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform"
            >
              <span className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">1,110,316</span>
              <img src={ASSETS.yuuCoin} alt="yuu" className="w-[18px] h-[18px] object-contain" />
              <span className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">= &#36;112,123</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('yuu-id')}
            className="flex flex-col items-center gap-[4px] shrink-0 active:opacity-80"
          >
            <div className="w-[82px] h-[82px] rounded-[8px] bg-white p-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <img
                src={ME_ASSETS.qrYuu}
                alt="yuu QR"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="inline-flex items-center gap-[3px] text-[11px] leading-[14px] text-[#3D3D3D]">
              <img src={ME_ASSETS.searchRed} alt="" className="w-[12px] h-[12px] object-contain" />
              Details
            </span>
          </button>
        </section>

        {/* 4-Column Wallet Stats */}
        <section className="grid grid-cols-4 gap-[4px] py-[4px]">
          {[
            { count: claimedCouponsCount, label: 'Coupon' },
            { count: 3, label: 'Cash Voucher' },
            { count: 3, label: 'eStamp' },
            { count: 3, label: 'Redemption Voucher' },
          ].map((stat) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => showToast(`${stat.label}: ${stat.count} available`)}
              className="flex flex-col items-center text-center gap-[2px] active:opacity-75"
            >
              <span className="text-[15px] leading-[20px] font-bold text-[#1A1A1A]">
                {stat.count}
              </span>
              <span className="text-[11px] leading-[14px] text-[#666666]">{stat.label}</span>
            </button>
          ))}
        </section>

        {/* My Orders Card */}
        <section className="bg-white rounded-[12px] p-[12px] space-y-[12px]">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] leading-[20px] font-bold text-[#1A1A1A]">
              My Orders
              {orders.length > 0 && (
                <span className="ml-1.5 text-[11px] font-semibold text-[#E40032]">
                  ({orders.length} new)
                </span>
              )}
            </h3>
            <button
              type="button"
              onClick={() => navigate('order-list')}
              className="inline-flex items-center gap-[2px] text-[12px] leading-[16px] text-[#666666]"
            >
              <span>View All</span>
              <img src={ICONS.chevronRight} alt="" className="w-[14px] h-[14px] object-contain" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-[4px]">
            {[
              { label: 'To Pay', icon: ME_ASSETS.wallet },
              { label: 'To Ship', icon: ME_ASSETS.truck },
              { label: 'To Receive', icon: ME_ASSETS.package },
              { label: 'To Review', icon: null },
              { label: 'Refund', icon: ME_ASSETS.refund },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate('order-list')}
                className="flex flex-col items-center gap-[6px] py-[4px] active:opacity-75"
              >
                {item.icon ? (
                  <img src={item.icon} alt={item.label} className="w-[24px] h-[24px] object-contain" />
                ) : (
                  <MessageSquareText className="w-[22px] h-[22px] text-[#1A1A1A]" strokeWidth={1.8} />
                )}
                <span className="text-[11px] leading-[14px] text-[#3D3D3D] whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Services Card */}
        <section className="bg-white rounded-[12px] p-[12px]">
          <div className="grid grid-cols-4 gap-[4px]">
            {[
              { label: 'My Card', icon: ME_ASSETS.creditCard, onClick: () => navigate('yuu-id') },
              {
                label: 'My list',
                icon: ME_ASSETS.heart,
                badge: wishlistIds.length,
                onClick: () => showToast(`My list (${wishlistIds.length} saved items)`),
              },
              {
                label: 'Help Center',
                icon: ME_ASSETS.helpAgent,
                onClick: () => showToast('Help Center · 24/7 Support'),
              },
              {
                label: 'Survey',
                icon: ME_ASSETS.survey,
                onClick: () => showToast('Thank you for your feedback!'),
              },
            ].map((srv) => (
              <button
                key={srv.label}
                type="button"
                onClick={srv.onClick}
                className="flex flex-col items-center gap-[6px] py-[4px] relative active:opacity-75"
              >
                <div className="relative">
                  <img src={srv.icon} alt={srv.label} className="w-[24px] h-[24px] object-contain" />
                  {srv.badge !== undefined && srv.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 rounded-full bg-[#E40032] text-white text-[9px] font-bold flex items-center justify-center">
                      {srv.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-[14px] text-[#3D3D3D] whitespace-nowrap">
                  {srv.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* You May Like 2-Column Grid */}
        <section className="pt-[4px]">
          <h3 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A] mb-[10px]">
            You May Like
          </h3>
          <div className="grid grid-cols-2 gap-[8px]">
            {youMayLike.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        </section>
      </div>

      {/* Fixed Bottom Threshold + TabBar */}
      <div className="app-fixed-bar bottom-0 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <ThresholdProgressBar
          variant="compact"
          onClick={() => navigate('smart-tips')}
        />
        <AppTabBar />
      </div>
    </div>
  );
};
