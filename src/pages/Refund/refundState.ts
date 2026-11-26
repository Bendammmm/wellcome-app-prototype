import { REFUND_ASSETS } from './refundAssets';

export interface RefundItemDraft {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  unitPrice: number;
  originalPrice?: number;
  savedText?: string;
  qty: number;
  maxQty: number;
  selected: boolean;
  reason: string;
  issueDetails: string;
  photos: { id: string; label: string; bg: string }[];
  gift?: {
    name: string;
    qty: number;
  };
}

export interface SubmittedRefundRecord {
  caseNumber: string;
  reasonSummary: string;
  items: {
    id: string;
    name: string;
    subtitle?: string;
    image: string;
    unitPrice: number;
    originalPrice?: number;
    savedText?: string;
    qty: number;
  }[];
  itemSubtotal: number;
  packagingFee: number;
  pickupServiceFee: number;
  totalRefund: number;
}

export const REFUND_REASON_OPTIONS = [
  'Leaking after opening',
  'Product issue › Damaged packaging',
  'Wrong item delivered',
  'Expired or quality issue',
  'Missing item from parcel',
];

export const INITIAL_REFUND_ITEMS: RefundItemDraft[] = [
  {
    id: 'rf-1',
    name: 'China Fuji Apple 1EA',
    subtitle: 'Quantity',
    image: REFUND_ASSETS.prodBeef,
    unitPrice: 15,
    originalPrice: 18,
    savedText: 'Saved: $50.00',
    qty: 1,
    maxQty: 5,
    selected: true,
    reason: 'Leaking after opening',
    issueDetails: 'Outer box crushed on arrival.\nTwo packs were leaking.',
    photos: [
      { id: 'p1', label: 'Photo 1', bg: '#EFE4DD' },
      { id: 'p2', label: 'Photo 2', bg: '#E8EEF1' },
    ],
  },
  {
    id: 'rf-2',
    name: 'Nissin Demae Iccho Sesame Oil Noodle Case 30 X 91/100GM (random Package Delivery)',
    image: REFUND_ASSETS.prodBeef,
    unitPrice: 15,
    originalPrice: 22,
    savedText: 'Saved: $50.00',
    qty: 1,
    maxQty: 4,
    selected: true,
    reason: 'Leaking after opening',
    issueDetails: 'Outer box crushed on arrival.\nTwo packs were leaking.',
    photos: [
      { id: 'p1', label: 'Photo 1', bg: '#EFE4DD' },
      { id: 'p2', label: 'Photo 2', bg: '#E8EEF1' },
    ],
  },
  {
    id: 'rf-3',
    name: 'Belena barossa Shiraz Red Wine 750 ML',
    image: REFUND_ASSETS.prodBeef,
    unitPrice: 128,
    qty: 2,
    maxQty: 6,
    selected: true,
    reason: 'Leaking after opening',
    issueDetails: 'Outer box crushed on arrival.\nTwo packs were leaking.',
    photos: [
      { id: 'p1', label: 'Photo 1', bg: '#EFE4DD' },
      { id: 'p2', label: 'Photo 2', bg: '#E8EEF1' },
    ],
  },
  {
    id: 'rf-4',
    name: 'Jumbo Blueberry Tube 200GM',
    image: REFUND_ASSETS.prodBeef,
    unitPrice: 128,
    originalPrice: 150,
    savedText: 'Saved: $50.00',
    qty: 1,
    maxQty: 3,
    selected: true,
    reason: 'Leaking after opening',
    issueDetails: 'Outer box crushed on arrival.\nTwo packs were leaking.',
    photos: [
      { id: 'p1', label: 'Photo 1', bg: '#EFE4DD' },
      { id: 'p2', label: 'Photo 2', bg: '#E8EEF1' },
    ],
    gift: {
      name: 'Jumbo Blueberry Tube 200GM',
      qty: 1,
    },
  },
];

export const DEFAULT_SUBMITTED_REFUND: SubmittedRefundRecord = {
  caseNumber: 'AS20260908000012',
  reasonSummary: 'Product issue › Damaged packaging',
  items: INITIAL_REFUND_ITEMS.map((item) => ({
    id: item.id,
    name: item.name,
    subtitle: item.subtitle,
    image: item.image,
    unitPrice: item.unitPrice,
    originalPrice: item.originalPrice,
    savedText: item.savedText,
    qty: item.qty,
  })),
  itemSubtotal: 160,
  packagingFee: 12,
  pickupServiceFee: 5,
  totalRefund: 128,
};

let lastSubmittedRefund: SubmittedRefundRecord | null = null;

export function setLastSubmittedRefund(record: SubmittedRefundRecord) {
  lastSubmittedRefund = record;
}

export function getLastSubmittedRefund(): SubmittedRefundRecord {
  return lastSubmittedRefund ?? DEFAULT_SUBMITTED_REFUND;
}
