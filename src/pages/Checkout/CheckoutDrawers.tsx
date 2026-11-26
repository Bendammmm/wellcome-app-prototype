import React, { useEffect, useState } from 'react';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { getEffectiveItemMeta } from '../../data/catalog';
import type { CartItem, FulfillmentMode } from '../../types';
import {
  CHECKOUT_ASSETS,
  DELIVERY_DATES,
  DELIVERY_TIME_SLOTS,
  OUT_OF_STOCK_OPTIONS,
  PAYMENT_METHODS,
  PICKUP_TIME_SLOTS,
  type DiscountChoice,
  type PaymentMethodOption,
} from './checkoutAssets';

/* ─── 1. Delivery / Pick-up Date & Time Drawer (Figma 6853:251554) ─── */
interface TimeSlotDrawerProps {
  open: boolean;
  onClose: () => void;
  fulfillmentMode: FulfillmentMode;
  selectedDateId: string;
  selectedSlotId: string;
  onConfirm: (dateId: string, slotId: string, label: string) => void;
}

export const TimeSlotDrawer: React.FC<TimeSlotDrawerProps> = ({
  open,
  onClose,
  fulfillmentMode,
  selectedDateId,
  selectedSlotId,
  onConfirm,
}) => {
  const isDelivery = fulfillmentMode === 'delivery';
  const slots = isDelivery ? DELIVERY_TIME_SLOTS : PICKUP_TIME_SLOTS;

  const [draftDateId, setDraftDateId] = useState(selectedDateId);
  const [draftSlotId, setDraftSlotId] = useState(selectedSlotId || slots[0].id);

  useEffect(() => {
    if (open) {
      setDraftDateId(selectedDateId);
      setDraftSlotId(
        slots.some((s) => s.id === selectedSlotId) ? selectedSlotId : slots[0].id
      );
    }
  }, [open, selectedDateId, selectedSlotId, slots]);

  const handleContinue = () => {
    const dateObj = DELIVERY_DATES.find((d) => d.id === draftDateId) ?? DELIVERY_DATES[0];
    const slotObj = slots.find((s) => s.id === draftSlotId) ?? slots[0];
    onConfirm(dateObj.id, slotObj.id, `${dateObj.fullLabel}, ${slotObj.label}`);
    onClose();
  };

  return (
    <BottomSheetDrawer
      open={open}
      onClose={onClose}
      hideHeader
      footer={
        <button
          type="button"
          onClick={handleContinue}
          className="w-full h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] leading-[24px] font-bold active:opacity-90 transition-opacity"
        >
          Continue
        </button>
      }
    >
      {/* NavigationBar matching 6853:251554 */}
      <div className="bg-white h-[48px] px-[12px] flex items-center gap-[8px]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
        >
          <img
            src={CHECKOUT_ASSETS.close}
            alt=""
            className="w-[28px] h-[28px] object-contain"
          />
        </button>
        <h3 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A] truncate">
          {isDelivery ? 'Select delivery date & time' : 'Select pick-up date & time'}
        </h3>
        <div className="w-[36px] h-[36px] shrink-0" />
      </div>

      {/* Horizontal Date Selector */}
      <div className="bg-white px-[16px] pt-[8px] pb-[32px] flex items-center gap-[12px] overflow-x-auto no-scrollbar">
        {DELIVERY_DATES.map((date) => {
          const active = draftDateId === date.id;
          return (
            <button
              key={date.id}
              type="button"
              onClick={() => setDraftDateId(date.id)}
              className={`relative shrink-0 rounded-[4px] px-[20px] py-[8px] flex flex-col items-center justify-center text-center transition-colors ${
                active
                  ? 'border-[3px] border-[#E40032] text-[#E40032] bg-white'
                  : 'border border-[#808080] text-[#666666] bg-white'
              }`}
            >
              <span className="text-[12px] leading-[16px] font-semibold">
                {date.weekday}
              </span>
              <span className="text-[16px] leading-[24px] font-bold">{date.day}</span>
              <span className="text-[12px] leading-[16px] font-semibold">
                {date.month}
              </span>
              {date.subLabel && (
                <span
                  className={`absolute left-1/2 -translate-x-1/2 top-[76px] text-[12px] leading-[16px] font-bold whitespace-nowrap ${
                    active ? 'text-[#E40032]' : 'text-[#666666]'
                  }`}
                >
                  {date.subLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Time Slot Radio List */}
      <div className="bg-white border-t border-[#E0E0E0] p-[16px] flex flex-col gap-[12px]">
        {slots.map((slot) => {
          const active = draftSlotId === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => setDraftSlotId(slot.id)}
              className="h-[48px] w-full flex items-center gap-[12px] text-left"
            >
              <img
                src={active ? CHECKOUT_ASSETS.radioMarked : CHECKOUT_ASSETS.radioBlank}
                alt=""
                className="w-[24px] h-[24px] shrink-0"
              />
              <span
                className={`text-[14px] leading-[20px] font-bold ${
                  active ? 'text-[#E40032]' : 'text-[#444444]'
                }`}
              >
                {slot.label}
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheetDrawer>
  );
};

/* ─── 2. Order Product Listing Drawer (Figma 6848:249800) ─── */
interface OrderItemsDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
}

export const OrderItemsDrawer: React.FC<OrderItemsDrawerProps> = ({
  open,
  onClose,
  items,
}) => {
  return (
    <BottomSheetDrawer open={open} onClose={onClose} hideHeader maxHeightClass="max-h-[82dvh]">
      <div className="bg-white h-[48px] px-[12px] flex items-center gap-[8px] sticky top-0 z-10 border-b border-[#F2F2F2]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
        >
          <img
            src={CHECKOUT_ASSETS.close}
            alt=""
            className="w-[28px] h-[28px] object-contain"
          />
        </button>
        <h3 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
          Items
        </h3>
        <div className="w-[36px] h-[36px] shrink-0" />
      </div>

      <div className="px-[16px] py-[8px] flex flex-col gap-[12px] pb-[24px]">
        {items.map((item) => {
          const meta = getEffectiveItemMeta(item.productId, item.variantId);
          const lineTotal = (meta.price * item.qty).toFixed(2);
          const [intPart, decPart] = lineTotal.split('.');
          const origLineTotal =
            meta.originalPrice && meta.originalPrice > meta.price
              ? (meta.originalPrice * item.qty).toFixed(2)
              : null;

          return (
            <div key={item.key} className="py-[8px] flex items-start gap-[8px]">
              <div className="w-[56px] h-[53px] rounded-[2px] border border-[#E5E5E5] bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={meta.image}
                  alt={meta.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                <p className="text-[14px] leading-[20px] font-normal text-[#1A1A1A] line-clamp-2">
                  {meta.title}
                </p>

                <div className="flex items-end justify-between gap-2">
                  <span className="text-[14px] leading-[20px] font-normal text-[#1A1A1A]">
                    Qty: {item.qty}
                  </span>

                  <div className="flex items-baseline gap-[4px]">
                    {origLineTotal && (
                      <span className="text-[10px] leading-[12px] text-[#969696] line-through">
                        &#36;{origLineTotal}
                      </span>
                    )}
                    <span className="inline-flex items-baseline font-bold text-[#E40032]">
                      <span className="text-[10px] leading-[12px]">&#36;</span>
                      <span className="text-[16px] leading-[16px]">{intPart}</span>
                      <span className="text-[10px] leading-[12px]">.{decPart}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BottomSheetDrawer>
  );
};

/* ─── 3. Remarks Drawer (Figma 6848:249732) ─── */
interface RemarksDrawerProps {
  open: boolean;
  onClose: () => void;
  allowPhone: boolean;
  allowKnock: boolean;
  note: string;
  onConfirm: (next: { allowPhone: boolean; allowKnock: boolean; note: string }) => void;
}

export const RemarksDrawer: React.FC<RemarksDrawerProps> = ({
  open,
  onClose,
  allowPhone,
  allowKnock,
  note,
  onConfirm,
}) => {
  const [draftPhone, setDraftPhone] = useState(allowPhone);
  const [draftKnock, setDraftKnock] = useState(allowKnock);
  const [draftNote, setDraftNote] = useState(note);

  useEffect(() => {
    if (open) {
      setDraftPhone(allowPhone);
      setDraftKnock(allowKnock);
      setDraftNote(note);
    }
  }, [open, allowPhone, allowKnock, note]);

  const handleSave = () => {
    onConfirm({ allowPhone: draftPhone, allowKnock: draftKnock, note: draftNote.trim() });
    onClose();
  };

  return (
    <BottomSheetDrawer
      open={open}
      onClose={onClose}
      hideHeader
      footer={
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] leading-[24px] font-bold active:opacity-90 transition-opacity"
        >
          Confirm
        </button>
      }
    >
      <div className="bg-[#F7F7F7]">
        {/* NavigationBar */}
        <div className="bg-[#F7F7F7] h-[48px] px-[12px] flex items-center gap-[8px]">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
          >
            <img
              src={CHECKOUT_ASSETS.close}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
          </button>
          <h3 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
            Remarks
          </h3>
          <div className="w-[36px] h-[36px] shrink-0" />
        </div>

        <div className="px-[12px] py-[8px] pb-[16px] flex flex-col gap-[8px]">
          {/* Toggle Card */}
          <div className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[8px]">
            <div className="py-[4px] flex items-center justify-between gap-[8px]">
              <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                Contact me by phone.
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={draftPhone}
                onClick={() => setDraftPhone((v) => !v)}
                className={`w-[50px] h-[30px] rounded-full p-[2px] transition-colors shrink-0 flex items-center ${
                  draftPhone ? 'bg-[#E40032] justify-end' : 'bg-[#D6D6D6] justify-start'
                }`}
              >
                <span className="w-[26px] h-[26px] rounded-full bg-white shadow-sm block" />
              </button>
            </div>

            <div className="py-[4px] flex items-center justify-between gap-[8px]">
              <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                Knock on the door/ring the doorbell
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={draftKnock}
                onClick={() => setDraftKnock((v) => !v)}
                className={`w-[50px] h-[30px] rounded-full p-[2px] transition-colors shrink-0 flex items-center ${
                  draftKnock ? 'bg-[#E40032] justify-end' : 'bg-[#D6D6D6] justify-start'
                }`}
              >
                <span className="w-[26px] h-[26px] rounded-full bg-white shadow-sm block" />
              </button>
            </div>
          </div>

          {/* Textarea Card */}
          <div className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[10px]">
            <label
              htmlFor="checkout-remarks-input"
              className="text-[14px] leading-[20px] text-[#3D3D3D]"
            >
              Remarks
            </label>
            <textarea
              id="checkout-remarks-input"
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Please fill in other instructions here if any"
              rows={4}
              className="w-full h-[120px] rounded-[8px] bg-[#F7F7F7] p-[12px] text-[14px] leading-[20px] text-[#1A1A1A] placeholder:text-[#969696] outline-none resize-none focus:ring-1 focus:ring-[#E40032]"
            />
          </div>
        </div>
      </div>
    </BottomSheetDrawer>
  );
};

/* ─── 4. Payment Method Drawer ─── */
interface PaymentMethodDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (method: PaymentMethodOption) => void;
}

export const PaymentMethodDrawer: React.FC<PaymentMethodDrawerProps> = ({
  open,
  onClose,
  selectedId,
  onSelect,
}) => {
  return (
    <BottomSheetDrawer open={open} onClose={onClose} hideHeader>
      <div className="bg-white h-[48px] px-[12px] flex items-center gap-[8px] border-b border-[#F2F2F2]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
        >
          <img
            src={CHECKOUT_ASSETS.close}
            alt=""
            className="w-[28px] h-[28px] object-contain"
          />
        </button>
        <h3 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
          Select Payment Method
        </h3>
        <div className="w-[36px] h-[36px] shrink-0" />
      </div>

      <div className="p-[16px] flex flex-col gap-[10px] pb-[24px]">
        {PAYMENT_METHODS.map((pm) => {
          const active = pm.id === selectedId;
          return (
            <button
              key={pm.id}
              type="button"
              onClick={() => {
                onSelect(pm);
                onClose();
              }}
              className={`w-full rounded-[12px] p-[12px] border flex items-center gap-[12px] text-left transition-colors ${
                active
                  ? 'border-[#E40032] bg-[#FFF6F5]'
                  : 'border-[#E0E0E0] bg-white'
              }`}
            >
              <img
                src={active ? CHECKOUT_ASSETS.radioMarked : CHECKOUT_ASSETS.radioBlank}
                alt=""
                className="w-[24px] h-[24px] shrink-0"
              />
              {pm.icon ? (
                <div className="w-[28px] h-[28px] rounded-[4px] bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={pm.icon} alt={pm.name} className="w-[24px] h-[24px] object-contain" />
                </div>
              ) : (
                <span className="w-[28px] h-[28px] rounded-[4px] bg-[#1A1A1A] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                  {pm.badgeText}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[15px] leading-[22px] font-bold text-[#1A1A1A]">
                    {pm.name}
                  </span>
                  {pm.last4 && (
                    <span className="text-[13px] text-[#3D3D3D]">{pm.last4}</span>
                  )}
                </div>
                {pm.subtitle && (
                  <p className="text-[12px] leading-[16px] text-[#666666] mt-0.5">
                    {pm.subtitle}
                  </p>
                )}
              </div>
              {pm.discountAmount > 0 && (
                <span className="text-[12px] font-bold text-[#E40032] shrink-0">
                  -&#36;{pm.discountAmount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </BottomSheetDrawer>
  );
};

/* ─── 5. Out of Stock Preference Drawer ─── */
interface OutOfStockDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

export const OutOfStockDrawer: React.FC<OutOfStockDrawerProps> = ({
  open,
  onClose,
  selectedId,
  onSelect,
}) => {
  return (
    <BottomSheetDrawer open={open} onClose={onClose} hideHeader>
      <div className="bg-white h-[48px] px-[12px] flex items-center gap-[8px] border-b border-[#F2F2F2]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
        >
          <img
            src={CHECKOUT_ASSETS.close}
            alt=""
            className="w-[28px] h-[28px] object-contain"
          />
        </button>
        <h3 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
          If Out of Stock
        </h3>
        <div className="w-[36px] h-[36px] shrink-0" />
      </div>

      <div className="p-[16px] flex flex-col gap-[12px] pb-[24px]">
        {OUT_OF_STOCK_OPTIONS.map((opt) => {
          const active = opt.id === selectedId;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id);
                onClose();
              }}
              className="w-full py-[8px] flex items-start gap-[12px] text-left"
            >
              <img
                src={active ? CHECKOUT_ASSETS.radioMarked : CHECKOUT_ASSETS.radioBlank}
                alt=""
                className="w-[24px] h-[24px] shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <p
                  className={`text-[14px] leading-[20px] font-bold ${
                    active ? 'text-[#E40032]' : 'text-[#1A1A1A]'
                  }`}
                >
                  {opt.label}
                </p>
                <p className="text-[12px] leading-[16px] text-[#666666] mt-0.5">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </BottomSheetDrawer>
  );
};

/* ─── 6. Coupon / Voucher / Cash Voucher Picker Drawer ─── */
interface DiscountPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  choices: DiscountChoice[];
  selectedId: string;
  onSelect: (choice: DiscountChoice) => void;
}

export const DiscountPickerDrawer: React.FC<DiscountPickerDrawerProps> = ({
  open,
  onClose,
  title,
  choices,
  selectedId,
  onSelect,
}) => {
  return (
    <BottomSheetDrawer open={open} onClose={onClose} hideHeader>
      <div className="bg-white h-[48px] px-[12px] flex items-center gap-[8px] border-b border-[#F2F2F2]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="w-[36px] h-[36px] flex items-center justify-center shrink-0"
        >
          <img
            src={CHECKOUT_ASSETS.close}
            alt=""
            className="w-[28px] h-[28px] object-contain"
          />
        </button>
        <h3 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
          {title}
        </h3>
        <div className="w-[36px] h-[36px] shrink-0" />
      </div>

      <div className="p-[16px] flex flex-col gap-[10px] pb-[24px]">
        {choices.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelect(c);
                onClose();
              }}
              className={`w-full rounded-[12px] p-[12px] border flex items-center gap-[12px] text-left ${
                active
                  ? 'border-[#E40032] bg-[#FFF6F5]'
                  : 'border-[#E0E0E0] bg-white'
              }`}
            >
              <img
                src={active ? CHECKOUT_ASSETS.radioMarked : CHECKOUT_ASSETS.radioBlank}
                alt=""
                className="w-[24px] h-[24px] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">
                  {c.title}
                </p>
                <p className="text-[12px] leading-[16px] text-[#666666]">{c.subtitle}</p>
              </div>
              {c.amount > 0 && (
                <span className="text-[14px] font-bold text-[#E40032] shrink-0">
                  -&#36;{c.amount.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </BottomSheetDrawer>
  );
};
