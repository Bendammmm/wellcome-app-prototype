import React, { useState } from 'react';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { useAppStore } from '../../store/useAppStore';
import { INSTORE_ASSETS } from './inStoreAssets';

interface StoreInfo {
  id: string;
  name: string;
  tags: string[];
  hours: string;
  address: string;
  distance: string;
  managerName: string;
  districtLabel: string;
}

const STORES: StoreInfo[] = [
  {
    id: 'westwood',
    name: 'WESTWOOD (Near MTR)',
    tags: ['Click & Collect', 'Shop & Drop'],
    hours: '09:00:00-22:00:00',
    address: "3/F The Westwood, 8 Belcher's Street, HK",
    distance: '100m away',
    managerName: 'Emily',
    districtLabel: 'Island WESTWOOD',
  },
  {
    id: 'causeway-bay',
    name: 'Causeway Bay Plaza',
    tags: ['Click & Collect', 'Shop & Drop'],
    hours: '08:00:00-23:00:00',
    address: 'B1/F, 25-27 Great George Street, Causeway Bay, HK',
    distance: '450m away',
    managerName: 'Rachel',
    districtLabel: 'Causeway Bay',
  },
  {
    id: 'taikoo',
    name: 'Taikoo Shing Cityplaza',
    tags: ['Click & Collect'],
    hours: '08:30:00-22:30:00',
    address: 'Shop 074, G/F Cityplaza, Taikoo Shing, HK',
    distance: '1.2km away',
    managerName: 'Kelvin',
    districtLabel: 'Taikoo Shing',
  },
];

interface ExclusiveOffer {
  id: string;
  amount: string;
  threshold: string;
  scope: string;
  iconType: 'ticket' | 'olivers' | 'kiwi';
  claimed: boolean;
}

const INITIAL_OFFERS: ExclusiveOffer[] = [
  {
    id: 'offer-1',
    amount: '$30',
    threshold: 'off on $100',
    scope: 'Click & Collect only',
    iconType: 'ticket',
    claimed: true,
  },
  {
    id: 'offer-2',
    amount: '$30',
    threshold: 'off on $500',
    scope: 'Specific brand only',
    iconType: 'olivers',
    claimed: false,
  },
  {
    id: 'offer-3',
    amount: '$30',
    threshold: 'off on $100',
    scope: 'Specific item only',
    iconType: 'kiwi',
    claimed: false,
  },
  {
    id: 'offer-4',
    amount: '$30',
    threshold: 'off on $500',
    scope: 'Brand-exclusive coupon',
    iconType: 'olivers',
    claimed: false,
  },
];

interface InStoreProduct {
  id: string;
  catalogId?: string;
  name: string;
  image: string;
  soldText: string;
  promoTag: string;
  priceInt: string;
  priceDec: string;
  originalPrice: string;
}

const YOU_MAY_LIKE_PRODUCTS: InStoreProduct[] = [
  {
    id: 'isl-1',
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
    id: 'isl-2',
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
    id: 'isl-3',
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
    id: 'isl-4',
    catalogId: 'jumbo-blueberry',
    name: 'Jumbo Blueberry Tube 200GM',
    image: INSTORE_ASSETS.prodBlueberry,
    soldText: '2k sold',
    promoTag: 'Free gift',
    priceInt: '35',
    priceDec: '.00',
    originalPrice: '$45.00',
  },
  {
    id: 'isl-5',
    catalogId: 'jumbo-blueberry',
    name: 'Jumbo Blueberry Tube 200GM',
    image: INSTORE_ASSETS.prodBlueberry,
    soldText: '2k sold',
    promoTag: 'Free gift',
    priceInt: '35',
    priceDec: '.00',
    originalPrice: '$45.00',
  },
  {
    id: 'isl-6',
    catalogId: 'nissin-pack',
    name: 'Chinese Lettuce 300GM',
    image: INSTORE_ASSETS.prodNissinPack,
    soldText: '2k sold',
    promoTag: 'Free gift',
    priceInt: '35',
    priceDec: '.00',
    originalPrice: '$45.00',
  },
];

