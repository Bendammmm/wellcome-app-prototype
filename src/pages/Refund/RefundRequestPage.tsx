import React, { useState } from 'react';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { useAppStore } from '../../store/useAppStore';
import { REFUND_ASSETS } from './refundAssets';
import {
  INITIAL_REFUND_ITEMS,
  REFUND_REASON_OPTIONS,
  setLastSubmittedRefund,
  type RefundItemDraft,
} from './refundState';

const PHOTO_SWATCHES = ['#EFE4DD', '#E8EEF1', '#E9F2EA', '#F4ECEF', '#ECECF5', '#F5F0E4'];

function splitPrice(price: number) {
  const [intPart, decPart] = price.toFixed(2).split('.');
  return { intPart, decPart: `.${decPart}` };
}

export const RefundRequestPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const showToast = useAppStore((s) => s.showToast);

  const [items, setItems] = useState<RefundItemDraft[]>(INITIAL_REFUND_ITEMS);
  const [reasonPickerItemId, setReasonPickerItemId] = useState<string | null>(null);

  const selectedItems = items.filter((i) => i.selected);
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const totalRefundAmount = selectedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0
  );
  const totalFormatted = splitPrice(totalRefundAmount);

  const toggleItemSelected = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const next = !allSelected;
    setItems((prev) => prev.map((item) => ({ ...item, selected: next })));
  };

  const updateItemQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextQty = Math.min(item.maxQty, Math.max(1, item.qty + delta));
        return { ...item, qty: nextQty };
      })
    );
  };

  const updateItemDetails = (id: string, text: string) => {
    const clipped = text.slice(0, 1000);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, issueDetails: clipped } : item
      )
    );
  };

  const handleAddPhoto = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.photos.length >= 6) {
          showToast('Maximum 6 proof photos per item');
          return item;
        }
        const nextIndex = item.photos.length + 1;
        return {
          ...item,
          photos: [
            ...item.photos,
            {
              id: `p-${Date.now()}`,
              label: `Photo ${nextIndex}`,
              bg: PHOTO_SWATCHES[(nextIndex - 1) % PHOTO_SWATCHES.length],
            },
          ],
        };
      })
    );
  };

  const handleRemovePhoto = (itemId: string, photoId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, photos: item.photos.filter((p) => p.id !== photoId) }
          : item
      )
    );
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      showToast('Please select at least 1 item to refund');
      return;
    }
    const missingDetails = selectedItems.find((i) => !i.issueDetails.trim());
    if (missingDetails) {
      showToast(`Please enter issue details for ${missingDetails.name}`);
      return;
    }

    setLastSubmittedRefund({
      caseNumber: `AS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}000012`,
      reasonSummary: `Product issue › ${selectedItems[0].reason}`,
      items: selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        subtitle: item.subtitle,
        image: item.image,
        unitPrice: item.unitPrice,
        originalPrice: item.originalPrice,
        savedText: item.savedText,
        qty: item.qty,
      })),
      itemSubtotal: totalRefundAmount,
      packagingFee: 12,
      pickupServiceFee: 5,
      totalRefund: totalRefundAmount,
    });
    showToast('Refund request submitted');
    navigate('refund-success');
  };

  const activeReasonItem = items.find((i) => i.id === reasonPickerItemId) ?? null;

  return (
    <div className="min-h-dvh bg-[#F5F5F5] pb-[118px] flex flex-col">
      {/* Top White Navigation Bar (Figma 2258:50045 -> 2258:50046) */}
      <header className="sticky top-0 z-20 bg-white pt-[max(4px,env(safe-area-inset-top))] h-[48px] px-[12px] flex items-center border-b border-[#F2F2F2]">
        <button
          type="button"
          aria-label="Go back"
          onClick={goBack}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:bg-[#F5F5F5] shrink-0"
        >
          <img
            src={REFUND_ASSETS.chevronLeft}
            alt=""
            className="w-[26px] h-[26px] object-contain"
          />
        </button>
        <h1 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
          Request Refund
        </h1>
        <div className="w-[36px] h-[36px] shrink-0" />
      </header>

      {/* Section Title: Home Delivery (2258:50061) */}
      <div className="bg-white border-b border-[#E6E6E6] px-[16px] py-[12px]">
        <h2 className="text-[16px] leading-[24px] font-bold text-black">
          Home Delivery
        </h2>
      </div>

      {/* Refund Item List + Per-item Reason & Evidence Cards */}
      <div className="flex flex-col gap-[8px]">
        {items.map((item) => {
          const priceParts = splitPrice(item.unitPrice);
          const itemRefundTotal = (item.unitPrice * item.qty).toFixed(2);

          return (
            <div key={item.id} className="flex flex-col gap-[8px]">
              {/* Product Row Card */}
              <div className="bg-white px-[20px] py-[8px]">
                <div className="flex items-start gap-[8px] py-[4px]">
                  {/* Checkbox */}
                  <button
                    type="button"
                    aria-label={item.selected ? 'Deselect item' : 'Select item'}
                    onClick={() => toggleItemSelected(item.id)}
                    className="self-stretch flex items-center shrink-0"
                  >
                    <img
                      src={
                        item.selected
                          ? REFUND_ASSETS.radioChecked
                          : REFUND_ASSETS.radioBlank
                      }
                      alt=""
                      className="w-[24px] h-[24px] object-contain"
                    />
                  </button>

                  {/* Product Thumbnail 76x76 */}
                  <div className="w-[76px] h-[76px] rounded-[4px] bg-white overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Info + Stepper */}
                  <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                    <div className="flex flex-col gap-[2px]">
                      <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
                        {item.name}
                      </p>
                      {item.subtitle && (
                        <p className="text-[12px] leading-[16px] text-[#969696]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-[8px]">
                      <div className="flex flex-col items-start gap-[2px]">
                        <div className="flex items-end gap-[4px]">
                          <div className="flex items-start font-bold text-[#E40032] leading-none">
                            <span className="text-[10px] leading-[12px] mt-[1px]">$</span>
                            <span className="text-[16px] leading-[16px]">{priceParts.intPart}</span>
                            <span className="text-[10px] leading-[12px] mt-[1px]">{priceParts.decPart}</span>
                          </div>
                          {item.originalPrice && (
                            <span className="text-[10px] leading-[12px] text-[#969696] line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {item.savedText && (
                          <span className="bg-[#FFF6F5] text-[#E40032] text-[10px] leading-[14px] px-[4px] py-[2px] rounded-[4px]">
                            {item.savedText}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center gap-[4px] shrink-0">
                        <button
                          type="button"
                          aria-label="Decrease refund quantity"
                          disabled={item.qty <= 1}
                          onClick={() => updateItemQty(item.id, -1)}
                          className="w-[24px] h-[24px] rounded-[4px] bg-[#F7F7F7] flex items-center justify-center disabled:opacity-40 active:bg-[#E5E5E5]"
                        >
                          <img
                            src={REFUND_ASSETS.minus}
                            alt=""
                            className="w-[24px] h-[24px] object-contain"
                          />
                        </button>
                        <span className="w-[32px] text-center text-[16px] leading-[20px] text-[#1A1A1A] tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase refund quantity"
                          disabled={item.qty >= item.maxQty}
                          onClick={() => updateItemQty(item.id, 1)}
                          className="w-[24px] h-[24px] rounded-[4px] bg-[#F7F7F7] flex items-center justify-center disabled:opacity-40 active:bg-[#E5E5E5]"
                        >
                          <img
                            src={REFUND_ASSETS.plus}
                            alt=""
                            className="w-[24px] h-[24px] object-contain"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gift sub-row if present (Figma 4th item) */}
                {item.gift && (
                  <div className="mt-[8px] pt-[8px] pl-[32px] flex items-center gap-[8px]">
                    <div className="w-[48px] h-[48px] rounded-[4px] bg-white overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.gift.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
                      <div className="flex items-center gap-[4px]">
                        <span className="border border-[#E40032] text-[#E40032] text-[10px] leading-[12px] px-[4px] py-[1px] rounded-[3px] shrink-0">
                          Gift
                        </span>
                        <span className="text-[13px] leading-[18px] text-[#3D3D3D] truncate">
                          {item.gift.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start font-bold text-[#E40032] leading-none">
                          <span className="text-[10px] leading-[12px] mt-[1px]">$</span>
                          <span className="text-[14px] leading-[14px]">0</span>
                          <span className="text-[10px] leading-[12px] mt-[1px]">.00</span>
                        </div>
                        <span className="text-[14px] text-[#1A1A1A]">
                          x{item.gift.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Refund Form Cards when item is selected */}
              {item.selected && (
                <>
                  {/* Card 1: Reason, Refund Amount, Refund Method (Figma 2258:50105) */}
                  <div className="mx-[8px] bg-white rounded-[12px] p-[12px] flex flex-col gap-[14px]">
                    {/* Reason row */}
                    <div className="flex items-center justify-between gap-[8px]">
                      <span className="text-[14px] leading-[20px] text-[#1A1A1A] shrink-0 w-[96px]">
                        Reason <span className="text-[#E40032]">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setReasonPickerItemId(item.id)}
                        className="flex-1 min-w-0 bg-white border border-[#D9D9D9] rounded-[8px] px-[12px] py-[8px] flex items-center justify-between gap-[8px] active:bg-[#FAFAFA]"
                      >
                        <span className="text-[14px] leading-[20px] text-[#1A1A1A] truncate">
                          {item.reason}
                        </span>
                        <img
                          src={REFUND_ASSETS.chevronRight}
                          alt=""
                          className="w-[18px] h-[18px] object-contain shrink-0 -scale-y-100"
                        />
                      </button>
                    </div>

                    <div className="h-px bg-[#E6E6E6] w-full" />

                    {/* Refund amount row */}
                    <div className="flex items-center text-[14px] leading-[20px]">
                      <span className="text-[#6B6B6B] w-[118px] shrink-0">
                        Refund amount
                      </span>
                      <span className="text-[#1A1A1A] font-normal tabular-nums">
                        HK${itemRefundTotal}
                      </span>
                    </div>

                    <div className="h-px bg-[#E6E6E6] w-full" />

                    {/* Refund method row */}
                    <div className="flex items-start text-[14px] leading-[20px]">
                      <span className="text-[#6B6B6B] w-[118px] shrink-0">
                        Refund method
                      </span>
                      <span className="text-[#1A1A1A] flex-1">
                        Refunded to original payment method
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Issue Details & Upload Proof (Figma 2258:50123) */}
                  <div className="mx-[8px] bg-white rounded-[12px] p-[12px] flex flex-col gap-[12px]">
                    {/* Issue details */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] leading-[20px] text-[#1A1A1A]">
                        Issue details <span className="text-[#E40032]">*</span>
                      </label>
                      <textarea
                        value={item.issueDetails}
                        onChange={(e) => updateItemDetails(item.id, e.target.value)}
                        rows={3}
                        placeholder="Describe the issue with this item..."
                        className="w-full h-[76px] bg-[#FAFAFA] border border-[#D9D9D9] rounded-[8px] px-[12px] py-[8px] text-[14px] leading-[20px] text-[#1A1A1A] resize-none outline-none focus:border-[#E40032]"
                      />
                      <div className="text-right text-[12px] leading-[16px] font-semibold text-[#6B6B6B] tabular-nums">
                        {item.issueDetails.length} / 1000
                      </div>
                    </div>

                    {/* Upload proof */}
                    <div className="flex flex-col gap-[8px]">
                      <span className="text-[14px] leading-[20px] text-[#1A1A1A]">
                        Upload proof <span className="text-[#E40032]">*</span>
                      </span>
                      <div className="flex flex-wrap gap-[8px]">
                        {item.photos.map((photo) => (
                          <button
                            key={photo.id}
                            type="button"
                            onClick={() => handleRemovePhoto(item.id, photo.id)}
                            title="Tap to remove photo"
                            style={{ backgroundColor: photo.bg }}
                            className="w-[75px] h-[67px] rounded-[8px] border border-[#D9D9D9] flex items-center justify-center text-[12px] text-[#6B6B6B] relative group active:opacity-80"
                          >
                            <span>{photo.label}</span>
                            <span className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] rounded-full bg-[#1A1A1A]/75 text-white text-[10px] flex items-center justify-center">
                              ×
                            </span>
                          </button>
                        ))}
                        {item.photos.length < 6 && (
                          <button
                            type="button"
                            onClick={() => handleAddPhoto(item.id)}
                            className="w-[75px] h-[67px] rounded-[8px] border border-dashed border-[#D9D9D9] bg-white flex flex-col items-center justify-center gap-[2px] active:bg-[#FAFAFA]"
                          >
                            <span className="text-[22px] leading-[22px] text-[#A0A0A0]">
                              ＋
                            </span>
                            <span className="text-[12px] leading-[16px] text-[#6B6B6B]">
                              Add
                            </span>
                          </button>
                        )}
                      </div>
                      <p className="text-[12px] leading-[16px] text-[#6B6B6B]">
                        Up to 6 photos, 10 MB each
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Submit Bar (.app-fixed-bar) (Figma 2258:51071) */}
      <div className="app-fixed-bar bottom-0 z-30 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] px-[12px] pt-[12px] pb-[max(14px,env(safe-area-inset-bottom))] flex flex-col gap-[12px]">
        <div className="flex items-center justify-between gap-[8px]">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center gap-[4px] shrink-0 active:opacity-75"
          >
            <img
              src={
                allSelected
                  ? REFUND_ASSETS.radioCheckedBlue
                  : REFUND_ASSETS.radioBlank
              }
              alt=""
              className="w-[24px] h-[24px] object-contain"
            />
            <span className="text-[14px] leading-[20px] text-[#969696]">All</span>
          </button>

          <div className="flex flex-col items-end gap-[2px]">
            <div className="flex items-center gap-[4px]">
              <span className="text-[12px] leading-[16px] text-[#6B6B6B] mr-[4px]">
                Total refund
              </span>
              <span className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
                Total:
              </span>
              <div className="flex items-start font-bold text-[#E40032] leading-none tabular-nums">
                <span className="text-[14px] leading-[18px]">$</span>
                <span className="text-[18px] leading-[20px]">{totalFormatted.intPart}</span>
                <span className="text-[12px] leading-[16px]">{totalFormatted.decPart}</span>
              </div>
            </div>
            <span className="text-[12px] leading-[16px] text-[#6B6B6B]">
              {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-[36px] rounded-[4px] bg-[#E40032] text-white text-[13px] leading-[18px] font-semibold flex items-center justify-center active:opacity-90 transition-opacity"
        >
          Submit
        </button>
      </div>

      {/* Reason Picker Bottom Sheet */}
      <BottomSheetDrawer
        open={Boolean(activeReasonItem)}
        onClose={() => setReasonPickerItemId(null)}
        title="Select Refund Reason"
      >
        <div className="p-[16px] flex flex-col gap-[8px]">
          {REFUND_REASON_OPTIONS.map((option) => {
            const active = activeReasonItem?.reason === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (!activeReasonItem) return;
                  setItems((prev) =>
                    prev.map((item) =>
                      item.id === activeReasonItem.id
                        ? { ...item, reason: option }
                        : item
                    )
                  );
                  setReasonPickerItemId(null);
                }}
                className={`w-full text-left px-[14px] py-[12px] rounded-[8px] border text-[14px] flex items-center justify-between ${
                  active
                    ? 'border-[#E40032] bg-[#FFF6F5] text-[#E40032] font-semibold'
                    : 'border-[#E6E6E6] bg-white text-[#1A1A1A]'
                }`}
              >
                <span>{option}</span>
                {active && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </BottomSheetDrawer>
    </div>
  );
};
