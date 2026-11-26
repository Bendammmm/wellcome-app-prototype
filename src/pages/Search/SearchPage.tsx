import React, { useState } from 'react';
import { PRODUCTS, SEARCH_ASSETS } from '../../data/catalog';
import { getTotalCartCount, useAppStore } from '../../store/useAppStore';
import { PriceBlock } from '../../components/shared/PriceBlock';
import { ProductAddControl } from '../../components/shared/ProductAddControl';

const DISCOVER_TERMS = [
  'Buy Cognac, Get 2 Bottles of Red or White Wine',
  'Mooncake Offers',
  'Zespri Kiwifruit',
  'Milk',
];

const TRENDING_CAMPAIGNS = [
  {
    id: 'camp-1',
    title: 'Chocolate butter roll',
    subtitle: 'French classic, with 24 layers of laminated pastry for crispness in every layer.',
    image: SEARCH_ASSETS.campaign1,
    query: 'Milk',
  },
  {
    id: 'camp-2',
    title: 'Raw chocolate lava cake',
    subtitle: 'Celebrate Mid-Autumn Together',
    image: SEARCH_ASSETS.campaign2,
    query: 'Cheese',
  },
  {
    id: 'camp-3',
    title: 'Quick breakfast dish',
    subtitle: 'Thick-cut bread special',
    image: SEARCH_ASSETS.campaign3,
    query: 'Milk',
  },
  {
    id: 'camp-4',
    title: 'Seafood hot pot',
    subtitle:
      'Low in fat and high in protein! A selection of 5 ingredients including black tiger shrimp and baby squid.',
    image: SEARCH_ASSETS.campaign4,
    query: 'Beef',
  },
  {
    id: 'camp-5',
    title: 'Selected kiwi fruit',
    subtitle: 'Imported Thai kiwi, fragrant and delicious',
    image: SEARCH_ASSETS.campaign5,
    productId: 'zespri-kiwi',
  },
];

const TOP_MEAT_IDS = [
  'aus-ribeye-200g',
  'peppercorn-beef-burgers',
  'imported-ribeye-800g',
  'us-beef-blade',
];

