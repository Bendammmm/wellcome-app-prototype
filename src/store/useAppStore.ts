import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppTheme,
  AuthUser,
  CartItem,
  Coupon,
  FulfillmentMode,
  OrderRecord,
  RoutePage,
} from '../types';
import {
  DELIVERY_ADDRESSES,
  HOME_COUPONS,
  INITIAL_CART_ITEMS,
  PICKUP_STORES,
  getEffectiveItemMeta,
  getProductById,
} from '../data/catalog';

export interface ThresholdConfig {
  minOrder: number;       // Delivery: 200, C&C: 50
  freeFeeAt: number;      // Delivery: 500, C&C: 200
  bonusRewardAt: number;  // Both: 800 (12% off)
  baseFee: number;        // Delivery: 50, C&C: 20
}

export const THRESHOLD_CONFIG: Record<FulfillmentMode, ThresholdConfig> = {
  delivery: {
    minOrder: 200,
    freeFeeAt: 500,
    bonusRewardAt: 800,
    baseFee: 50,
  },
  click_and_collect: {
    minOrder: 50,
    freeFeeAt: 200,
    bonusRewardAt: 800,
    baseFee: 20,
  },
};

export interface PricingSummary {
  config: ThresholdConfig;
  selectedCount: number;
  totalUnits: number;
  rawSubtotal: number;
  promoDiscount: number;
  tier12Discount: number;
  couponDiscount: number;
  subtotalAfterPromo: number;
  deliveryFee: number;
  freeDeliverySaved: number;
  packagingFee: number;
  finalTotal: number;
  totalSaved: number;
  meetsMinimum: boolean;
  hasFreeDelivery: boolean;
  hasMaxReward: boolean;
  progressPercent: number; // 0 to 100 across 3 milestones (node1=25%, node2=62.5%, node3=100%)
  yuuPoints: number;
  stamps: number;
  hasExtraLeadTimeSelected: boolean;
  earliestDateLabel: string;
}

export interface ToastMessage {
  id: number;
  text: string;
  undoLabel?: string;
  onUndo?: () => void;
}

interface AppState {
  // Brand & Theme ('we' | 'mp-before' | 'mp-opt1')
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;

  // Routing
  activePage: RoutePage;
  activeProductId: string;
  history: { page: RoutePage; productId?: string }[];

  // Fulfillment
  fulfillmentMode: FulfillmentMode;
  selectedAddressId: string;
  selectedStoreId: string;
  fulfillmentSheetOpen: boolean;

  // Cart & Commerce
  cartItems: CartItem[];
  coupons: Coupon[];
  appliedPromoCode: string | null;
  promoCodeDiscount: number;
  wishlistIds: string[];
  redeemVisible: boolean; // Configurable per Figma sticky note 8025:103687
  orders: OrderRecord[];

  // Transient UI
  toast: ToastMessage | null;

  // Search
  searchQuery: string;
  searchHistory: string[];

  // Auth
  authUser: AuthUser | null;

  // Navigation actions
  navigate: (page: RoutePage, productId?: string) => void;
  goBack: () => void;

  // Fulfillment actions
  openFulfillmentSheet: () => void;
  closeFulfillmentSheet: () => void;
  setFulfillment: (mode: FulfillmentMode, addressId?: string, storeId?: string) => void;

  // Cart actions
  addToCart: (productId: string, qty?: number, variantId?: string, silent?: boolean) => void;
  setCartItemQty: (key: string, qty: number) => void;
  removeCartItem: (key: string, allowUndo?: boolean) => void;
  toggleItemSelected: (key: string) => void;
  toggleSelectAll: () => void;
  removeSelectedItems: () => void;
  deselectExtraLeadTimeItems: () => void;
  clearCart: () => void;
  resetDemoCart: () => void;

  // Promos & Wishlist
  claimCoupon: (couponId: string) => void;
  applyPromoCode: (code: string) => boolean;
  toggleWishlist: (productId: string) => void;
  setRedeemVisible: (visible: boolean) => void;

  // Mock Checkout
  submitMockOrder: (options?: {
    deliverySlot?: string;
    paymentMethod?: string;
    remarks?: string;
    outOfStockPreference?: string;
    extraDiscount?: number;
  }) => OrderRecord;

