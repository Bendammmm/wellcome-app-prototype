import React from 'react';
import type { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { getThemeTokens } from '../../theme/themeConfig';
import { PriceBlock } from './PriceBlock';
import { PromoTag } from './PromoTag';
import { ProductAddControl } from './ProductAddControl';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'compact' | 'waterfall' | 'row';
  className?: string;
  onCardClick?: (product: Product) => void;
}

/**
 * 1:1 implementation of Wellcome Component Library `product card` (486:55467) & `price info` (490:55771):
 * - Standard floor cards (`grid` / `compact`): width-driven square image (`aspect-square`) + FIXED-height
 *   text/info block (`h-[88px]` grid / `h-[80px]` compact) + FIXED-height price footer (`h-[48px]` / `h-[50px]`),
 *   so every card in a standard floor shares an exact uniform height.
 * - Waterfall cards (`waterfall`): width-driven square image + CONTENT-ADAPTIVE text/info block (no fixed height),
 *   so 2-column masonry feeds flow naturally without empty vertical voids.
 * - AddButton pinned at `absolute bottom-[4px] right-[4px]`.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'grid',
  className = '',
  onCardClick,
}) => {
  const navigate = useAppStore((s) => s.navigate);
  const appTheme = useAppStore((s) => s.appTheme);
  const t = getThemeTokens(appTheme);

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
  const isWaterfall = variant === 'waterfall';

  return (
    <div
      onClick={handleOpen}
      className={`bg-white rounded-[8px] flex flex-col overflow-hidden relative cursor-pointer ${
        isCompact ? '' : 'shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      } active:scale-[0.99] transition-transform ${className}`}
    >
      {/* Square Product Image (width determines image height) + New Badge at top-[4px] right-[4px] */}
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
        {/* Basic Info: content-adaptive on waterfall; strictly fixed height on standard floor cards */}
        <div
          className={`flex flex-col gap-[4px] px-[8px] pt-[4px] pb-[2px] w-full shrink-0 ${
            isWaterfall
              ? ''
              : isCompact
                ? 'h-[80px] overflow-hidden'
                : 'h-[88px] overflow-hidden'
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

        {/* Price Footer: MP uses stacked Price + full-width "+ Add" button; WE uses bottom-right red "+" */}
        {t.isMp ? (
          <div
            className={`flex flex-col justify-end gap-[6px] pt-[8px] pb-[8px] px-[8px] w-full shrink-0 ${
              isWaterfall ? '' : 'mt-auto'
            }`}
          >
            <PriceBlock
              price={product.price}
              originalPrice={product.originalPrice}
              unitPriceText={product.unitPriceText}
              size={isCompact ? 'sm' : 'md'}
            />
            <ProductAddControl
              productId={product.id}
              disabled={product.isOutOfStock}
              fullWidth
            />
          </div>
        ) : (
          <div
            className={`relative flex items-end pt-[8px] pb-[6px] pl-[8px] pr-[4px] w-full shrink-0 ${
              isWaterfall
                ? 'min-h-[42px]'
                : isCompact
                  ? 'mt-auto h-[50px]'
                  : 'mt-auto h-[48px]'
            }`}
          >
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
        )}
      </div>
    </div>
  );
};
