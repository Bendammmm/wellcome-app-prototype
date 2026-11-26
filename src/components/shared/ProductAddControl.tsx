import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { getCartQtyForProduct, useAppStore } from '../../store/useAppStore';
import { getProductById } from '../../data/catalog';

interface ProductAddControlProps {
  productId: string;
  variantId?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * 1:1 implementation of Wellcome Component Library `add button` (452:19011):
 * - state=default: 32x32 hit target -> 24x24 #E40032 rounded-[4px] + 16x16 white "+"
 * - state=disable: 32x32 hit target -> 24x24 #EEEEEE rounded-[4px] + 16x16 muted "+"
 * - state=active:  92x32 white pill, border #E0E0E0, rounded-[8px], p-[4px], gap-[2px]:
 *                  [24x24 red "-"] [w-32px text-16px regular qty] [24x24 red "+"]
 * - state=added:   32x32 hit target -> 24x24 #E40032 rounded-[4px] + 16px/24px bold white qty
 */
export const ProductAddControl: React.FC<ProductAddControlProps> = ({
  productId,
  variantId,
  disabled = false,
  className = '',
}) => {
  const cartItems = useAppStore((s) => s.cartItems);
  const addToCart = useAppStore((s) => s.addToCart);
  const setCartItemQty = useAppStore((s) => s.setCartItemQty);

  const product = getProductById(productId);
  const resolvedVariantId = variantId ?? product.variants?.[0]?.id;
  const itemKey = `${productId}::${resolvedVariantId || 'default'}`;
  const qty = getCartQtyForProduct(cartItems, productId, resolvedVariantId);

  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleCollapse = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setExpanded(false);
    }, 2600);
  };

  useEffect(() => {
    if (qty === 0) setExpanded(false);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [qty]);

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        aria-label="Out of stock"
        onClick={(e) => e.stopPropagation()}
        className={`w-[32px] h-[32px] rounded-[8px] inline-flex items-center justify-center shrink-0 cursor-not-allowed ${className}`}
      >
        <span className="w-[24px] h-[24px] rounded-[4px] bg-[#EEEEEE] border border-[#EEEEEE] inline-flex items-center justify-center text-[#B8B8B8]">
          <Plus className="w-[16px] h-[16px]" strokeWidth={2.2} />
        </span>
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        aria-label="Add to cart"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(productId, 1, resolvedVariantId);
          setExpanded(true);
          scheduleCollapse();
        }}
        className={`w-[32px] h-[32px] rounded-[8px] inline-flex items-center justify-center shrink-0 active:scale-90 transition-transform ${className}`}
      >
        <span className="w-[24px] h-[24px] rounded-[4px] bg-[#E40032] inline-flex items-center justify-center text-white">
          <Plus className="w-[16px] h-[16px]" strokeWidth={2.4} />
        </span>
      </button>
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        aria-label={`Quantity in cart: ${qty}. Tap to adjust`}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(true);
          scheduleCollapse();
        }}
        className={`w-[32px] h-[32px] min-w-[24px] min-h-[24px] rounded-[8px] inline-flex items-center justify-center shrink-0 active:scale-95 transition-transform ${className}`}
      >
        <span className="min-w-[24px] h-[24px] px-1 rounded-[4px] bg-[#E40032] border border-[#E40032] inline-flex items-center justify-center text-white text-[16px] leading-[24px] font-bold tabular-nums">
          {qty}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`h-[32px] w-[92px] bg-white border border-[#E0E0E0] rounded-[8px] p-[4px] inline-flex items-center justify-center gap-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] shrink-0 ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => {
          setCartItemQty(itemKey, qty - 1);
          scheduleCollapse();
        }}
        className="w-[24px] h-[24px] rounded-[4px] bg-[#E40032] text-white inline-flex items-center justify-center shrink-0 active:scale-90 transition-transform"
      >
        <Minus className="w-[16px] h-[16px]" strokeWidth={2.4} />
      </button>
      <span className="w-[32px] text-center text-[16px] leading-normal font-normal text-[#1A1A1A] tabular-nums shrink-0">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => {
          setCartItemQty(itemKey, qty + 1);
          scheduleCollapse();
        }}
        className="w-[24px] h-[24px] rounded-[4px] bg-[#E40032] text-white inline-flex items-center justify-center shrink-0 active:scale-90 transition-transform"
      >
        <Plus className="w-[16px] h-[16px]" strokeWidth={2.4} />
      </button>
    </div>
  );
};