  // Toast
  showToast: (text: string, undoLabel?: string, onUndo?: () => void) => void;
  dismissToast: () => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  submitSearch: (query: string) => void;
  clearSearchHistory: () => void;

  // Auth actions
  signIn: (user: Omit<AuthUser, 'signedInAt'>) => void;
  signOut: () => void;
}

export function computePricingSummary(
  cartItems: CartItem[],
  fulfillmentMode: FulfillmentMode,
  promoCodeDiscount: number
): PricingSummary {
  const config = THRESHOLD_CONFIG[fulfillmentMode];
  const selectedItems = cartItems.filter((item) => item.selected && item.qty > 0);
  const selectedCount = selectedItems.length;
  const totalUnits = selectedItems.reduce((sum, i) => sum + i.qty, 0);

  let rawSubtotal = 0;
  let originalCompareTotal = 0;
  let promoDiscount = 0;
  let hasExtraLeadTimeSelected = false;

  for (const item of selectedItems) {
    const meta = getEffectiveItemMeta(item.productId, item.variantId);
    const lineRaw = meta.price * item.qty;
    rawSubtotal += lineRaw;
    originalCompareTotal += (meta.originalPrice ?? meta.price) * item.qty;
    if (meta.isExtraLeadTime) {
      hasExtraLeadTimeSelected = true;
    }

    // Group promo rules matching Figma Cart labels
    if (meta.product.promoGroupId === '10-off') {
      promoDiscount += Number((lineRaw * 0.1).toFixed(2));
    } else if (meta.product.promoGroupId === 'buy2-30' && item.qty >= 2) {
      const pairs = Math.floor(item.qty / 2);
      const pairDiscount = Math.max(0, pairs * (meta.price * 2 - 30));
      promoDiscount += Number(pairDiscount.toFixed(2));
    } else if (meta.product.promoGroupId === '2-for-20-off' && item.qty >= 2) {
      promoDiscount += Number((lineRaw * 0.2).toFixed(2));
    }
  }

  const subtotalAfterPromo = Math.max(0, Number((rawSubtotal - promoDiscount).toFixed(2)));
  const meetsMinimum = subtotalAfterPromo >= config.minOrder;
  const hasFreeDelivery = subtotalAfterPromo >= config.freeFeeAt;
  const hasMaxReward = subtotalAfterPromo >= config.bonusRewardAt;

  const tier12Discount = hasMaxReward ? Number((subtotalAfterPromo * 0.12).toFixed(2)) : 0;
  const couponDiscount = subtotalAfterPromo > 0 ? Math.min(promoCodeDiscount, subtotalAfterPromo) : 0;

  const deliveryFee =
    subtotalAfterPromo === 0 || hasFreeDelivery ? 0 : config.baseFee;
  const freeDeliverySaved = subtotalAfterPromo > 0 && hasFreeDelivery ? config.baseFee : 0;
  const packagingFee = subtotalAfterPromo > 0 ? 2 : 0;

  const finalTotal = Math.max(
    0,
    Number(
      (
        subtotalAfterPromo -
        tier12Discount -
        couponDiscount +
        deliveryFee
      ).toFixed(2)
    )
  );

  const retailMarkdownSaved = Math.max(0, originalCompareTotal - rawSubtotal);
  const totalSaved = Number(
    (retailMarkdownSaved + promoDiscount + tier12Discount + couponDiscount + freeDeliverySaved).toFixed(2)
  );

  // Compute piecewise progress bar matching Figma's 3 visually spaced nodes (25%, 62.5%, 100%)
  let progressPercent = 0;
  if (subtotalAfterPromo <= 0) {
    progressPercent = 0;
  } else if (subtotalAfterPromo < config.minOrder) {
    progressPercent = (subtotalAfterPromo / config.minOrder) * 25;
  } else if (subtotalAfterPromo < config.freeFeeAt) {
    progressPercent =
      25 +
      ((subtotalAfterPromo - config.minOrder) / (config.freeFeeAt - config.minOrder)) * 37.5;
  } else if (subtotalAfterPromo < config.bonusRewardAt) {
    progressPercent =
      62.5 +
      ((subtotalAfterPromo - config.freeFeeAt) / (config.bonusRewardAt - config.freeFeeAt)) * 37.5;
  } else {
    progressPercent = 100;
  }

  return {
    config,
    selectedCount,
    totalUnits,
    rawSubtotal,
    promoDiscount,
    tier12Discount,
    couponDiscount,
    subtotalAfterPromo,
    deliveryFee,
    freeDeliverySaved,
    packagingFee,
    finalTotal,
    totalSaved,
    meetsMinimum,
    hasFreeDelivery,
    hasMaxReward,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    yuuPoints: Math.round(finalTotal / 10),
    stamps: Math.floor(finalTotal / 100),
    hasExtraLeadTimeSelected,
    earliestDateLabel: hasExtraLeadTimeSelected ? '15 Jun 18:00' : '12 Jun 14:00',
  };
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

const MP_ALLOWED_PAGES = new Set<RoutePage>(['home', 'categories', 'cart', 'pdp']);

function getInitialThemeFromUrl(): AppTheme {
  if (typeof window === 'undefined') return 'we';
  const pathname = window.location.pathname.toLowerCase();
  if (pathname.startsWith('/mp-before')) return 'mp-before';
  if (pathname.startsWith('/mp')) return 'mp-opt1';
  return 'we';
}

function syncBrowserThemeMeta(theme: AppTheme) {
  if (typeof window === 'undefined') return;
  document.title =
    theme === 'we' ? 'Wellcome App Prototype' : 'Market Place App Prototype';
  const targetPath =
    theme === 'mp-opt1' ? '/mp' : theme === 'mp-before' ? '/mp-before' : '/';
  const url = new URL(window.location.href);
  url.pathname = targetPath;
  url.searchParams.delete('theme');
  url.searchParams.delete('brand');
  window.history.replaceState({}, '', url.toString());
}

const INITIAL_APP_THEME = getInitialThemeFromUrl();
if (typeof document !== 'undefined') {
  document.title =
    INITIAL_APP_THEME === 'we'
      ? 'Wellcome App Prototype'
      : 'Market Place App Prototype';
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      appTheme: INITIAL_APP_THEME,
      setAppTheme: (theme) => {
        const current = get().appTheme;
        // Strict WE vs MP isolation: disallow cross-brand switching
        if (current === 'we' && theme !== 'we') return;
        if (current !== 'we' && theme === 'we') return;
        set({ appTheme: theme });
        syncBrowserThemeMeta(theme);
      },

      activePage: 'home',
      activeProductId: 'belena-shiraz',
      history: [],

      fulfillmentMode: 'delivery',
      selectedAddressId: DELIVERY_ADDRESSES[0].id,
      selectedStoreId: PICKUP_STORES[0].id,
      fulfillmentSheetOpen: false,

      cartItems: INITIAL_CART_ITEMS,
      coupons: HOME_COUPONS,
      appliedPromoCode: null,
      promoCodeDiscount: 0,
      wishlistIds: [],
      redeemVisible: true,
      orders: [],
      toast: null,
      searchQuery: 'Milk',
      searchHistory: ['Vitamins', 'Collagen peptides', 'Cocoa powder', 'Protein bars', 'Curcumin'],
      authUser: null,

      navigate: (page, productId) => {
        const state = get();
        if (state.appTheme !== 'we' && !MP_ALLOWED_PAGES.has(page)) {
          state.showToast('该功能暂未实现');
          return;
        }
        const nextHistory = [
          ...state.history.slice(-15),
          { page: state.activePage, productId: state.activeProductId },
        ];
        set({
          activePage: page,
          activeProductId: productId ?? state.activeProductId,
          history: nextHistory,
        });
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      },

      goBack: () => {
        const state = get();
        if (state.history.length > 0) {
          const prev = state.history[state.history.length - 1];
          set({
            activePage: prev.page,
            activeProductId: prev.productId ?? state.activeProductId,
            history: state.history.slice(0, -1),
          });
        } else {
          set({ activePage: 'home' });
        }
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      },

      openFulfillmentSheet: () => {
        const state = get();
        if (state.appTheme !== 'we') {
          state.showToast('该功能暂未实现');
          return;
        }
        set({ fulfillmentSheetOpen: true });
      },
      closeFulfillmentSheet: () => set({ fulfillmentSheetOpen: false }),

      setFulfillment: (mode, addressId, storeId) => {
        set((s) => ({
          fulfillmentMode: mode,
          selectedAddressId: addressId ?? s.selectedAddressId,
          selectedStoreId: storeId ?? s.selectedStoreId,
          fulfillmentSheetOpen: false,
        }));
        get().showToast(
          mode === 'delivery'
            ? 'Switched to Home Delivery ($200 min · $500 free)'
            : 'Switched to Click & Collect ($50 min · $200 free)'
        );
      },

      addToCart: (productId, qty = 1, variantId, silent = false) => {
        const product = getProductById(productId);
        const resolvedVariantId = variantId ?? product.variants?.[0]?.id;
        const key = `${productId}::${resolvedVariantId || 'default'}`;

        set((state) => {
          const existing = state.cartItems.find((i) => i.key === key);
          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.key === key ? { ...i, qty: i.qty + qty, selected: true } : i
              ),
            };
          }
          return {
            cartItems: [
              ...state.cartItems,
              {
                key,
                productId,
                variantId: resolvedVariantId,
                qty,
                selected: true,
                section: product.isPreOrder ? 'preorder' : 'main',
              },
            ],
          };
        });

        if (!silent) {
          get().showToast(`Added to cart`);
        }
      },

      setCartItemQty: (key, qty) => {
        if (qty <= 0) {
          get().removeCartItem(key, true);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((i) => (i.key === key ? { ...i, qty } : i)),
        }));
      },

      removeCartItem: (key, allowUndo = true) => {
        const removed = get().cartItems.find((i) => i.key === key);
        if (!removed) return;
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.key !== key),
        }));
        if (allowUndo) {
          get().showToast('Item removed from cart', 'Undo', () => {
            set((state) => ({
              cartItems: [...state.cartItems, removed],
            }));
          });
        }
      },

      toggleItemSelected: (key) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.key === key ? { ...i, selected: !i.selected } : i
          ),
        })),

      toggleSelectAll: () =>
        set((state) => {
          const allSelected =
            state.cartItems.length > 0 && state.cartItems.every((i) => i.selected);
          return {
            cartItems: state.cartItems.map((i) => ({ ...i, selected: !allSelected })),
          };
        }),

      removeSelectedItems: () => {
        const removed = get().cartItems.filter((i) => i.selected);
        if (removed.length === 0) return;
        set((state) => ({
          cartItems: state.cartItems.filter((i) => !i.selected),
        }));
        get().showToast(`Removed ${removed.length} item(s)`, 'Undo', () => {
          set((state) => ({
            cartItems: [...state.cartItems, ...removed],
          }));
        });
      },

      deselectExtraLeadTimeItems: () => {
        set((state) => ({
          cartItems: state.cartItems.map((item) => {
            const meta = getEffectiveItemMeta(item.productId, item.variantId);
            return meta.isExtraLeadTime ? { ...item, selected: false } : item;
          }),
        }));
        get().showToast('Earliest delivery advanced to 12 Jun');
      },

      clearCart: () => set({ cartItems: [] }),

      resetDemoCart: () => {
        set({ cartItems: INITIAL_CART_ITEMS, appliedPromoCode: null, promoCodeDiscount: 0 });
        get().showToast('Demo cart restored');
      },

      claimCoupon: (couponId) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === couponId ? { ...c, claimed: true } : c
          ),
        }));
        get().showToast('Coupon saved to your wallet');
      },

      applyPromoCode: (code) => {
        const cleaned = code.trim().toUpperCase();
        if (!cleaned) return false;
        const discount = cleaned === 'WELLCOME30' ? 30 : 10;
        set({ appliedPromoCode: cleaned, promoCodeDiscount: discount });
        get().showToast(`Promo code ${cleaned} applied (-$${discount}.00)`);
        return true;
      },

      toggleWishlist: (productId) => {
        const exists = get().wishlistIds.includes(productId);
        set((state) => ({
          wishlistIds: exists
            ? state.wishlistIds.filter((id) => id !== productId)
            : [...state.wishlistIds, productId],
        }));
        get().showToast(exists ? 'Removed from favorites' : 'Saved to favorites');
      },

      setRedeemVisible: (visible) => set({ redeemVisible: visible }),

      submitMockOrder: (options) => {
        const state = get();
        const pricing = computePricingSummary(
          state.cartItems,
          state.fulfillmentMode,
          state.promoCodeDiscount
        );
        const dest =
          state.fulfillmentMode === 'delivery'
            ? DELIVERY_ADDRESSES.find((a) => a.id === state.selectedAddressId)?.title ??
              'Laguna Verde Tower 3 18/F'
            : PICKUP_STORES.find((s) => s.id === state.selectedStoreId)?.name ?? 'Lok Ma Chau';

        const extraDiscount = options?.extraDiscount ?? 0;
        const adjustedTotal = Math.max(
          0,
          Number((pricing.finalTotal + pricing.packagingFee - extraDiscount).toFixed(2))
        );
        const adjustedSaved = Number((pricing.totalSaved + extraDiscount).toFixed(2));

        const order: OrderRecord = {
          id: `WE${Date.now().toString().slice(-8)}`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fulfillmentMode: state.fulfillmentMode,
          destination: dest,
          itemCount: pricing.totalUnits,
          total: adjustedTotal,
          saved: adjustedSaved,
          deliverySlot: options?.deliverySlot,
          paymentMethod: options?.paymentMethod,
          remarks: options?.remarks,
          outOfStockPreference: options?.outOfStockPreference,
          yuuPoints: pricing.yuuPoints,
          stamps: pricing.stamps,
        };

        set((s) => ({
          orders: [order, ...s.orders],
          cartItems: s.cartItems.filter((i) => !i.selected),
          appliedPromoCode: null,
          promoCodeDiscount: 0,
        }));

        return order;
      },

      showToast: (text, undoLabel, onUndo) => {
        if (toastTimer) clearTimeout(toastTimer);
        const id = Date.now();
        set({ toast: { id, text, undoLabel, onUndo } });
        toastTimer = setTimeout(() => {
          if (get().toast?.id === id) {
            set({ toast: null });
          }
        }, 2800);
      },

      dismissToast: () => {
        if (toastTimer) clearTimeout(toastTimer);
        set({ toast: null });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      submitSearch: (query) => {
        const state = get();
        if (state.appTheme !== 'we') {
          state.showToast('该功能暂未实现');
          return;
        }
        const cleaned = query.trim();
        if (!cleaned) return;
        const deduped = [
          cleaned,
          ...state.searchHistory.filter((item) => item.toLowerCase() !== cleaned.toLowerCase()),
        ].slice(0, 12);
        const nextHistory = [
          ...state.history.slice(-15),
          { page: state.activePage, productId: state.activeProductId },
        ];
        set({
          searchQuery: cleaned,
          searchHistory: deduped,
          activePage: 'search-results',
          history: nextHistory,
        });
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
        get().showToast('Search history cleared');
      },

      signIn: (user) => {
        set({
          authUser: {
            ...user,
            signedInAt: new Date().toISOString(),
          },
        });
      },

      signOut: () => {
        set({ authUser: null });
        get().showToast('Signed out');
      },
    }),
    {
      name: 'wellcome-prototype-v1',
      partialize: (state) => ({
        fulfillmentMode: state.fulfillmentMode,
        selectedAddressId: state.selectedAddressId,
        selectedStoreId: state.selectedStoreId,
        cartItems: state.cartItems,
        coupons: state.coupons,
        wishlistIds: state.wishlistIds,
        redeemVisible: state.redeemVisible,
        orders: state.orders,
        searchHistory: state.searchHistory,
        authUser: state.authUser,
      }),
    }
  )
);

export function getCartQtyForProduct(cartItems: CartItem[], productId: string, variantId?: string) {
  if (variantId) {
    return cartItems.find((i) => i.key === `${productId}::${variantId}`)?.qty ?? 0;
  }
  return cartItems
    .filter((i) => i.productId === productId)
    .reduce((sum, i) => sum + i.qty, 0);
}

export function getTotalCartCount(cartItems: CartItem[]) {
  return cartItems.reduce((sum, i) => sum + i.qty, 0);
}
