import React, { useEffect, useState } from 'react';
import { SEARCH_ASSETS } from '../../data/catalog';
import type { Product } from '../../types';

export interface FilterGroup {
  id: string;
  label: string;
  options: string[];
}

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'suggested',
    label: 'Suggested',
    options: [
      'High score',
      'Quality Pick',
      'New',
      'Only Here',
      'Limited Edition',
      'Our Own Brand',
      'Try it!',
    ],
  },
  {
    id: 'origin',
    label: 'Origin',
    options: ['Australia', 'Japan', 'New Zealand', 'China', 'Hong Kong', 'USA', 'Italy', 'Peru'],
  },
  {
    id: 'promotions',
    label: 'Promotions',
    options: ['Special price', 'Save $5', '20% Off', '15% off', '10% off', 'Case deal'],
  },
  {
    id: 'flavour',
    label: 'Flavour',
    options: ['Full Cream', 'Low Fat', 'Skimmed', 'Sesame', 'Vanilla'],
  },
  {
    id: 'dietary',
    label: 'Dietary Needs',
    options: ['Organic', 'High Protein', 'Lactose Free', 'Hi-Calcium'],
  },
  {
    id: 'type',
    label: 'Type',
    options: ['Fresh Milk', 'UHT Milk', 'Red Wine', 'Fresh Fruit', 'Hot Pot'],
  },
  {
    id: 'wine_variety',
    label: 'Wine Variety',
    options: ['Shiraz', 'Cabernet Sauvignon'],
  },
  {
    id: 'wine_sweetness',
    label: 'Wine Sweetness',
    options: ['Dry', 'Medium Dry'],
  },
];

export function productMatchesFilterOption(product: Product, option: string): boolean {
  const opt = option.toLowerCase();
  if (product.searchTags?.some((t) => t.toLowerCase() === opt)) return true;
  if (product.badge?.toLowerCase() === opt) return true;
  if (product.promoTags?.some((t) => t.toLowerCase() === opt)) return true;
  if (product.specs?.origin?.toLowerCase() === opt) return true;
  if (product.specs?.brandCategories?.some((b) => b.toLowerCase().includes(opt))) return true;
  if (product.specs?.grape?.toLowerCase().includes(opt)) return true;
  if (product.name.toLowerCase().includes(opt)) return true;
  return false;
}

interface FilterDrawerProps {
  open: boolean;
  selectedFilters: Record<string, string[]>;
  baseProducts: Product[];
  onClose: () => void;
  onApply: (next: Record<string, string[]>) => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  selectedFilters,
  baseProducts,
  onClose,
  onApply,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string>(FILTER_GROUPS[0].id);
  const [draft, setDraft] = useState<Record<string, string[]>>(selectedFilters);

  useEffect(() => {
    if (open) {
      setDraft(selectedFilters);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, selectedFilters]);

  if (!open) return null;

  const activeGroup =
    FILTER_GROUPS.find((g) => g.id === activeGroupId) ?? FILTER_GROUPS[0];

  const toggleOption = (groupId: string, option: string) => {
    setDraft((prev) => {
      const current = prev[groupId] ?? [];
      const exists = current.includes(option);
      const nextGroup = exists
        ? current.filter((item) => item !== option)
        : [...current, option];
      return {
        ...prev,
        [groupId]: nextGroup,
      };
    });
  };

  const handleClear = () => {
    setDraft({});
  };

  const handleContinue = () => {
    onApply(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end">
      {/* Blanket scrim (Figma 7556:211243) */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-fade-in"
      />

      {/* Drawer sheet (Figma 7578:45007 / 7583:80592) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter"
        className="relative z-10 w-full max-w-[393px] max-[480px]:max-w-full h-[88dvh] max-h-[793px] bg-[#F7F7F7] rounded-t-[12px] flex flex-col overflow-hidden animate-drawer-up shadow-2xl"
      >
        {/* Top NavigationBar (h-[48px]) */}
        <div className="bg-white h-[48px] px-[12px] flex items-center gap-[8px] shrink-0 border-b border-[#F0F0F0]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filter"
            className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
          >
            <img
              src={SEARCH_ASSETS.close}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
          </button>

          <h2 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A] truncate">
            Filter
          </h2>

          <button
            type="button"
            onClick={handleClear}
            className="h-[40px] px-[4px] text-[14px] leading-[20px] font-semibold text-[#666666] active:text-[#1A1A1A] shrink-0"
          >
            Clear
          </button>
        </div>

        {/* Two-column Category Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Side Navigation (104px, #F7F7F7) */}
          <nav className="w-[104px] bg-[#F7F7F7] overflow-y-auto no-scrollbar shrink-0">
            {FILTER_GROUPS.map((group) => {
              const isActive = group.id === activeGroup.id;
              const selectedCount = draft[group.id]?.length ?? 0;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(group.id)}
                  className={`relative w-full text-left p-[8px] min-h-[48px] flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-white border-l-4 border-[#E40032] text-[#E40032] font-semibold'
                      : 'bg-transparent border-l-4 border-transparent text-[#3D3D3D] font-normal'
                  }`}
                >
                  <span className="text-[12px] leading-[16px] pr-[4px] break-words">
                    {group.label}
                  </span>
                  {selectedCount > 0 && (
                    <span className="shrink-0 min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#FFCF00] border border-white text-[10px] leading-[12px] font-medium text-[#1A1A1A] inline-flex items-center justify-center">
                      {selectedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Options List (white surface) */}
          <div className="flex-1 bg-white overflow-y-auto py-[8px]">
            {activeGroup.options.map((option) => {
              const checked = (draft[activeGroup.id] ?? []).includes(option);
              const matchCount = baseProducts.filter((p) =>
                productMatchesFilterOption(p, option)
              ).length;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(activeGroup.id, option)}
                  className="w-full px-[16px] py-[12px] flex items-center gap-[4px] text-left active:bg-[#FAFAFA] transition-colors"
                >
                  <img
                    src={checked ? SEARCH_ASSETS.radioChecked : SEARCH_ASSETS.radioBlank}
                    alt=""
                    className="w-[24px] h-[24px] shrink-0 object-contain"
                  />
                  <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                    {option}
                    {checked && matchCount > 0 && (
                      <>
                        {' ('}
                        <span className="text-[#E40032]">{matchCount}</span>
                        {')'}
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer (Figma I7578:45007;436:4832) */}
        <div className="bg-white p-[12px] pb-[max(12px,env(safe-area-inset-bottom))] shrink-0 border-t border-[#F0F0F0]">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] leading-[24px] font-bold flex items-center justify-center active:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
