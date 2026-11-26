import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { INSTORE_ASSETS } from './inStoreAssets';

interface ShoppingListItem {
  id: string;
  name: string;
  image: string;
  priceInt: string;
  priceDec: string;
  originalPrice?: string;
  qty: number;
  checked: boolean;
}

const INITIAL_SHOPPING_LIST: ShoppingListItem[] = [
  {
    id: 'sl-1',
    name: 'YAMAGATA GYU Japan Yamagata Chilled A5 Grade Wagyu Beef Rib Eye  200g',
    image: INSTORE_ASSETS.prodBeef,
    priceInt: '126',
    priceDec: '.00',
    originalPrice: '$140.00',
    qty: 1,
    checked: true,
  },
  {
    id: 'sl-2',
    name: 'Japan Nagano Iwashita Shine Muscat Grape 600g)',
    image: INSTORE_ASSETS.prodBeef,
    priceInt: '126',
    priceDec: '.00',
    originalPrice: '$145.00',
    qty: 1,
    checked: false,
  },
  {
    id: 'sl-3',
    name: 'Kirkland Signature Fresh Farmed Atlantic Salmon Portions',
    image: INSTORE_ASSETS.prodBeef,
    priceInt: '85',
    priceDec: '.00',
    qty: 1,
    checked: false,
  },
  {
    id: 'sl-4',
    name: 'Peppercorn 6 Pack Extra Lean Beef Burgers 500g',
    image: INSTORE_ASSETS.prodBeef,
    priceInt: '80',
    priceDec: '.00',
    originalPrice: '$145.00',
    qty: 1,
    checked: false,
  },
];

const HISTORY_PRODUCTS = [
  {
    id: 'hist-1',
    catalogId: 'belena-shiraz',
    name: 'Belena barossa Shiraz Red Wine 750 ML',
    image: INSTORE_ASSETS.prodBelena,
    soldText: '2k sold',
    promoTag: 'Free gift',
    priceInt: '35',
    priceDec: '.00',
    originalPrice: '$45.00',
  },
  {
    id: 'hist-2',
    catalogId: 'bin-180-shiraz',
    name: 'Bin 180 Cabernet Shiraz 750ML',
    image: INSTORE_ASSETS.prodBin180,
    soldText: '2k sold',
    promoTag: 'Free gift',
    priceInt: '35',
    priceDec: '.00',
    originalPrice: '$45.00',
  },
  {
    id: 'hist-3',
    catalogId: 'nissin-bowl',
    name: 'Nissin Demae Iccho Sesame Oil Bowl Noodles',
    image: INSTORE_ASSETS.prodNissinBowl,
    soldText: '2k sold',
    promoTag: 'Free gift',
    priceInt: '35',
    priceDec: '.00',
    originalPrice: '$45.00',
  },
  {
    id: 'hist-4',
    catalogId: 'jumbo-blueberry',
    name: 'Jumbo Blueberry Tube 200GM',
    image: INSTORE_ASSETS.prodBlueberry,
    soldText: '2k sold',
    promoTag: 'Free gift',
    priceInt: '35',
    priceDec: '.00',
    originalPrice: '$45.00',
  },
];

