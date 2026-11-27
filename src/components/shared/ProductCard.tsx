import React from 'react';
import type { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { PriceBlock } from './PriceBlock';
import { PromoTag } from './PromoTag';
import { ProductAddControl } from './ProductAddControl';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'compact' | 'row';
  className?: string;
  onCardClick?: (product: Product) => void;
}

/**
 * 1:1 implementation of Wellcome Component Library `product card` (486:55467) & `price info` (490:55771):
 * - Fixed-height basic info block (`h-[86px]` on grid, `h-[76px]` on compact)
 * - Fixed-height price footer (`h-[46px] min-h-[46px] max-h-[46px]`, `items-end pb-[4px] pl-[8px] pr-[4px]`)
 * - AddButton pinned at `absolute bottom-[4px] right-[4px]` so adjacent cards ALWAYS bottom-align pixel-for-pixel,
 *   even when price wraps or AddButton expands to `92x32` active stepper.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'grid',
  className = '',
  onCardClick,
}) => {
  const navigate = useAppStore((s) => s.navigate);

  const handleOpen = () => {
    if (onCardClick) {
      onCardClick(product);
    } else {
      navigate('pdp', product.id);
    }
  };

  if (variant === 'row') {
    return (
      <div
        onClick={handleOpen}
        className={`flex items-center gap-2.5 py-2 px-2.5 bg-white rounded-[8px] cursor-pointer active:bg-[#FAFAFA] transition-colors ${className}`}
      >
        <div className="w-[40px] h-[40px] rounded-[6px] bg-white flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] leading-[16px] font-medium text-[#1A1A1A] line-clamp-2">
            {product.name}
          </p>
        </div>
        <div className="relative flex items-center gap-1.5 shrink-0">
          <PriceBlock
            price={product.price}
            originalPrice={product.originalPrice}
            size="sm"
          />
          <ProductAddControl productId={product.id} disabled={product.isOutOfStock} />
        </div>
      </div>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <div
      onClick={handleOpen}
      className={`bg-white rounded-[8px] flex flex-col overflow-hidden relative cursor-pointer ${
        isCompact ? '' : 'shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      } active:scale-[0.99] transition-transform ${className}`}
    >
      {/* Square Product Image + New Badge at top-[4px] right-[4px] (Figma 452:18860) */}
      <div className="w-full aspect-square relative rounded-[4px] bg-white flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-[90%] h-[90%] object-contain"
          loading="lazy"
        />
        {product.badge === 'New' && (
          <div className="absolute top-[4px] right-[4px] z-10">
            <PromoTag label="New" variant="new" />
          </div>
        )}
      </div>

      {/* Product Info Container (Figma 486:54670) */}
      <div className="flex flex-col flex-1 w-full">
        {/* Basic Info: fixed height so all cards in a row align cleanly without overflowing into price */}
        <div
          className={`flex flex-col gap-[4px] px-[8px] pt-[4px] pb-[2px] w-full shrink-0 ${
            isCompact ? 'min-h-[78px]' : 'min-h-[88px]'
          }`}
        >
          <div className="flex flex-col gap-[2px] w-full">
            <p
              className={`font-normal text-[#1A1A1A] line-clamp-2 ${
                isCompact
                  ? 'text-[12px] leading-[16px]'
                  : 'text-[14px] leading-[20px]'
              }`}
            >
              {product.name}
            </p>
            {product.soldText && (
              <span className="text-[12px] leading-[16px] text-[#666666] whitespace-nowrap">
                {product.soldText}
              </span>
            )}
          </div>

          {product.promoTags && product.promoTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.promoTags.slice(0, isCompact ? 1 : 2).map((tag) => (
                <PromoTag key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Price Footer with consistent 10px breathing room below promo tags (Figma 490:55879) */}
        <div className="mt-auto relative flex items-end min-h-[46px] pt-[10px] pb-[6px] pl-[8px] pr-[4px] w-full shrink-0">
          <div className="flex flex-col items-start justify-end pr-[36px] min-w-0">
            <PriceBlock
              price={product.price}
              originalPrice={product.originalPrice}
              unitPriceText={product.unitPriceText}
              size={isCompact ? 'sm' : 'md'}
            />
          </div>

          {/* AddButton strictly pinned at bottom-[4px] right-[4px] (Figma 490:55663) */}
          <ProductAddControl
            productId={product.id}
            disabled={product.isOutOfStock}
            className="absolute bottom-[4px] right-[4px] z-10"
          />
        </div>
      </div>
    </div>
  );
};
