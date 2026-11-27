import React, { useMemo, useState } from 'react';
import { ASSETS, ICONS, PRODUCTS } from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../../components/shared/ProductCard';

interface DemoOrder {
  id: string;
  channel: 'online' | 'instore';
  title: string;
  fulfillment: 'delivery' | 'click_and_collect' | 'instore';
  status: 'Ready to pick up' | 'To Ship' | 'To Pay' | 'Completed';
  statusTab: 'To Pay' | 'To Ship' | 'To Receive' | 'To Review';
  date: string;
  total: number;
  itemCount: number;
  thumbnails: string[];
  productIds: string[];
  showRefundReview?: boolean;
}

const DEMO_ORDERS: DemoOrder[] = [
  {
    id: '10008099984271',
    channel: 'online',
    title: 'Click & collect',
    fulfillment: 'click_and_collect',
    status: 'Ready to pick up',
    statusTab: 'To Receive',
    date: '2026-08-27 20:01',
    total: 35,
    itemCount: 4,
    thumbnails: [ASSETS.kiwi, ASSETS.nissinBowl, ASSETS.beef, ASSETS.fujiApple],
    productIds: ['zespri-kiwi', 'nissin-bowl'],
  },
  {
    id: '10008099984272',
    channel: 'online',
    title: 'Fresh Pre-Order',
    fulfillment: 'click_and_collect',
    status: 'Completed',
    statusTab: 'To Review',
    date: '2026-08-27 20:01',
    total: 35,
    itemCount: 4,
    thumbnails: [ASSETS.kiwi, ASSETS.nissinBowl, ASSETS.beef, ASSETS.eminaCheese],
    productIds: ['zespri-kiwi', 'emina-cheese'],
    showRefundReview: true,
  },
  {
    id: '10008099984273',
    channel: 'online',
    title: 'Home delivery',
    fulfillment: 'delivery',
    status: 'To Ship',
    statusTab: 'To Ship',
    date: '2026-08-27 20:01',
    total: 35,
    itemCount: 4,
    thumbnails: [ASSETS.kiwi, ASSETS.nissinBowl, ASSETS.beef, ASSETS.ferrariniHam],
    productIds: ['us-beef-blade', 'ferrarini-ham'],
  },
  {
    id: '10008099984274',
    channel: 'online',
    title: 'Pre-Order',
    fulfillment: 'delivery',
    status: 'Completed',
    statusTab: 'To Review',
    date: '2026-08-27 20:01',
    total: 35,
    itemCount: 4,
    thumbnails: [ASSETS.kiwi, ASSETS.nissinBowl, ASSETS.beef, ASSETS.wineBottleClean],
    productIds: ['belena-shiraz', 'zespri-kiwi'],
    showRefundReview: true,
  },
  {
    id: 'IN-20260825-0091',
    channel: 'instore',
    title: 'Wellcome Superstore · Causeway Bay',
    fulfillment: 'instore',
    status: 'Completed',
    statusTab: 'To Review',
    date: '2026-08-25 18:42',
    total: 128.5,
    itemCount: 5,
    thumbnails: [ASSETS.fujiApple, ASSETS.blueberry, ASSETS.nissinPack],
    productIds: ['fuji-apple', 'jumbo-blueberry'],
  },
];

const STATUS_TABS = ['All', 'To Pay', 'To Ship', 'To Receive', 'To Review'] as const;