export const ShoppingListPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const showToast = useAppStore((s) => s.showToast);

  const [items, setItems] = useState<ShoppingListItem[]>(INITIAL_SHOPPING_LIST);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleChecked = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const incrementQty = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty >= 9 ? 1 : item.qty + 1 } : item
      )
    );
  };

  const handleAddFromHistory = (prod: (typeof HISTORY_PRODUCTS)[number]) => {
    const existing = items.find((i) => i.name === prod.name);
    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.name === prod.name ? { ...i, qty: i.qty + 1, checked: false } : i
        )
      );
      showToast(`Increased "${prod.name}" quantity in Shopping List`);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `sl-${Date.now()}`,
          name: prod.name,
          image: prod.image,
          priceInt: prod.priceInt,
          priceDec: prod.priceDec,
          originalPrice: prod.originalPrice,
          qty: 1,
          checked: false,
        },
      ]);
      showToast(`Added "${prod.name}" to Shopping List`);
    }
  };

  const handleConfirm = () => {
    const checkedCount = items.filter((i) => i.checked).length;
    showToast(
      `Shopping list saved (${checkedCount}/${items.length} items checked)`
    );
    navigate('in-store');
  };

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[92px] flex flex-col gap-[8px]">
      {/* Top White Navigation Bar (Figma 5999:299274 -> 8593:61905) */}
      <header className="sticky top-0 z-20 bg-white pt-[max(4px,env(safe-area-inset-top))] h-[48px] px-[12px] flex items-center gap-[8px] border-b border-[#F2F2F2]">
        <button
          type="button"
          aria-label="Go back"
          onClick={goBack}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:bg-[#F5F5F5] shrink-0"
        >
          <img
            src={INSTORE_ASSETS.chevronLeftDark}
            alt=""
            className="w-[28px] h-[28px] object-contain"
          />
        </button>
        <h1 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A] truncate">
          Shopping List
        </h1>
        <div className="w-[36px] h-[36px] shrink-0" />
      </header>

      {/* Checklist Items Container (Figma 5999:298810) */}
      <section className="bg-white px-[16px]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div
              key={item.id}
              className={`py-[12px] ${!isLast ? 'border-b border-[#EEEEEE]' : ''}`}
            >
              <div className="flex items-start gap-[8px] py-[8px]">
                {/* Product Thumbnail 76x76 */}
                <div className="w-[76px] h-[76px] rounded-[4px] bg-white overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full object-contain transition-opacity ${
                      item.checked ? 'opacity-65' : 'opacity-100'
                    }`}
                  />
                </div>

                {/* Product Name + Price + Qty */}
                <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[76px] gap-[8px]">
                  <p
                    className={`text-[14px] leading-[20px] font-normal ${
                      item.checked ? 'text-[#A8A8A8]' : 'text-[#1A1A1A]'
                    }`}
                  >
                    {item.name}
                  </p>

                  <div className="flex items-end justify-between gap-[12px]">
                    <div className="flex items-end gap-[4px]">
                      <div
                        className={`flex items-start font-bold leading-none ${
                          item.checked ? 'text-[#A8A8A8]' : 'text-[#E40032]'
                        }`}
                      >
                        <span className="text-[10px] leading-[12px] mt-[1px]">$</span>
                        <span className="text-[16px] leading-[16px]">{item.priceInt}</span>
                        <span className="text-[10px] leading-[12px] mt-[1px]">{item.priceDec}</span>
                      </div>
                      {item.originalPrice && (
                        <span
                          className={`text-[10px] leading-[12px] line-through ${
                            item.checked ? 'text-[#A8A8A8]' : 'text-[#666666]'
                          }`}
                        >
                          {item.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => incrementQty(item.id)}
                      title="Tap to change quantity"
                      className={`w-[32px] text-center text-[16px] leading-[20px] font-normal rounded-[4px] active:bg-[#F5F5F5] ${
                        item.checked ? 'text-[#A8A8A8]' : 'text-[#1A1A1A]'
                      }`}
                    >
                      x{item.qty}
                    </button>
                  </div>
                </div>

                {/* Right Check / Checked Control (44px wide) */}
                <button
                  type="button"
                  onClick={() => toggleChecked(item.id)}
                  className="w-[44px] self-stretch flex flex-col items-center justify-center gap-[2px] shrink-0 active:scale-95 transition-transform"
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center">
                    <img
                      src={
                        item.checked
                          ? INSTORE_ASSETS.radioChecked
                          : INSTORE_ASSETS.radioOutlineCheck
                      }
                      alt={item.checked ? 'Checked' : 'Check'}
                      className={item.checked ? 'w-[24px] h-[24px]' : 'w-[20px] h-[20px]'}
                    />
                  </div>
                  <span className="text-[10px] leading-[14px] font-medium text-[#666666]">
                    {item.checked ? 'Checked' : 'Check'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Shopping History 2-Column Section (Figma 6292:50325) */}
      <section className="px-[8px] flex flex-col gap-[8px]">
        <div className="px-[8px] py-[12px]">
          <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
            Shopping history
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-[8px]">
          {HISTORY_PRODUCTS.map((prod) => {
            const isLiked = likedIds.includes(prod.id);
            return (
              <article
                key={prod.id}
                onClick={() => handleAddFromHistory(prod)}
                className="bg-white rounded-[8px] overflow-hidden flex flex-col cursor-pointer active:opacity-95"
              >
                <div className="aspect-square w-full bg-white p-[4px] flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="h-[84px] px-[8px] py-[4px] flex flex-col gap-[4px]">
                    <div className="flex flex-col gap-[2px]">
                      <p className="text-[14px] leading-[20px] text-[#1A1A1A] line-clamp-2">
                        {prod.name}
                      </p>
                      <p className="text-[12px] leading-[16px] text-[#666666]">
                        {prod.soldText}
                      </p>
                    </div>
                    <div className="flex items-center gap-[2px]">
                      <span className="bg-[#FFEC99] text-[#3D3D3D] text-[12px] leading-[16px] px-[4px] h-[16px] rounded-[4px] inline-flex items-center">
                        {prod.promoTag}
                      </span>
                    </div>
                  </div>

                  <div className="h-[42px] pl-[8px] pr-[4px] pb-[4px] flex items-end justify-between">
                    <div className="flex items-end gap-[2px] py-[4px]">
                      <div className="flex items-start font-bold text-[#E40032] leading-none">
                        <span className="text-[10px] leading-[12px] mt-[1px]">$</span>
                        <span className="text-[16px] leading-[16px]">{prod.priceInt}</span>
                        <span className="text-[10px] leading-[12px] mt-[1px]">{prod.priceDec}</span>
                      </div>
                      <span className="text-[10px] leading-[14px] text-[#666666] line-through">
                        {prod.originalPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Favourite product"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLikedIds((prev) =>
                          prev.includes(prod.id)
                            ? prev.filter((id) => id !== prod.id)
                            : [...prev, prod.id]
                        );
                      }}
                      className={`w-[32px] h-[32px] flex items-center justify-center rounded-[4px] active:scale-90 ${
                        isLiked ? 'bg-[#FFF0F2]' : ''
                      }`}
                    >
                      <img
                        src={INSTORE_ASSETS.heartOutline}
                        alt=""
                        className="w-[20px] h-[20px] object-contain"
                        style={
                          isLiked
                            ? {
                                filter:
                                  'invert(15%) sepia(96%) saturate(5850%) hue-rotate(342deg) brightness(91%) contrast(106%)',
                              }
                            : undefined
                        }
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Fixed Bottom Confirm Bar (.app-fixed-bar) */}
      <div className="app-fixed-bar bottom-0 z-30 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] px-[12px] pt-[12px] pb-[max(12px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] leading-[24px] font-bold flex items-center justify-center active:opacity-90 transition-opacity"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
