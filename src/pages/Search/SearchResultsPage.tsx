import React, { useEffect, useMemo, useState } from 'react';
import { PRODUCTS, SEARCH_ASSETS } from '../../data/catalog';
import { getTotalCartCount, useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../../components/shared/ProductCard';
import { FilterDrawer, productMatchesFilterOption } from './FilterDrawer';
import type { Product } from '../../types';

type SortMode = 'relevance' | 'sales' | 'price_asc' | 'price_desc';

const QUICK_FILTERS = [
  {
    id: 'Organic',
    label: 'Organic',
    image: SEARCH_ASSETS.qfOrganic,
    imgClass: 'absolute h-[738.45%] left-[-231.1%] max-w-none top-[-520.61%] w-[341.23%]',
  },
  {
    id: 'Low fat',
    label: 'Low fat',
    image: SEARCH_ASSETS.qfLowfat,
    imgClass: 'absolute h-[253.51%] left-[-8.57%] max-w-none top-[-76.75%] w-[117.14%]',
  },
  {
    id: 'Milk powder',
    label: 'Milk powder',
    image: SEARCH_ASSETS.qfPowder,
    imgClass: 'w-full h-full object-cover',
  },
  {
    id: 'Fresh milk',
    label: 'Fresh milk',
    image: SEARCH_ASSETS.qfFresh,
    imgClass: 'w-full h-full object-cover',
  },
  {
    id: 'Pure milk',
    label: 'Pure milk',
    image: SEARCH_ASSETS.qfPure,
    imgClass: 'w-full h-full object-cover',
  },
];

const RELATED_SEARCHES_MILK = [
  { term: 'Milk powder', boldPart: 'Milk', rest: ' powder', boldFirst: true },
  { term: 'Chocolate milk', boldPart: 'milk', rest: 'Chocolate ', boldFirst: false },
  { term: 'Oat milk', boldPart: 'milk', rest: 'Oat ', boldFirst: false },
  { term: 'Yogurt', boldPart: '', rest: 'Yogurt', boldFirst: false },
  { term: 'Butter', boldPart: '', rest: 'Butter', boldFirst: false },
  { term: 'Nutritious breakfast', boldPart: '', rest: 'Nutritious breakfast', boldFirst: false },
];

const YOU_MAY_LIKE_IDS = [
  'belena-shiraz',
  'bin-180-wine',
  'nissin-bowl',
  'jumbo-blueberry',
  'zespri-kiwi',
  'fuji-apple',
];

function matchProductByQuery(product: Product, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const haystacks = [
    product.name,
    product.description ?? '',
    product.category,
    product.specs?.origin ?? '',
    ...(product.specs?.brandCategories ?? []),
    ...(product.searchTags ?? []),
    ...(product.promoTags ?? []),
  ]
    .join(' ')
    .toLowerCase();

  if (haystacks.includes(q)) return true;
  // Multi-word partial match (e.g. "Zespri Kiwifruit" -> matches "zespri" or "kiwi")
  const tokens = q.split(/\s+/).filter((t) => t.length >= 3);
  if (tokens.length > 1) {
    return tokens.some((tok) => haystacks.includes(tok));
  }
  return false;
}

export const SearchResultsPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const submitSearch = useAppStore((s) => s.submitSearch);
  const showToast = useAppStore((s) => s.showToast);
  const cartCount = useAppStore((s) => getTotalCartCount(s.cartItems));

  const [inputValue, setInputValue] = useState(searchQuery);
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setInputValue(searchQuery);
    setActiveQuickFilter(null);
    setSelectedFilters({});
    setSortMode('relevance');
  }, [searchQuery]);

  // Sticky note 8506:261761: show bottom divider on Filter bar when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const baseMatchedProducts = useMemo(
    () => PRODUCTS.filter((p) => matchProductByQuery(p, searchQuery)),
    [searchQuery]
  );

  const activeDrawerFilterCount = useMemo(
    () => Object.values(selectedFilters).reduce((sum, list) => sum + list.length, 0),
    [selectedFilters]
  );

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...baseMatchedProducts];

    if (activeQuickFilter) {
      list = list.filter((p) => productMatchesFilterOption(p, activeQuickFilter));
    }

    // Apply drawer filters (AND across groups, OR within a group)
    for (const options of Object.values(selectedFilters)) {
      if (options.length > 0) {
        list = list.filter((p) =>
          options.some((opt) => productMatchesFilterOption(p, opt))
        );
      }
    }

    if (sortMode === 'sales') {
      list.sort((a, b) => (b.soldCount ?? 1000) - (a.soldCount ?? 1000));
    } else if (sortMode === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [baseMatchedProducts, activeQuickFilter, selectedFilters, sortMode]);

  const youMayLikeProducts = useMemo(
    () =>
      YOU_MAY_LIKE_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
        (p): p is Product => Boolean(p)
      ),
    []
  );

  const handlePriceSortClick = () => {
    if (sortMode === 'price_asc') {
      setSortMode('price_desc');
    } else {
      setSortMode('price_asc');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      navigate('search');
      return;
    }
    submitSearch(trimmed);
  };

  const showFilterBar = baseMatchedProducts.length > 0;
  const isMilkContext = searchQuery.toLowerCase().includes('milk');

  // Split products into left/right waterfall columns matching Figma 5923:73494
  const leftCol: Product[] = [];
  const rightCol: Product[] = [];
  filteredAndSortedProducts.forEach((p, idx) => {
    if (idx % 2 === 0) leftCol.push(p);
    else rightCol.push(p);
  });

  const priceSortIcon =
    sortMode === 'price_asc'
      ? SEARCH_ASSETS.sortPriceAsc
      : sortMode === 'price_desc'
        ? SEARCH_ASSETS.sortPriceDesc
        : SEARCH_ASSETS.sortPrice;

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[36px]">
      {/* Sticky Header: Navigation search bar + Filter bar (Figma 8506:261799 + Sticky note 8506:261761) */}
      <header className="app-fixed-bar top-0 z-40 bg-white pt-[env(safe-area-inset-top)]">
        {/* Navigation row (h-[48px]) */}
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

          <div className="flex-1 h-[36px] bg-white border border-[#E0E0E0] rounded-[8px] flex items-center pl-[12px] pr-[8px] gap-[8px] min-w-0">
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
                onClick={() => {
                  setInputValue('');
                  navigate('search');
                }}
                aria-label="Clear search"
                className="w-[18px] h-[18px] rounded-full bg-[#E0E0E0] text-[#666666] text-[11px] flex items-center justify-center shrink-0"
              >
                ×
              </button>
            )}
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

        {/* Filter Bar (Figma 7567:44343..7569:127186) */}
        {showFilterBar && (
          <div
            className={`h-[40px] bg-white flex items-center transition-colors ${
              scrolled ? 'border-b border-[#E0E0E0]' : ''
            }`}
          >
            <div className="flex-1 h-full flex items-center px-[8px]">
              <button
                type="button"
                onClick={() => setSortMode('relevance')}
                className={`h-[40px] px-[8px] flex items-center justify-center text-[14px] leading-[20px] whitespace-nowrap ${
                  sortMode === 'relevance'
                    ? 'font-semibold text-[#E40032]'
                    : 'font-normal text-[#1A1A1A]'
                }`}
              >
                Relevance
              </button>

              <button
                type="button"
                onClick={() => setSortMode('sales')}
                className={`h-[40px] px-[8px] flex items-center justify-center text-[14px] leading-[20px] whitespace-nowrap ${
                  sortMode === 'sales'
                    ? 'font-semibold text-[#E40032]'
                    : 'font-normal text-[#1A1A1A]'
                }`}
              >
                Sales
              </button>

              <button
                type="button"
                onClick={handlePriceSortClick}
                className={`h-[40px] px-[8px] flex items-center justify-center gap-[2px] text-[14px] leading-[20px] whitespace-nowrap ${
                  sortMode === 'price_asc' || sortMode === 'price_desc'
                    ? 'font-semibold text-[#E40032]'
                    : 'font-normal text-[#1A1A1A]'
                }`}
              >
                <span>Price</span>
                <img
                  src={priceSortIcon}
                  alt=""
                  className="w-[14px] h-[14px] object-contain"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="w-[84px] h-[40px] px-[8px] flex items-center justify-center gap-[2px] shrink-0"
            >
              <img
                src={
                  activeDrawerFilterCount > 0
                    ? SEARCH_ASSETS.filterActive
                    : SEARCH_ASSETS.filter
                }
                alt=""
                className="w-[16px] h-[16px] object-contain shrink-0"
              />
              <span
                className={`text-[14px] leading-[20px] font-normal whitespace-nowrap ${
                  activeDrawerFilterCount > 0 ? 'text-[#E40032]' : 'text-[#1A1A1A]'
                }`}
              >
                Filter
              </span>
              {activeDrawerFilterCount > 0 && (
                <span className="min-w-[14px] h-[14px] px-[2px] rounded-full bg-[#FFCF00] border border-white text-[8px] leading-[12px] font-medium text-[#1A1A1A] flex items-center justify-center shrink-0">
                  {activeDrawerFilterCount}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className={showFilterBar ? 'pt-[88px]' : 'pt-[48px]'}>
        {/* Quick Filter Visual Row (Figma 5923:49770) — scrolls naturally under sticky bar */}
        {showFilterBar && isMilkContext && (
          <div className="flex gap-[8px] overflow-x-auto no-scrollbar pt-[12px] px-[16px] pb-[4px]">
            {QUICK_FILTERS.map((qf) => {
              const selected = activeQuickFilter === qf.id;
              return (
                <button
                  key={qf.id}
                  type="button"
                  onClick={() =>
                    setActiveQuickFilter(selected ? null : qf.id)
                  }
                  className="flex flex-col items-center gap-[2px] shrink-0"
                >
                  <div
                    className={`relative w-[64px] h-[64px] rounded-[4px] bg-white overflow-hidden border transition-colors ${
                      selected ? 'border-[#E40032] bg-[#FFF6F5]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={qf.image}
                      alt={qf.label}
                      className={qf.imgClass}
                    />
                  </div>
                  <span
                    className={`py-[4px] text-[10px] leading-[14px] font-medium whitespace-nowrap ${
                      selected ? 'text-[#E40032] font-semibold' : 'text-[#1A1A1A]'
                    }`}
                  >
                    {qf.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Waterfall Grid OR Empty State */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="p-[8px] flex gap-[8px] items-start">
            {/* Left Column */}
            <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
              {leftCol.map((product) => (
                <ProductCard key={product.id} product={product} variant="grid" />
              ))}
            </div>

            {/* Right Column (with inline "Do you mean..." card after 2nd card matching Figma 5923:73494) */}
            <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
              {rightCol.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} variant="grid" />
              ))}

              {/* Inline "Do you mean..." Card (Figma 5923:73226) */}
              {isMilkContext && (
                <div className="bg-white rounded-[8px] p-[8px] flex flex-col gap-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="py-[4px]">
                    <h3 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                      Do you mean...
                    </h3>
                  </div>
                  <div className="flex flex-col items-start gap-[8px]">
                    {RELATED_SEARCHES_MILK.map((item) => (
                      <button
                        key={item.term}
                        type="button"
                        onClick={() => submitSearch(item.term)}
                        className="bg-[#F7F7F7] h-[32px] min-w-[64px] px-[12px] rounded-full text-[12px] leading-[16px] text-[#1A1A1A] flex items-center justify-center active:bg-[#EAEAEA] transition-colors"
                      >
                        {item.boldPart ? (
                          item.boldFirst ? (
                            <span>
                              <strong className="font-bold">{item.boldPart}</strong>
                              {item.rest}
                            </span>
                          ) : (
                            <span>
                              {item.rest}
                              <strong className="font-bold">{item.boldPart}</strong>
                            </span>
                          )
                        ) : (
                          <span>{item.rest}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {rightCol.slice(2).map((product) => (
                <ProductCard key={product.id} product={product} variant="grid" />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State + You May Like (Figma 5923:77223) */
          <div className="flex flex-col items-center">
            <section className="w-full py-[24px] flex items-center justify-center">
              <div className="w-[240px] flex flex-col items-center justify-center gap-[16px] text-center">
                <div className="w-[120px] h-[120px] flex items-center justify-center">
                  <div className="relative w-[119px] h-[103px] overflow-hidden">
                    <img
                      src={SEARCH_ASSETS.emptyBag}
                      alt="No products found"
                      className="absolute h-[207.92%] left-[-31.79%] max-w-none top-[-40.41%] w-[163.57%]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                    Can&apos;t find it? Tell us what you need.
                  </h2>
                  <p className="text-[12px] leading-[16px] font-normal text-[#969696]">
                    Tell us what you&apos;d like to buy, and we&apos;ll see if we can bring it to our store.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-[8px]">
                  <button
                    type="button"
                    onClick={() =>
                      showToast("Thanks! We've logged your product request.")
                    }
                    className="bg-[#E40032] h-[32px] px-[12px] rounded-[4px] text-white text-[12px] leading-[16px] font-semibold flex items-center justify-center active:opacity-90"
                  >
                    Contact Us
                  </button>
                  {(activeQuickFilter || activeDrawerFilterCount > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuickFilter(null);
                        setSelectedFilters({});
                      }}
                      className="text-[12px] leading-[16px] font-semibold text-[#E40032] underline"
                    >
                      Clear active filters
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* You May Like 2-Column Feed (Figma 5923:79481) */}
            <section className="w-full px-[8px] flex flex-col gap-[8px]">
              <div className="px-[8px] py-[12px]">
                <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                  You May Like
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-[8px]">
                {youMayLikeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant="grid" />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet Drawer (Figma 7569:178191 / 7583:80589) */}
      <FilterDrawer
        open={filterDrawerOpen}
        selectedFilters={selectedFilters}
        baseProducts={baseMatchedProducts}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(next) => setSelectedFilters(next)}
      />
    </div>
  );
};
