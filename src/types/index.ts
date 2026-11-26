export type RoutePage = 'home' | 'pdp' | 'cart' | 'smart-tips' | 'checkout' | 'payment-success';

export type FulfillmentMode = 'delivery' | 'click_and_collect';

export type PriceBannerType = 'default' | 'flash_deal' | 'everyday_value' | 'cnc_exclusive';

export interface ProductVariant {
  id: string;
  label: string;         // e.g. "1LT" or "6 X 1LT"
  fullTitle: string;     // e.g. "Grant Burge GB51 Cabernet Shiraz Case 6 X 750ML"
  price: number;
  originalPrice?: number;
  unitPriceText?: string; // e.g. "$100/Bottle" or "$60/Bottle" (Case deal replaces strikethrough)
  isCaseDeal?: boolean;
  badge?: string;        // e.g. "New"
  promoTag?: string;     // e.g. "20% Off"
  soldText?: string;     // e.g. "2k sold"
  image: string;
  extraLeadTime?: boolean;
}

export interface Product {
  id: string;
  name: string;
  shortSpec?: string;
  description?: string;
  image: string;
  gallery?: string[];
  price: number;
  originalPrice?: number;
  unitPriceText?: string;
  soldText?: string;
  badge?: 'New' | 'Coming soon' | 'Out of stock';
  promoTags?: string[];
  savedText?: string;
  category: 'Fruit & Vegetable' | 'Meat & Seafood' | 'Wine & Spirits' | 'Noodles & Pantry' | 'Snacks & Dairy';
  isFlashDeal?: boolean;
  isPreOrder?: boolean;
  isExtraLeadTime?: boolean;
  isOutOfStock?: boolean;
  priceBannerType?: PriceBannerType;
  promoGroupId?: '10-off' | 'buy2-30' | '2-for-20-off';
  giftItem?: {
    name: string;
    image: string;
    qty: number;
  };
  variants?: ProductVariant[];
  wineRatings?: {
    rp?: string;
    ws?: string;
    js?: string;
    awardText?: string;
    caseLabel?: string;
    isOrganic?: boolean;
    origin?: string;
  };
  highlights?: {
    rank?: string;
    rating?: string;
    reviewCount?: string;
    sold?: string;
    origin?: string;
  };
  specs?: {
    size: string;
    storage: string;
    origin: string;
    brandCategories: string[];
    grape?: string;
  };
  detailImages?: string[];
}

export interface CartItem {
  key: string; // `${productId}::${variantId || 'default'}`
  productId: string;
  variantId?: string;
  qty: number;
  selected: boolean;
  section: 'main' | 'preorder';
}

export interface DeliveryAddress {
  id: string;
  title: string;
  tag?: string;
  address: string;
  recipient: string;
  phone: string;
  shortNavLabel: string;
}

export interface PickupStore {
  id: string;
  name: string;
  distance: string;
  address: string;
  region: string;
  shortNavLabel: string;
}

export interface Coupon {
  id: string;
  amount: number;
  minSpend: number;
  condition: string;
  brandLabel?: string;
  brandIcon?: string;
  claimed: boolean;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  fulfillmentMode: FulfillmentMode;
  destination: string;
  itemCount: number;
  total: number;
  saved: number;
  deliverySlot?: string;
  paymentMethod?: string;
  remarks?: string;
  outOfStockPreference?: string;
  yuuPoints?: number;
  stamps?: number;
}
