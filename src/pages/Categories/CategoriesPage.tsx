import React, { useMemo, useState } from 'react';
import { ICONS, PRODUCTS } from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import type { Product } from '../../types';
import { AppTabBar } from '../../components/shared/AppTabBar';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { PriceBlock } from '../../components/shared/PriceBlock';
import { ProductAddControl } from '../../components/shared/ProductAddControl';
import { PromoTag } from '../../components/shared/PromoTag';
import { ThresholdProgressBar } from '../../components/shared/ThresholdProgressBar';

const CAT_ASSETS = {
  fresh: '/assets/figma/categories/cat-fresh.png',
  wine: '/assets/figma/categories/cat-wine.png',
  beverages: '/assets/figma/categories/cat-beverages.png',
  home: '/assets/figma/categories/cat-home.png',
  frozen: '/assets/figma/categories/cat-frozen.png',
  banner: '/assets/figma/categories/cat-banner.png',
  filterHorizontal: '/assets/figma/categories/filter-horizontal.svg',
  ribeye200: '/assets/figma/categories/prod-ribeye-200g.png',
  burgers: '/assets/figma/categories/prod-burgers.png',
  ribeye800: '/assets/figma/categories/prod-ribeye-800g.png',
};

interface TopCategory {
  id: string;
  label: string;
  image: string;
  bg: string;
  subCategories: string[];
}

const TOP_CATEGORIES: TopCategory[] = [
  {
    id: 'fresh',
    label: 'Fresh',
    image: CAT_ASSETS.fresh,
    bg: '#DDF6DF',
    subCategories: ['Fruit', 'Veg & Salads', 'Mushrooms', 'Rice', 'Canned & Dried', 'Frozen', 'Wine Offers'],
  },
  {
    id: 'wine',
    label: 'Beer, Wine, Spirits',
    image: CAT_ASSETS.wine,
    bg: '#FFF2CC',
    subCategories: ['Red Wine', 'Case Deals', 'White Wine', 'Sparkling', 'Beer & Cider', 'Spirits'],
  },
  {
    id: 'beverages',
    label: 'Beverages',
    image: CAT_ASSETS.beverages,
    bg: '#DCF6EE',
    subCategories: ['Soft Drinks', 'Tea & Coffee', 'Juice', 'Water', 'Energy Drinks'],
  },
  {
    id: 'home',
    label: 'Home Essentials',
    image: CAT_ASSETS.home,
    bg: '#E8E4FA',
    subCategories: ['Cleaning', 'Paper Goods', 'Laundry', 'Kitchen', 'Bath'],
  },
  {
    id: 'frozen',
    label: 'Frozen Food',
    image: CAT_ASSETS.frozen,
    bg: '#FFF1DE',
    subCategories: ['Beef & Meat', 'Seafood', 'Dim Sum', 'Ice Cream', 'Ready Meals'],
  },
];

const EXPANDED_GRID_CATEGORIES = [
  { id: 'fresh', label: 'Rice, Oil & Noodles', image: CAT_ASSETS.fresh },
  { id: 'home', label: 'Canned, Preserved, Dry Food', image: CAT_ASSETS.home },
  { id: 'beverages', label: 'Condiment, Sauce & Soup', image: CAT_ASSETS.beverages },
  { id: 'home', label: 'Outdoor Travel & Sundries', image: CAT_ASSETS.home },
  { id: 'frozen', label: 'Meat & Seafood', image: CAT_ASSETS.ribeye200 },
  { id: 'fresh', label: 'Fruits & Vegetables', image: CAT_ASSETS.fresh },
  { id: 'frozen', label: 'Seasonal Items', image: CAT_ASSETS.frozen },
  { id: 'home', label: 'Kitchen & Dining', image: CAT_ASSETS.home },
  { id: 'home', label: 'Beauty & Personal Care', image: CAT_ASSETS.home },
  { id: 'home', label: 'Household Supplies', image: CAT_ASSETS.home },
  { id: 'fresh', label: 'Dairy, Chilled & Eggs', image: CAT_ASSETS.fresh },
  { id: 'beverages', label: 'Choco, Chips, Snacks', image: CAT_ASSETS.beverages },
  { id: 'beverages', label: 'Beverages', image: CAT_ASSETS.beverages },
  { id: 'wine', label: 'Wines, Beers & Spirits', image: CAT_ASSETS.wine },
  { id: 'home', label: 'Health', image: CAT_ASSETS.home },
  { id: 'fresh', label: 'Bakery & Breakfast', image: CAT_ASSETS.fresh },
  { id: 'frozen', label: 'Frozen Food', image: CAT_ASSETS.frozen },
  { id: 'home', label: 'Mother & Baby', image: CAT_ASSETS.home },
];