export const SearchPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const searchHistory = useAppStore((s) => s.searchHistory);
  const submitSearch = useAppStore((s) => s.submitSearch);
  const clearSearchHistory = useAppStore((s) => s.clearSearchHistory);
  const cartCount = useAppStore((s) => getTotalCartCount(s.cartItems));

  const [inputValue, setInputValue] = useState('');

  const topMeatProducts = TOP_MEAT_IDS.map((id) =>
    PRODUCTS.find((p) => p.id === id)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const term = inputValue.trim() || 'Milk';
    submitSearch(term);
  };

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[32px]">
      {/* Fixed Navigation Search Bar (Figma 6834:66928) */}
      <header className="app-fixed-bar top-0 z-40 bg-white pt-[env(safe-area-inset-top)]">
        <form
          onSubmit={handleSearchSubmit}
          className="h-[48px] px-[12px] flex items-center gap-[8px]"
        >
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="w-[36px] h-[40px] flex items-center justify-center shrink-0"
          >
            <img
              src={SEARCH_ASSETS.chevronLeft}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
          </button>

          <div className="flex-1 h-[36px] bg-white border border-[#E0E0E0] rounded-[8px] flex items-center overflow-hidden min-w-0">
            <div className="flex-1 h-full flex items-center gap-[8px] pl-[12px] pr-[6px] min-w-0">
              <img
                src={SEARCH_ASSETS.search}
                alt=""
                className="w-[16px] h-[16px] shrink-0 object-contain"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className="flex-1 min-w-0 bg-transparent text-[14px] leading-[20px] text-[#1A1A1A] placeholder:text-[#858585] outline-none"
              />
              {inputValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setInputValue('')}
                  aria-label="Clear input"
                  className="w-[18px] h-[18px] rounded-full bg-[#E0E0E0] text-[#666666] text-[11px] flex items-center justify-center shrink-0"
                >
                  ×
                </button>
              )}
            </div>

            <div className="h-full flex items-center pr-[4px] py-[4px] shrink-0">
              <button
                type="submit"
                className="h-[28px] min-w-[64px] px-[12px] rounded-[4px] bg-[#FFF6F5] text-[#E40032] text-[12px] leading-[16px] font-semibold flex items-center justify-center active:opacity-80"
              >
                Search
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('cart')}
            aria-label="Cart"
            className="relative w-[36px] h-[40px] flex items-center justify-center shrink-0"
          >
            <img
              src={SEARCH_ASSETS.cartEntry}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
            {cartCount > 0 && (
              <span className="absolute top-[2px] right-0 min-w-[14px] h-[14px] px-[2px] rounded-full bg-[#FFCF00] border border-white text-[9px] leading-[12px] font-medium text-[#1A1A1A] flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </form>
      </header>

      {/* Main Search Entry Content (Figma 5908:440003) */}
      <div className="pt-[56px] px-[12px] flex flex-col gap-[16px]">
        {/* Search History — Hidden completely when empty per Figma sticky note 8021:103680 */}
        {searchHistory.length > 0 && (
          <section className="flex flex-col gap-[8px]">
            <div className="h-[40px] py-[8px] flex items-center justify-between">
              <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                Search history
              </h2>
              <button
                type="button"
                onClick={clearSearchHistory}
                aria-label="Clear search history"
                className="w-[24px] h-[24px] flex items-center justify-center active:opacity-60"
              >
                <img
                  src={SEARCH_ASSETS.trash}
                  alt=""
                  className="w-[24px] h-[24px] object-contain"
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-[8px]">
              {searchHistory.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => submitSearch(term)}
                  className="bg-white h-[32px] min-w-[64px] px-[12px] rounded-full text-[12px] leading-[16px] font-normal text-[#1A1A1A] flex items-center justify-center active:bg-[#EFEFEF] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Discover Section (Figma 5908:440020) */}
        <section className="flex flex-col gap-[8px]">
          <div className="h-[40px] py-[8px] flex items-center justify-between">
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
              Discover
            </h2>
          </div>

          <div className="flex flex-wrap gap-[8px]">
            {DISCOVER_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => submitSearch(term)}
                className="bg-white h-[32px] min-w-[64px] px-[12px] rounded-full text-[12px] leading-[16px] font-normal text-[#1A1A1A] flex items-center justify-center text-left active:bg-[#EFEFEF] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </section>

        {/* Ranking Horizontal Carousel (Figma 8506:124186) */}
        <section className="-mx-[12px] px-[12px] py-[12px] flex gap-[12px] overflow-x-auto no-scrollbar">
          {/* Card 1: Trending picks (Figma 8506:124187) */}
          <div
            className="w-[280px] shrink-0 rounded-[12px] border-2 border-white overflow-hidden relative flex flex-col"
            style={{
              backgroundImage:
                'linear-gradient(208.39deg, #FFE2E0 9.81%, #FFFFFF 30.65%)',
            }}
          >
            {/* Decorative Trophy Watermark */}
            <img
              src={SEARCH_ASSETS.rankingBg1}
              alt=""
              aria-hidden="true"
              className="absolute left-[101px] top-[-34px] w-[99px] h-[99px] rotate-[19.46deg] opacity-10 object-cover pointer-events-none"
            />

            {/* Module Header */}
            <div className="p-[12px] flex items-center justify-between relative z-10">
              <h3 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                Trending picks
              </h3>
              <button
                type="button"
                onClick={() => submitSearch('Milk')}
                className="h-[24px] flex items-center gap-[4px] text-[12px] leading-[16px] font-semibold text-[#666666]"
              >
                <span>See all</span>
                <img
                  src={SEARCH_ASSETS.seeAllChevron}
                  alt=""
                  className="w-[16px] h-[16px] object-contain"
                />
              </button>
            </div>

            {/* Campaign List (Figma 7130:304768) */}
            <div className="flex flex-col relative z-10">
              {TRENDING_CAMPAIGNS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.productId) {
                      navigate('pdp', item.productId);
                    } else if (item.query) {
                      submitSearch(item.query);
                    }
                  }}
                  className="h-[88px] px-[12px] py-[8px] flex items-center gap-[8px] text-left active:bg-black/[0.02] transition-colors"
                >
                  <div className="w-[64px] h-[64px] rounded-[8px] overflow-hidden shrink-0 bg-[#F7F7F7]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                    <p className="text-[14px] leading-[20px] font-semibold text-[#1A1A1A] truncate">
                      {item.title}
                    </p>
                    <p className="text-[12px] leading-[16px] font-normal text-[#3D3D3D] line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Top Meat (Figma 8506:124196) */}
          <div
            className="w-[280px] shrink-0 rounded-[12px] border-2 border-white overflow-hidden relative flex flex-col"
            style={{
              backgroundImage:
                'linear-gradient(208.39deg, #FFFCF4 9.81%, #FFFFFF 30.65%)',
            }}
          >
            {/* Decorative Watermark */}
            <img
              src={SEARCH_ASSETS.rankingBg2}
              alt=""
              aria-hidden="true"
              className="absolute left-[101px] top-[-34px] w-[99px] h-[99px] rotate-[19.46deg] opacity-[0.12] object-cover pointer-events-none"
            />

            {/* Module Header */}
            <div className="p-[12px] flex items-center justify-between relative z-10">
              <h3 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                Top Meat
              </h3>
              <button
                type="button"
                onClick={() => submitSearch('Beef')}
                className="h-[24px] flex items-center gap-[4px] text-[12px] leading-[16px] font-semibold text-[#666666]"
              >
                <span>See all</span>
                <img
                  src={SEARCH_ASSETS.seeAllChevron}
                  alt=""
                  className="w-[16px] h-[16px] object-contain"
                />
              </button>
            </div>

            {/* Meat Product Rows */}
            <div className="flex flex-col px-[4px] pb-[8px] relative z-10">
              {topMeatProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate('pdp', product.id)}
                  className="flex items-start gap-[8px] pt-[8px] pb-[4px] pl-[8px] pr-[4px] cursor-pointer active:bg-black/[0.02]"
                >
                  <div className="w-[64px] h-[64px] rounded-[4px] bg-white overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[76px]">
                    <p className="text-[14px] leading-[20px] font-normal text-[#1A1A1A] line-clamp-2 pr-[4px]">
                      {product.name}
                    </p>
                    <div className="relative flex items-end min-h-[32px] pt-[4px]">
                      <PriceBlock price={product.price} size="md" />
                      <ProductAddControl
                        productId={product.id}
                        disabled={product.isOutOfStock}
                        className="absolute bottom-0 right-0 z-10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
