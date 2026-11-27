import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { getCartQtyForProduct, useAppStore } from '../../store/useAppStore';
import { getProductById } from '../../data/catalog';
import { getThemeTokens } from '../../theme/themeConfig';

interface ProductAddControlProps {
  productId: string;
  variantId?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

/**
 * - WE: 1:1 Wellcome Component Library `add button` (452:19011) — red square `+` / qty badge / 92px stepper
 * - MP (`mp-before` / `mp-opt1`):
 *   - `fullWidth`: full-width rectangular outlined `+ Add` button (border `#155D2D` Before / `#28443C` Opt 1)
 *   - compact square: 28x28 white outlined `+` / qty badge in brand green
 */
export const ProductAddControl: React.FC<ProductAddControlProps> = ({
  productId,
  variantId,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const cartItems = useAppStore((s) => s.cartItems);
  const addToCart = useAppStore((s) => s.addToCart);
  const setCartItemQty = useAppStore((s) => s.setCartItemQty);
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);

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

  // MP Full-width outlined "+ Add" button / stepper (matches Figma MP cards)
  if (t.isMp && fullWidth) {
    if (disabled) {
      return (
        <button
          type="button"
          disabled
          onClick={(e) => e.stopPropagation()}
          className={`w-full h-[28px] rounded-[2px] border border-[#E0E0E0] bg-[#F5F5F5] text-[#B8B8B8] text-[12px] font-medium inline-flex items-center justify-center gap-1 cursor-not-allowed ${className}`}
        >
          Out of stock
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
          }}
          className={`w-full h-[28px] rounded-[2px] border bg-white text-[12px] font-medium inline-flex items-center justify-center gap-1 active:opacity-80 transition-colors ${className}`}
          style={{ borderColor: t.primary, color: t.primary }}
        >
          <Plus className="w-[13px] h-[13px]" strokeWidth={2} />
          <span>Add</span>
        </button>
      );
    }

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full h-[28px] rounded-[2px] border bg-white inline-flex items-center justify-between px-1 ${className}`}
        style={{ borderColor: t.primary }}
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setCartItemQty(itemKey, qty - 1)}
          className="w-[24px] h-[22px] inline-flex items-center justify-center active:opacity-70"
          style={{ color: t.primary }}
        >
          <Minus className="w-[13px] h-[13px]" strokeWidth={2.2} />
        </button>
        <span className="text-[12px] font-semibold text-[#1A1A1A] tabular-nums">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setCartItemQty(itemKey, qty + 1)}
          className="w-[24px] h-[22px] inline-flex items-center justify-center active:opacity-70"
          style={{ color: t.primary }}
        >
          <Plus className="w-[13px] h-[13px]" strokeWidth={2.2} />
        </button>
      </div>
    );
  }

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
        <span
          className="w-[24px] h-[24px] rounded-[4px] inline-flex items-center justify-center"
          style={
            t.isMp
              ? { backgroundColor: '#FFFFFF', border: `1px solid ${t.primary}`, color: t.primary, borderRadius: '2px' }
              : { backgroundColor: '#E40032', color: '#FFFFFF' }
          }
        >
          <Plus className="w-[15px] h-[15px]" strokeWidth={2.2} />
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
        <span
          className="min-w-[24px] h-[24px] px-1 inline-flex items-center justify-center text-[13px] leading-[20px] font-bold tabular-nums"
          style={
            t.isMpBefore
              ? {
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${t.primary}`,
                  color: t.primary,
                  borderRadius: '2px',
                }
              : t.isMpOpt1
                ? {
                    backgroundColor: t.primary,
                    color: '#FFFFFF',
                    borderRadius: '2px',
                  }
                : {
                    backgroundColor: t.primary,
                    color: '#FFFFFF',
                    borderRadius: '4px',
                  }
          }
        >
          {qty}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`h-[32px] w-[92px] bg-white border border-[#E0E0E0] p-[4px] inline-flex items-center justify-center gap-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] shrink-0 ${
        t.isMp ? 'rounded-[2px]' : 'rounded-[8px]'
      } ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => {
          setCartItemQty(itemKey, qty - 1);
          scheduleCollapse();
        }}
        className="w-[24px] h-[24px] inline-flex items-center justify-center shrink-0 active:scale-90 transition-transform"
        style={
          t.isMpBefore
            ? { backgroundColor: '#FFFFFF', border: `1px solid ${t.primary}`, color: t.primary, borderRadius: '2px' }
            : { backgroundColor: t.primary, color: '#FFFFFF', borderRadius: t.isMp ? '2px' : '4px' }
        }
      >
        <Minus className="w-[15px] h-[15px]" strokeWidth={2.2} />
      </button>
      <span className="w-[32px] text-center text-[15px] leading-normal font-medium text-[#1A1A1A] tabular-nums shrink-0">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => {
          setCartItemQty(itemKey, qty + 1);
          scheduleCollapse();
        }}
        className="w-[24px] h-[24px] inline-flex items-center justify-center shrink-0 active:scale-90 transition-transform"
        style={
          t.isMpBefore
            ? { backgroundColor: '#FFFFFF', border: `1px solid ${t.primary}`, color: t.primary, borderRadius: '2px' }
            : { backgroundColor: t.primary, color: '#FFFFFF', borderRadius: t.isMp ? '2px' : '4px' }
        }
      >
        <Plus className="w-[15px] h-[15px]" strokeWidth={2.2} />
      </button>
    </div>
  );
};