// Supplemental category-specific rows matching Figma 5904:439756 (mapped to real catalog IDs on add/tap)
interface CategoryRowItem {
  id: string;
  catalogProductId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  soldText: string;
  badge?: 'New';
  promoTag?: string;
  topCat: string;
  filterTags: ('Bestsellers' | 'Offers' | 'SeasonalPick')[];
}

const CATEGORY_FEATURED_ROWS: CategoryRowItem[] = [
  {
    id: 'cat-ribeye-200',
    catalogProductId: 'us-beef-blade',
    name: 'Australian original-cut ribeye steak 200g...',
    image: CAT_ASSETS.ribeye200,
    price: 35,
    originalPrice: 45,
    soldText: '2k sold',
    badge: 'New',
    promoTag: '20% Off',
    topCat: 'fresh',
    filterTags: ['Bestsellers', 'Offers', 'SeasonalPick'],
  },
  {
    id: 'cat-burgers',
    catalogProductId: 'us-beef-blade',
    name: 'Peppercorn 6 Pack Extra Lean Beef Burgers 500g...',
    image: CAT_ASSETS.burgers,
    price: 35,
    originalPrice: 45,
    soldText: '2k sold',
    topCat: 'fresh',
    filterTags: ['Bestsellers', 'SeasonalPick'],
  },
  {
    id: 'cat-ribeye-800',
    catalogProductId: 'us-beef-blade',
    name: 'Imported original-cut ribeye steak 800g (4-5 slic...',
    image: CAT_ASSETS.ribeye800,
    price: 35,
    originalPrice: 45,
    soldText: '2k sold',
    topCat: 'fresh',
    filterTags: ['Bestsellers', 'Offers'],
  },
];

function catalogToRow(p: Product, topCat: string): CategoryRowItem {
  const tags: ('Bestsellers' | 'Offers' | 'SeasonalPick')[] = ['Bestsellers'];
  if (p.promoTags && p.promoTags.length > 0) tags.push('Offers');
  if (p.badge === 'New' || p.isFlashDeal) tags.push('SeasonalPick');
  return {
    id: `cat-${p.id}`,
    catalogProductId: p.id,
    name: p.name,
    image: p.image,
    price: p.price,
    originalPrice: p.originalPrice,
    soldText: p.soldText ?? '2k sold',
    badge: p.badge === 'New' ? 'New' : undefined,
    promoTag: p.promoTags?.[0],
    topCat,
    filterTags: tags,
  };
}

