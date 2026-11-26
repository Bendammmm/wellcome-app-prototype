export const CHECKOUT_ASSETS = {
  amexCard: '/assets/figma/checkout/7ef2f.png',
  yuuCoin: '/assets/figma/checkout/387ea.png',
  truckOutline: '/assets/figma/checkout/bbf77.svg',
  cncBagOutline: '/assets/figma/checkout/245d9.svg',
  chevronLeft: '/assets/figma/checkout/d8174.svg',
  chevronRightMuted: '/assets/figma/checkout/978bb.svg',
  chevronRightDark: '/assets/figma/checkout/3acc2.svg',
  viewItemsChevron: '/assets/figma/checkout/f82c8.svg',
  fadeEllipseOuter: '/assets/figma/checkout/1b420.svg',
  fadeEllipseInner: '/assets/figma/checkout/b8813.svg',
  infoOutlineSm: '/assets/figma/checkout/1384d.svg',
  infoOutlineMd: '/assets/figma/checkout/19e5c.svg',
  divider: '/assets/figma/checkout/350a2.svg',
  couponIcon: '/assets/figma/checkout/96599.svg',
  voucherIcon: '/assets/figma/checkout/a88aa.svg',
  yuuInnerLine: '/assets/figma/checkout/79372.svg',
  paymentDiscountIcon: '/assets/figma/checkout/da80d.svg',
  stampsIcon: '/assets/figma/checkout/48c1e.svg',
  checkGreenOutline: '/assets/figma/checkout/727d0.svg',
  close: '/assets/figma/checkout/24407.svg',
  radioMarked: '/assets/figma/checkout/5f893.svg',
  radioBlank: '/assets/figma/checkout/b355d.svg',
  // Payment Result (2329:178516)
  successCheckFilled: '/assets/figma/checkout/6dff6.svg',
  giftOutlineWhite: '/assets/figma/checkout/cc13a.svg',
  progressCheckRed: '/assets/figma/checkout/b4356.svg',
  progressCouponRed: '/assets/figma/checkout/2c595.svg',
  couponTicketBg: '/assets/figma/checkout/9fb22.svg',
  couponDashedLine: '/assets/figma/checkout/e4c0b.svg',
};

export interface DateOption {
  id: string;
  weekday: string;
  day: string;
  month: string;
  subLabel?: string;
  fullLabel: string;
}

export const DELIVERY_DATES: DateOption[] = [
  { id: 'tue-10', weekday: 'Tue', day: '10', month: 'Oct', subLabel: 'Today', fullLabel: 'Today' },
  { id: 'wed-11', weekday: 'Wed', day: '11', month: 'Oct', fullLabel: 'Wed 11 Oct' },
  { id: 'thu-12', weekday: 'Thu', day: '12', month: 'Oct', fullLabel: 'Thu 12 Oct' },
  { id: 'fri-13', weekday: 'Fri', day: '13', month: 'Oct', fullLabel: 'Fri 13 Oct' },
  { id: 'sat-14', weekday: 'Sat', day: '14', month: 'Oct', fullLabel: 'Sat 14 Oct' },
  { id: 'sun-15', weekday: 'Sun', day: '15', month: 'Oct', fullLabel: 'Sun 15 Oct' },
];

export const DELIVERY_TIME_SLOTS = [
  { id: 'slot-1', label: '14:00 - 18:00' },
  { id: 'slot-2', label: '18:00 - 21:00' },
  { id: 'slot-3', label: 'After 14:00' },
];

export const PICKUP_TIME_SLOTS = [
  { id: 'pickup-1', label: 'After 14:00' },
  { id: 'pickup-2', label: 'After 18:00' },
];

export interface PaymentMethodOption {
  id: string;
  name: string;
  last4?: string;
  subtitle?: string;
  discountAmount: number;
  icon?: string;
  badgeText?: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'amex-7833',
    name: 'AMEXcard',
    last4: '(7833)',
    subtitle: 'Instant $40 off on orders over $200',
    discountAmount: 40,
    icon: CHECKOUT_ASSETS.amexCard,
  },
  {
    id: 'enjoy-4921',
    name: 'Hang Seng enJoy Card',
    last4: '(4921)',
    subtitle: 'enJoy Card Day · 8% off over $600',
    discountAmount: 25,
    badgeText: 'enJoy',
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    subtitle: 'Fast & secure checkout',
    discountAmount: 0,
    badgeText: 'Pay',
  },
  {
    id: 'alipay-hk',
    name: 'AlipayHK',
    subtitle: 'Instant e-wallet payment',
    discountAmount: 10,
    badgeText: 'Alipay',
  },
];

export interface DiscountChoice {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
}

export const CHECKOUT_COUPONS: DiscountChoice[] = [
  { id: 'cp-10', title: '$10 Wellcome Coupon', subtitle: 'Valid on orders over $100', amount: 10 },
  { id: 'cp-30', title: '$30 Member Coupon', subtitle: 'Valid on orders over $300', amount: 30 },
  { id: 'cp-none', title: 'Do not use coupon', subtitle: 'Save for later', amount: 0 },
];

export const CHECKOUT_VOUCHERS: DiscountChoice[] = [
  { id: 'vc-10', title: '$10 Online Voucher', subtitle: 'Auto-applied for this order', amount: 10 },
  { id: 'vc-20', title: '$20 Fresh Food Voucher', subtitle: 'Valid on fresh produce & meat', amount: 20 },
  { id: 'vc-none', title: 'Do not use voucher', subtitle: 'Save for later', amount: 0 },
];

export const CHECKOUT_CASH_VOUCHERS: DiscountChoice[] = [
  { id: 'yuu-none', title: 'Do not use Cash Voucher', subtitle: 'Keep yuu points balance', amount: 0 },
  { id: 'yuu-20', title: '$20 yuu Cash Voucher', subtitle: 'Redeem 4,000 yuu Points', amount: 20 },
  { id: 'yuu-50', title: '$50 yuu Cash Voucher', subtitle: 'Redeem 10,000 yuu Points', amount: 50 },
];

export const OUT_OF_STOCK_OPTIONS = [
  {
    id: 'replace',
    label: 'Suggest replacement',
    description: 'Our shopper will pick the closest match in quality and price.',
  },
  {
    id: 'refund',
    label: 'Refund unavailable items',
    description: 'Automatically refund out-of-stock items to your original payment method.',
  },
  {
    id: 'call',
    label: 'Contact me by phone',
    description: 'Call before substituting any out-of-stock items.',
  },
];

export const WORRY_FREE_GUARANTEES = [
  {
    title: 'Comprehensive After-Sales Service',
    description:
      'If your order does not meet your expectations, you can request a refund within 72 hours of completing the order.',
  },
  {
    title: 'Quality Assurance',
    description:
      'Wellcome fresh food is carefully selected from origin to variety to ensure the freshness!',
  },
  {
    title: 'Cold Chain Delivery System',
    description:
      'Our specialists strictly monitor temperature and humidity, using a cold chain delivery system to ensure that the fresh food delivered to you remains fresh!',
  },
  {
    title: 'Automatic Refund',
    description:
      'If a product is out of stock, the refund will be automatically refunded to your original payment method.',
  },
];