export const OrderListPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const addToCart = useAppStore((s) => s.addToCart);
  const showToast = useAppStore((s) => s.showToast);
  const userOrders = useAppStore((s) => s.orders);

  const [channel, setChannel] = useState<'online' | 'instore'>('online');
  const [statusTab, setStatusTab] = useState<(typeof STATUS_TABS)[number]>('All');
  const [query, setQuery] = useState('');

  const allOrders = useMemo<DemoOrder[]>(() => {
    const mappedUser: DemoOrder[] = userOrders.map((o) => ({
      id: o.id,
      channel: 'online',
      title: o.fulfillmentMode === 'delivery' ? 'Home delivery' : 'Click & collect',
      fulfillment: o.fulfillmentMode,
      status: 'To Ship',
      statusTab: 'To Ship',
      date: `Today ${o.createdAt}`,
      total: o.total,
      itemCount: o.itemCount,
      thumbnails: [ASSETS.wineBottleClean, ASSETS.kiwi, ASSETS.fujiApple],
      productIds: ['belena-shiraz', 'zespri-kiwi'],
    }));
    return [...mappedUser, ...DEMO_ORDERS];
  }, [userOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      if (o.channel !== channel) return false;
      if (statusTab !== 'All' && o.statusTab !== statusTab) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!o.title.toLowerCase().includes(q) && !o.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [allOrders, channel, statusTab, query]);

  const youMayLike = PRODUCTS.filter((p) =>
    ['nissin-pack', 'bin-180-wine', 'belena-shiraz', 'jumbo-blueberry'].includes(p.id)
  );

  const handleBuyAgain = (e: React.MouseEvent, productIds: string[]) => {
    e.stopPropagation();
    productIds.forEach((id) => addToCart(id, 1, undefined, true));
    showToast('Items added back to cart');
    navigate('cart');
  };

  return (
    <div className="min-h-dvh bg-[#F7F7F7] pb-[28px]">
      {/* Sticky Top Search Header (Figma 5981:285511) */}
      <header className="sticky top-0 z-30 bg-white pt-[env(safe-area-inset-top)]">
        <div className="h-[48px] px-[12px] flex items-center gap-[8px]">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="w-[32px] h-[32px] flex items-center justify-center shrink-0"
          >
            <img src={ICONS.chevronLeft} alt="" className="w-[24px] h-[24px] object-contain" />
          </button>

          <div className="h-[36px] flex-1 rounded-[8px] border border-[#E0E0E0] bg-white flex items-center pl-[10px] pr-[4px] gap-[6px]">
            <img src={ICONS.search} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="flex-1 min-w-0 text-[13px] text-[#1A1A1A] placeholder:text-[#858585] bg-transparent outline-none"
            />
            <button
              type="button"
              className="h-[28px] px-[10px] rounded-[4px] bg-[#FFF6F5] text-[#E40032] text-[12px] font-semibold shrink-0"
            >
              Search
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast('Customer support connected')}
            aria-label="Support"
            className="w-[32px] h-[32px] flex items-center justify-center shrink-0"
          >
            <img src="/assets/figma/me/help-agent.svg" alt="Support" className="w-[22px] h-[22px] object-contain" />
          </button>
        </div>

        {/* Channel Switch: Online Order / In-store */}
        <div className="grid grid-cols-2 text-[14px] leading-[20px]">
          <button
            type="button"
            onClick={() => setChannel('online')}
            className={`py-[10px] font-semibold transition-colors ${
              channel === 'online'
                ? 'bg-gradient-to-b from-[#FFF2F4] to-white text-[#E40032]'
                : 'bg-[#F7F7F7] text-[#3D3D3D] font-normal'
            }`}
          >
            Online Order
          </button>
          <button
            type="button"
            onClick={() => setChannel('instore')}
            className={`py-[10px] font-semibold transition-colors ${
              channel === 'instore'
                ? 'bg-gradient-to-b from-[#FFF2F4] to-white text-[#E40032]'
                : 'bg-[#F7F7F7] text-[#3D3D3D] font-normal'
            }`}
          >
            In-store
          </button>
        </div>

        {/* Status Tabs */}
        {channel === 'online' && (
          <div className="flex items-center justify-between px-[12px] border-b border-[#EFEFEF]">
            {STATUS_TABS.map((tab) => {
              const active = statusTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusTab(tab)}
                  className={`py-[10px] text-[13px] leading-[18px] border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'border-[#E40032] text-[#E40032] font-bold'
                      : 'border-transparent text-[#3D3D3D] font-normal'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Order Cards */}
      <div className="px-[8px] pt-[8px] space-y-[8px]">
        {filteredOrders.map((order) => (
          <article
            key={order.id}
            onClick={() => navigate('order-detail')}
            className="bg-white rounded-[12px] p-[12px] space-y-[10px] cursor-pointer active:bg-[#FCFCFC]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] leading-[20px] font-bold text-[#1A1A1A]">{order.title}</h2>
              <span className="text-[12px] leading-[16px] text-[#3D3D3D]">{order.status}</span>
            </div>

            {order.fulfillment !== 'instore' && (
              <div>
                <span className="inline-flex items-center gap-[4px] bg-[#F7F7F7] px-[6px] py-[2px] rounded-[4px] text-[11px] leading-[14px] text-[#3D3D3D]">
                  <img
                    src={order.fulfillment === 'delivery' ? ICONS.truckRed : ICONS.cncBag}
                    alt=""
                    className="w-[14px] h-[14px] object-contain"
                  />
                  {order.fulfillment === 'delivery' ? 'Home Delivery' : 'Click & collect'}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-[8px]">
              <div className="flex items-center gap-[8px] overflow-x-auto no-scrollbar">
                {order.thumbnails.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-[48px] h-[48px] rounded-[6px] bg-white border border-[#F2F2F2] p-0.5 flex items-center justify-center shrink-0"
                  >
                    <img src={src} alt="" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              <div className="text-right shrink-0 pl-[6px]">
                <p className="text-[14px] leading-[18px] font-bold text-[#1A1A1A]">
                  &#36;{order.total.toFixed(2)}
                </p>
                <p className="text-[11px] leading-[14px] text-[#858585] mt-[2px]">
                  {order.itemCount} items
                </p>
              </div>
            </div>

            <p className="text-[11px] leading-[14px] text-[#858585]">{order.date}</p>

            <div className="flex items-center justify-end gap-[6px] pt-[2px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`Viewing E-Receipt #${order.id}`);
                }}
                className="h-[30px] px-[10px] rounded-[6px] border border-[#E0E0E0] text-[12px] text-[#1A1A1A] font-medium active:bg-[#F7F7F7]"
              >
                E-Receipt
              </button>
              {order.showRefundReview && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast('Refund request opened');
                    }}
                    className="h-[30px] px-[10px] rounded-[6px] border border-[#E0E0E0] text-[12px] text-[#1A1A1A] font-medium active:bg-[#F7F7F7]"
                  >
                    Refund
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast('Write a review');
                    }}
                    className="h-[30px] px-[10px] rounded-[6px] border border-[#E0E0E0] text-[12px] text-[#1A1A1A] font-medium active:bg-[#F7F7F7]"
                  >
                    Review
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={(e) => handleBuyAgain(e, order.productIds)}
                className="h-[30px] px-[12px] rounded-[6px] bg-[#E40032] text-white text-[12px] font-semibold active:opacity-90"
              >
                Buy Again
              </button>
            </div>
          </article>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-[12px] p-10 text-center text-[13px] text-[#858585]">
            No orders found in this tab.
          </div>
        )}

        {/* You May Like */}
        <section className="pt-[8px]">
          <div className="flex items-center justify-between px-[4px] mb-[8px]">
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">You May Like</h2>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-[2px] text-[12px] text-[#666666]"
            >
              <span>See all</span>
              <img src={ICONS.chevronRight} alt="" className="w-[14px] h-[14px] object-contain" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-[8px]">
            {youMayLike.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