export const CategoriesPage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);

  const [activeTopCatId, setActiveTopCatId] = useState<string>('fresh');
  const [activeSubCat, setActiveSubCat] = useState<string>('Fruit');
  const [activeChip, setActiveChip] = useState<'Bestsellers' | 'Offers' | 'SeasonalPick'>('Bestsellers');
  const [expandOpen, setExpandOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'under50' | 'offers'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTopCat =
    TOP_CATEGORIES.find((c) => c.id === activeTopCatId) ?? TOP_CATEGORIES[0];

  const handleSelectTopCat = (catId: string) => {
    const found = TOP_CATEGORIES.find((c) => c.id === catId) ?? TOP_CATEGORIES[0];
    setActiveTopCatId(found.id);
    setActiveSubCat(found.subCategories[0]);
    setExpandOpen(false);
  };

  const rows = useMemo(() => {
    const mappedCatalog: CategoryRowItem[] = PRODUCTS.map((p) => {
      if (p.category === 'Wine & Spirits') return catalogToRow(p, 'wine');
      if (p.category === 'Noodles & Pantry') return catalogToRow(p, 'beverages');
      if (p.category === 'Snacks & Dairy') return catalogToRow(p, 'home');
      if (p.category === 'Meat & Seafood') return catalogToRow(p, 'frozen');
      return catalogToRow(p, 'fresh');
    });

    const base =
      activeTopCatId === 'fresh'
        ? [...CATEGORY_FEATURED_ROWS, ...mappedCatalog]
        : [
            ...mappedCatalog.filter((r) => r.topCat === activeTopCatId),
            ...mappedCatalog.filter((r) => r.topCat !== activeTopCatId),
          ];

    return base.filter((item) => {
      if (searchQuery.trim()) {
        if (!item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
          return false;
        }
      }
      if (activeChip === 'Offers' && !item.promoTag && !item.originalPrice) return false;
      if (priceFilter === 'under50' && item.price >= 50) return false;
      if (priceFilter === 'offers' && !item.promoTag && !item.originalPrice) return false;
      return true;
    });
  }, [activeTopCatId, activeChip, priceFilter, searchQuery]);

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[118px] relative">
      {/* 1. Sticky Top Search Bar (Figma 6877:108276) */}
      <header className="sticky top-0 z-30 bg-white px-[12px] pt-[max(10px,env(safe-area-inset-top))] pb-[8px]">
        <div className="h-[36px] rounded-[8px] border border-[#E0E0E0] bg-white flex items-center pl-[12px] pr-[4px] gap-[8px]">
          <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products"
            className="flex-1 min-w-0 text-[14px] leading-[20px] text-[#1A1A1A] placeholder:text-[#858585] bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchQuery((q) => q.trim())}
            className="h-[28px] px-[12px] rounded-[4px] bg-[#FFF6F5] text-[#E40032] text-[12px] leading-[16px] font-semibold shrink-0 active:opacity-80"
          >
            Search
          </button>
        </div>
      </header>

      {/* 2. Top Category Icons Bar + View all (Figma 5892:437602) */}
      <section className="relative bg-white border-b border-[#E0E0E0]">
        <div className="px-[8px] py-[8px] pr-[64px] flex items-start gap-[4px] overflow-x-auto no-scrollbar">
          {TOP_CATEGORIES.map((cat) => {
            const active = cat.id === activeTopCatId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectTopCat(cat.id)}
                className="w-[78px] shrink-0 flex flex-col items-center gap-[4px]"
              >
                <div
                  className={`w-[54px] h-[54px] rounded-full flex items-center justify-center overflow-hidden transition-all ${
                    active ? 'ring-2 ring-[#E40032]/25' : ''
                  }`}
                  style={{ backgroundColor: cat.bg }}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-[46px] h-[46px] object-contain"
                  />
                </div>
                <span
                  className={`text-[12px] leading-[16px] text-center line-clamp-2 min-h-[32px] ${
                    active
                      ? 'font-bold text-[#1A1A1A]'
                      : 'font-normal text-[#3D3D3D]'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pinned View all button */}
        <button
          type="button"
          onClick={() => setExpandOpen((o) => !o)}
          className="absolute right-0 inset-y-0 w-[62px] bg-white shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-[2px] px-[6px]"
        >
          <span className="text-[12px] leading-[16px] font-semibold text-[#666666] whitespace-nowrap">
            View all
          </span>
          <img
            src={ICONS.chevronDown}
            alt=""
            className={`w-[16px] h-[16px] object-contain transition-transform ${
              expandOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded Categories Grid Overlay (Figma 7554:211107) */}
        {expandOpen && (
          <>
            <div
              onClick={() => setExpandOpen(false)}
              className="fixed inset-0 top-[54px] bg-black/40 z-30"
            />
            <div className="absolute left-0 right-0 top-0 bg-white z-40 rounded-b-[16px] shadow-lg overflow-hidden">
              <div className="grid grid-cols-5 gap-y-[14px] gap-x-[4px] px-[8px] pt-[12px] pb-[14px]">
                {EXPANDED_GRID_CATEGORIES.map((item, idx) => (
                  <button
                    key={`${item.label}-${idx}`}
                    type="button"
                    onClick={() => handleSelectTopCat(item.id)}
                    className="flex flex-col items-center gap-[4px]"
                  >
                    <div className="w-[52px] h-[52px] rounded-full bg-[#F7F7F7] flex items-center justify-center overflow-hidden p-1">
                      <img src={item.image} alt={item.label} className="w-full h-full object-contain" />
                    </div>
                    <span
                      className={`text-[11px] leading-[14px] text-center line-clamp-2 ${
                        idx === 0 ? 'font-bold text-[#1A1A1A]' : 'text-[#3D3D3D]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setExpandOpen(false)}
                aria-label="Collapse categories"
                className="w-full h-[36px] border-t border-[#EFEFEF] flex items-center justify-center active:bg-[#FAFAFA]"
              >
                <img
                  src={ICONS.chevronRightRed}
                  alt=""
                  className="w-[18px] h-[18px] object-contain -rotate-90"
                />
              </button>
            </div>
          </>
        )}
      </section>

      {/* 3. Split Left Side Navigation + Right Product Feed (Sticky per Figma 8499:117743) */}
      <div className="flex items-start bg-white min-h-[calc(100dvh-220px)]">
        {/* Sticky Left Sidebar (88px) */}
        <aside className="w-[88px] shrink-0 bg-[#F7F7F7] sticky top-[54px] self-start max-h-[calc(100dvh-165px)] overflow-y-auto no-scrollbar">
          {activeTopCat.subCategories.map((sub) => {
            const active = sub === activeSubCat;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setActiveSubCat(sub)}
                className={`w-full text-left px-[8px] py-[12px] text-[12px] leading-[16px] transition-colors ${
                  active
                    ? 'bg-white border-l-4 border-[#E40032] text-[#E40032] font-semibold'
                    : 'border-l-4 border-transparent text-[#3D3D3D] font-normal'
                }`}
              >
                <span className="line-clamp-2">{sub}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Product List */}
        <div className="flex-1 min-w-0 bg-white">
          {/* Top Promo Banner */}
          <div className="px-[10px] pt-[10px]">
            <div className="relative h-[68px] rounded-[8px] overflow-hidden bg-[#1A1A1A]">
              <img
                src={CAT_ASSETS.banner}
                alt="Premium Selection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent px-[10px] py-[8px] flex flex-col justify-between">
                <span className="text-[9px] tracking-wider uppercase text-white/80 font-medium">
                  PREMIUM SELECTION
                </span>
                <p className="text-[11px] leading-[14px] text-white/95 font-normal">
                  A great evening, beautifully simple.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Quick Filter Row (Sticky per Figma 8499:117743) */}
          <div className="sticky top-[54px] z-20 bg-white px-[10px] py-[10px] flex items-center justify-between gap-[6px]">
            <div className="flex items-center gap-[6px] overflow-x-auto no-scrollbar flex-1 min-w-0">
              {(['Bestsellers', 'Offers', 'SeasonalPick'] as const).map((chip) => {
                const active = activeChip === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setActiveChip(chip)}
                    className={`h-[28px] px-[10px] rounded-full text-[12px] leading-[16px] shrink-0 whitespace-nowrap transition-colors ${
                      active
                        ? 'border border-[#E40032] text-[#E40032] bg-white font-medium'
                        : 'border border-transparent text-[#1A1A1A] bg-[#F7F7F7] font-normal'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="inline-flex items-center gap-[4px] pl-[6px] bg-white text-[12px] leading-[16px] text-[#1A1A1A] font-medium shrink-0"
            >
              <span>Filter</span>
              <img
                src={CAT_ASSETS.filterHorizontal}
                alt=""
                className="w-[16px] h-[16px] object-contain"
              />
            </button>
          </div>

          {/* Product Rows */}
          <div className="px-[10px] divide-y divide-[#EFEFEF]">
            {rows.map((item) => (
              <div key={item.id} className="py-[10px] flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => navigate('pdp', item.catalogProductId)}
                  className="relative w-[84px] h-[84px] rounded-[6px] bg-white flex items-center justify-center shrink-0 overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                  {item.badge && (
                    <span className="absolute top-0 right-0 bg-[#E40032] text-white text-[10px] leading-[14px] font-medium px-[6px] rounded-[4px]">
                      {item.badge}
                    </span>
                  )}
                </button>

                <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate('pdp', item.catalogProductId)}
                      className="text-left block w-full"
                    >
                      <p className="text-[13px] leading-[18px] font-normal text-[#1A1A1A] line-clamp-2">
                        {item.name}
                      </p>
                    </button>
                    <p className="text-[11px] leading-[16px] text-[#666666] mt-[2px]">
                      {item.soldText}
                    </p>
                    {item.promoTag && (
                      <div className="mt-[4px]">
                        <PromoTag label={item.promoTag} />
                      </div>
                    )}
                  </div>

                  <div className="mt-[2px] flex items-end justify-between gap-[4px]">
                    <PriceBlock
                      price={item.price}
                      originalPrice={item.originalPrice}
                      size="sm"
                    />
                    <ProductAddControl productId={item.catalogProductId} size="sm" />
                  </div>
                </div>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="py-12 text-center text-[13px] text-[#858585]">
                No matching products.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <BottomSheetDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filter Products"
        footer={
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(false)}
            className="w-full h-[42px] rounded-[8px] bg-[#E40032] text-white text-[14px] font-semibold"
          >
            Apply Filter
          </button>
        }
      >
        <div className="p-4 space-y-3">
          <p className="text-[13px] font-semibold text-[#1A1A1A]">Quick Filter</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: 'All Products' },
                { id: 'offers', label: 'Special Offers Only' },
                { id: 'under50', label: 'Under $50' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPriceFilter(opt.id)}
                className={`h-[32px] px-3 rounded-full text-[12px] border ${
                  priceFilter === opt.id
                    ? 'border-[#E40032] text-[#E40032] bg-[#FFF6F5] font-semibold'
                    : 'border-[#E0E0E0] text-[#3D3D3D] bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </BottomSheetDrawer>

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