export const InStorePage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const goBack = useAppStore((s) => s.goBack);
  const showToast = useAppStore((s) => s.showToast);

  const [selectedStoreId, setSelectedStoreId] = useState<string>('westwood');
  const [storePickerOpen, setStorePickerOpen] = useState(false);
  const [offers, setOffers] = useState<ExclusiveOffer[]>(INITIAL_OFFERS);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: 'manager' | 'user'; text: string }[]
  >([
    {
      id: 'm1',
      sender: 'manager',
      text: "Hi! I'm Emily from Island WESTWOOD. Let me know if you need help finding an aisle, checking stock, or arranging Shop & Drop!",
    },
  ]);

  const currentStore = STORES.find((s) => s.id === selectedStoreId) ?? STORES[0];

  const handleToggleOffer = (offerId: string) => {
    const target = offers.find((o) => o.id === offerId);
    if (!target) return;
    if (target.claimed) {
      showToast('Offer ready to apply in Cart');
      navigate('cart');
      return;
    }
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, claimed: true } : o))
    );
    showToast(`Claimed ${target.amount} ${target.threshold} coupon`);
  };

  const handleToggleLike = (id: string, name: string) => {
    setLikedIds((prev) => {
      const exists = prev.includes(id);
      showToast(exists ? `Removed ${name} from favourites` : `Saved ${name} to favourites`);
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: trimmed },
      {
        id: `m-${Date.now() + 1}`,
        sender: 'manager',
        text: `Thanks for asking! Our team at ${currentStore.name} is checking that for you right now.`,
      },
    ]);
    setChatInput('');
  };

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[28px] relative">
      {/* Hero Storefront Image + Floating Top Bar (Figma 3005:319901 -> 2959:315795) */}
      <div className="relative w-full h-[245px] overflow-hidden bg-[#222]">
        <img
          src={INSTORE_ASSETS.storeHero}
          alt={currentStore.name}
          className="w-full h-full object-cover"
        />
        {/* Floating Back & Share Buttons */}
        <div className="absolute top-[max(12px,env(safe-area-inset-top))] left-0 right-0 px-[16px] flex items-center justify-between z-10">
          <button
            type="button"
            aria-label="Go back"
            onClick={goBack}
            className="w-[36px] h-[36px] rounded-full bg-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform"
          >
            <img
              src={INSTORE_ASSETS.chevronLeft}
              alt=""
              className="w-[20px] h-[20px] object-contain"
            />
          </button>
          <button
            type="button"
            aria-label="Share store"
            onClick={() => showToast(`Shared ${currentStore.name} store link`)}
            className="w-[36px] h-[36px] rounded-full bg-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform"
          >
            <img
              src={INSTORE_ASSETS.share}
              alt=""
              className="w-[20px] h-[20px] object-contain"
            />
          </button>
        </div>
      </div>

      {/* Store Information Sheet overlapping Hero (Figma 3005:319635 -> 2963:315864) */}
      <div className="-mt-[24px] relative z-10 flex flex-col">
        <div className="bg-gradient-to-b from-white via-white via-[18%] to-[#F7F7F7] rounded-t-[8px] px-[8px] py-[12px] flex flex-col gap-[8px]">
          {/* Store Details Block (2963:315865) */}
          <div className="px-[12px] py-[8px] flex flex-col gap-[12px]">
            {/* Store Summary */}
            <div className="flex flex-col gap-[8px]">
              <button
                type="button"
                onClick={() => setStorePickerOpen(true)}
                className="flex items-center gap-[11px] text-left active:opacity-75"
              >
                <h1 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                  {currentStore.name}
                </h1>
                <img
                  src={INSTORE_ASSETS.expandStoreDetails}
                  alt="Switch store"
                  className="w-[16px] h-[16px] object-contain shrink-0"
                />
              </button>

              {/* Store Labels */}
              <div className="flex items-center gap-[8px]">
                {currentStore.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#FFF6F5] text-[#E40032] text-[10px] leading-[14px] px-[4px] py-[2px] rounded-[4px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Opening Hours */}
              <div className="flex items-center gap-[4px]">
                <img
                  src={INSTORE_ASSETS.clockOutline}
                  alt=""
                  className="w-[14px] h-[14px] object-contain shrink-0"
                />
                <span className="text-[12px] leading-[16px] text-[#666666]">
                  {currentStore.hours}
                </span>
              </div>
            </div>

            {/* Address Row */}
            <div className="border-t border-[#E0E0E0] pt-[12px] flex items-center gap-[8px]">
              <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                <p className="text-[14px] leading-[20px] text-[#3D3D3D] truncate">
                  {currentStore.address}
                </p>
                <div className="flex items-center gap-[4px]">
                  <img
                    src={INSTORE_ASSETS.locationPin}
                    alt=""
                    className="w-[14px] h-[14px] object-contain shrink-0"
                  />
                  <span className="text-[12px] leading-[16px] text-[#666666]">
                    {currentStore.distance}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Open directions"
                onClick={() => showToast(`Directions to ${currentStore.name} (${currentStore.distance})`)}
                className="w-[28px] h-[28px] flex items-center justify-center rounded-full active:bg-[#F5F5F5] shrink-0"
              >
                <img
                  src={INSTORE_ASSETS.directionsArrow}
                  alt=""
                  className="w-[20px] h-[20px] object-contain"
                />
              </button>
            </div>
          </div>

          {/* 4-Column Quick Action Category Card (Figma 3005:319648 / 8612:77033) */}
          <div className="bg-white rounded-[12px] px-[4px] py-[12px]">
            <div className="grid grid-cols-4 gap-[2px]">
              {[
                {
                  id: 'shop-drop',
                  label: 'Shop & Drop',
                  icon: INSTORE_ASSETS.iconShopDrop,
                  sizeClass: 'w-[35px] h-[35px]',
                  onClick: () => showToast('Shop & Drop: Scan at checkout and we deliver to your door'),
                },
                {
                  id: 'e-stamp',
                  label: 'E-stamp',
                  icon: INSTORE_ASSETS.iconEstamp,
                  sizeClass: 'w-[30px] h-[30px]',
                  onClick: () => showToast('You have 12 E-stamps available to redeem in-store'),
                },
                {
                  id: 'history',
                  label: 'Shopping History',
                  icon: INSTORE_ASSETS.iconHistory,
                  sizeClass: 'w-[35px] h-[35px]',
                  onClick: () => navigate('shopping-list'),
                },
                {
                  id: 'list',
                  label: 'Shopping List',
                  icon: INSTORE_ASSETS.iconShoppingList,
                  sizeClass: 'w-[35px] h-[35px]',
                  onClick: () => navigate('shopping-list'),
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className="flex flex-col items-center gap-[4px] active:opacity-75 transition-opacity"
                >
                  <div className="w-[48px] h-[48px] rounded-[8px] flex items-center justify-center">
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={`${item.sizeClass} object-contain`}
                    />
                  </div>
                  <span className="text-[14px] leading-[20px] font-normal text-[#3D3D3D] text-center px-0.5">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Nicole's Exclusive Offers Module (Figma 2996:317720 / 8612:77121) */}
          <div className="bg-white rounded-[12px] overflow-hidden">
            <div className="px-[12px] py-[8px] flex items-center justify-between">
              <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                Nicole&apos;s Exclusive Offers
              </h2>
              <button
                type="button"
                onClick={() => showToast('Viewing all exclusive in-store offers')}
                className="flex items-center gap-[4px] py-[8px] text-[12px] leading-[16px] font-semibold text-[#3D3D3D] active:opacity-70"
              >
                <span>See all</span>
                <img
                  src={INSTORE_ASSETS.chevronRight}
                  alt=""
                  className="w-[16px] h-[16px] object-contain"
                />
              </button>
            </div>

            <div className="flex gap-[8px] overflow-x-auto no-scrollbar px-[12px] pt-[8px] pb-[12px]">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative w-[106px] h-[182px] shrink-0 flex flex-col items-center pt-[8px] px-[8px] pb-[8px]"
                >
                  {/* Ticket SVG Background */}
                  <img
                    src={INSTORE_ASSETS.couponDesign}
                    alt=""
                    className="absolute inset-[-4.4%_-11.32%_-8.79%_-11.32%] w-[122.64%] h-[113.19%] max-w-none pointer-events-none select-none"
                  />

                  {/* Coupon Icon */}
                  <div className="relative z-10 h-[36px] w-full flex items-center justify-center shrink-0">
                    {offer.iconType === 'ticket' && (
                      <div className="w-[36px] h-[36px] rounded-[8px] bg-[#FFE2E0] flex items-center justify-center">
                        <img
                          src={INSTORE_ASSETS.welcomeOfferIcon}
                          alt=""
                          className="w-[24px] h-[24px] object-contain"
                        />
                      </div>
                    )}
                    {offer.iconType === 'olivers' && (
                      <img
                        src={INSTORE_ASSETS.oliversBrandIcon}
                        alt="Oliver's"
                        className="w-[70px] h-[70px] object-contain -mt-[4px]"
                      />
                    )}
                    {offer.iconType === 'kiwi' && (
                      <img
                        src={INSTORE_ASSETS.kiwiOfferPhoto}
                        alt="Zespri Kiwi"
                        className="w-[36px] h-[36px] object-contain"
                      />
                    )}
                  </div>

                  {/* Offer Value & Action */}
                  <div className="relative z-10 flex-1 w-full flex flex-col justify-between items-center mt-[2px]">
                    <div className="text-center w-full flex flex-col gap-[4px]">
                      <div>
                        <p className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                          {offer.amount}
                        </p>
                        <p className="text-[14px] leading-[20px] font-normal text-[#3D3D3D]">
                          {offer.threshold}
                        </p>
                      </div>
                      <p className="text-[12px] leading-[16px] font-normal text-[#666666] line-clamp-2">
                        {offer.scope}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleOffer(offer.id)}
                      className={`w-full h-[32px] rounded-[4px] text-[12px] leading-[16px] font-semibold flex items-center justify-center transition-colors active:opacity-80 ${
                        offer.claimed
                          ? 'border border-[#C7C7C7] bg-white text-[#1A1A1A]'
                          : 'bg-[#FFF6F5] text-[#E40032]'
                      }`}
                    >
                      {offer.claimed ? 'Use' : 'Get'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Manager Card (Figma 5995:296155 / 8612:77267) */}
          <div className="bg-white rounded-[12px] h-[168px] relative overflow-hidden">
            <img
              src={INSTORE_ASSETS.managerCircleBg}
              alt=""
              className="absolute right-[-36px] top-[30px] w-[191px] h-[191px] pointer-events-none select-none"
            />
            <img
              src={INSTORE_ASSETS.managerPhoto}
              alt={currentStore.managerName}
              className="absolute right-0 top-[12px] w-[143px] h-[156px] object-cover object-top pointer-events-none select-none"
            />
            <div className="relative z-10 h-full flex flex-col justify-center items-start gap-[16px] pl-[16px] w-[245px]">
              <div className="flex flex-col gap-[8px]">
                <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                  Hello, I&apos;m {currentStore.managerName}!
                </h2>
                <p className="text-[14px] leading-[20px] font-normal text-[#3D3D3D]">
                  Your {currentStore.districtLabel} manager. Have a question or need a hand?
                  <br />
                  I&apos;m here to help.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="bg-[#E40032] text-white h-[32px] px-[12px] rounded-[4px] text-[12px] leading-[16px] font-semibold flex items-center justify-center active:opacity-90"
              >
                Let&apos;s chat
              </button>
            </div>
          </div>
        </div>

        {/* You May Like 2-Column Grid (Figma 6060:51345) */}
        <section className="px-[8px] flex flex-col gap-[8px]">
          <div className="px-[8px] py-[12px]">
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
              You May Like
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-[8px]">
            {YOU_MAY_LIKE_PRODUCTS.map((item) => {
              const isLiked = likedIds.includes(item.id);
              return (
                <article
                  key={item.id}
                  onClick={() => navigate('pdp', item.catalogId ?? 'belena-shiraz')}
                  className="bg-white rounded-[8px] overflow-hidden flex flex-col cursor-pointer active:opacity-95"
                >
                  <div className="aspect-square w-full bg-white p-[4px] flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="h-[84px] px-[8px] py-[4px] flex flex-col gap-[4px]">
                      <div className="flex flex-col gap-[2px]">
                        <p className="text-[14px] leading-[20px] text-[#1A1A1A] line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-[12px] leading-[16px] text-[#666666]">
                          {item.soldText}
                        </p>
                      </div>
                      <div className="flex items-center gap-[2px]">
                        <span className="bg-[#FFEC99] text-[#3D3D3D] text-[12px] leading-[16px] px-[4px] h-[16px] rounded-[4px] inline-flex items-center">
                          {item.promoTag}
                        </span>
                      </div>
                    </div>

                    <div className="h-[42px] pl-[8px] pr-[4px] pb-[4px] flex items-end justify-between">
                      <div className="flex items-end gap-[2px] py-[4px]">
                        <div className="flex items-start font-bold text-[#E40032] leading-none">
                          <span className="text-[10px] leading-[12px] mt-[1px]">$</span>
                          <span className="text-[16px] leading-[16px]">{item.priceInt}</span>
                          <span className="text-[10px] leading-[12px] mt-[1px]">{item.priceDec}</span>
                        </div>
                        <span className="text-[10px] leading-[14px] text-[#666666] line-through">
                          {item.originalPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label="Favourite product"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(item.id, item.name);
                        }}
                        className={`w-[32px] h-[32px] flex items-center justify-center rounded-[4px] transition-transform active:scale-90 ${
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
      </div>

      {/* Store Switcher Drawer */}
      <BottomSheetDrawer
        open={storePickerOpen}
        onClose={() => setStorePickerOpen(false)}
        title="Select Wellcome Store"
      >
        <div className="p-[16px] flex flex-col gap-[10px]">
          {STORES.map((store) => {
            const active = store.id === currentStore.id;
            return (
              <button
                key={store.id}
                type="button"
                onClick={() => {
                  setSelectedStoreId(store.id);
                  setStorePickerOpen(false);
                  showToast(`Switched to ${store.name}`);
                }}
                className={`w-full text-left p-[12px] rounded-[10px] border transition-colors ${
                  active
                    ? 'border-[#E40032] bg-[#FFF6F5]'
                    : 'border-[#E0E0E0] bg-white hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">{store.name}</span>
                  <span className="text-[12px] text-[#666666]">{store.distance}</span>
                </div>
                <p className="text-[12px] text-[#666666] mt-[4px]">{store.address}</p>
                <p className="text-[11px] text-[#858585] mt-[2px]">Open {store.hours}</p>
              </button>
            );
          })}
        </div>
      </BottomSheetDrawer>

      {/* Store Manager Chat Drawer */}
      <BottomSheetDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title={`Chat with ${currentStore.managerName}`}
        footer={
          <div className="flex items-center gap-[8px]">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              placeholder="Ask about stock, aisles, or offers..."
              className="flex-1 h-[40px] px-[12px] rounded-[8px] border border-[#E0E0E0] text-[14px] text-[#1A1A1A] outline-none focus:border-[#E40032]"
            />
            <button
              type="button"
              onClick={handleSendChat}
              className="h-[40px] px-[16px] rounded-[8px] bg-[#E40032] text-white text-[13px] font-bold active:opacity-90"
            >
              Send
            </button>
          </div>
        }
      >
        <div className="p-[16px] flex flex-col gap-[10px] min-h-[220px]">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[82%] px-[12px] py-[8px] rounded-[12px] text-[13px] leading-[18px] ${
                msg.sender === 'user'
                  ? 'self-end bg-[#E40032] text-white'
                  : 'self-start bg-[#F5F5F5] text-[#1A1A1A]'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </BottomSheetDrawer>
    </div>
  );
};
