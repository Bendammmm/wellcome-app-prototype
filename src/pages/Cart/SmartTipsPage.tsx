import React, { useMemo, useState } from 'react';
import { ICONS, PRODUCTS } from '../../data/catalog';
import { getTotalCartCount, useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../../components/shared/ProductCard';
import { ThresholdProgressBar } from '../../components/shared/ThresholdProgressBar';

type PriceRange = 'all' | 'under20' | '20to60' | '60to100' | 'over100';
type SortKey = 'relevance' | 'sales' | 'price_asc' | 'price_desc';

const RANGE_OPTIONS: { id: PriceRange; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'under20', label: 'below $20' },
  { id: '20to60', label: '$20-$60' },
  { id: '60to100', label: '$60-$100' },
  { id: 'over100', label: 'above $100' },
];

export const SmartTipsPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const cartCount = useAppStore((s) => getTotalCartCount(s.cartItems));

  const [range, setRange] = useState<PriceRange>('all');
  const [sort, setSort] = useState<SortKey>('relevance');

  const items = useMemo(() => {
    const filtered = PRODUCTS.filter((p) => {
      if (range === 'under20') return p.price < 20;
      if (range === '20to60') return p.price >= 20 && p.price <= 60;
      if (range === '60to100') return p.price > 60 && p.price <= 100;
      if (range === 'over100') return p.price > 100;
      return true;
    });

    if (sort === 'price_asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === 'sales') return [...filtered].reverse();
    return filtered;
  }, [range, sort]);

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-8">
      {/* Top NavigationBar (Figma 7406:228212 — 48px row) */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#EFEFEF] pt-[env(safe-area-inset-top)]">
        <div className="h-[48px] px-[12px] flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="w-[36px] h-[36px] flex items-center justify-center"
          >
            <img src={ICONS.chevronLeft} alt="" className="w-[28px] h-[28px] object-contain" />
          </button>

          <h1 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">Smart Tips</h1>

          <button
            type="button"
            onClick={() => navigate('cart')}
            aria-label="Go to cart"
            className="relative w-[36px] h-[36px] flex items-center justify-center"
          >
            <img src={ICONS.tabCart} alt="Cart" className="w-[24px] h-[24px] object-contain" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[#E40032] text-white text-[10px] font-bold flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Expanded 3-Milestone Progress Card */}
      <div className="bg-white px-[12px] pt-[12px] pb-[12px]">
        <ThresholdProgressBar variant="expanded" />
      </div>

      {/* Quick Filter Bar (Figma 7406:228238) */}
      <div className="bg-white px-[12px] py-[8px] flex gap-[8px] overflow-x-auto no-scrollbar">
        {RANGE_OPTIONS.map((opt) => {
          const active = range === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRange(opt.id)}
              className={`h-[32px] min-w-[64px] px-[12px] rounded-full text-[12px] leading-[16px] shrink-0 transition-colors ${
                active
                  ? 'border border-[#E40032] text-[#E40032] bg-white font-bold'
                  : 'border border-transparent text-[#1A1A1A] bg-[#F7F7F7] font-normal'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Sort Bar (Figma 7406:228244) */}
      <div className="bg-white h-[40px] px-[16px] flex items-center gap-[24px] text-[14px] leading-[20px]">
        <button
          type="button"
          onClick={() => setSort('relevance')}
          className={sort === 'relevance' ? 'text-[#E40032] font-normal' : 'text-[#1A1A1A] font-normal'}
        >
          Relevance
        </button>
        <button
          type="button"
          onClick={() => setSort('sales')}
          className={sort === 'sales' ? 'text-[#E40032] font-normal' : 'text-[#1A1A1A] font-normal'}
        >
          Sales
        </button>
        <button
          type="button"
          onClick={() => setSort((s) => (s === 'price_asc' ? 'price_desc' : 'price_asc'))}
          className={`inline-flex items-center gap-[2px] ${
            sort === 'price_asc' || sort === 'price_desc'
              ? 'text-[#E40032] font-normal'
              : 'text-[#1A1A1A] font-normal'
          }`}
        >
          <span>Price</span>
          <img
            src={ICONS.priceSort}
            alt=""
            className={`w-[14px] h-[14px] object-contain transition-transform ${
              sort === 'price_desc' ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* 2-Column Add-on Product Grid */}
      <div className="p-2.5 grid grid-cols-2 gap-2">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} variant="grid" />
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center text-[13px] text-[#858585]">
          No items in this price range. Try &ldquo;All&rdquo;.
        </div>
      )}
    </div>
  );
};
