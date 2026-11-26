import React, { useState } from 'react';
import { BottomSheetDrawer } from '../../components/shared/BottomSheetDrawer';
import { useAppStore } from '../../store/useAppStore';
import { FEEDBACK_ASSETS } from './feedbackAssets';

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Awesome',
};

interface ProductFeedbackDraft {
  id: string;
  name: string;
  image: string;
  rating: number;
  expanded: boolean;
  tags: string[];
  selectedTags: string[];
  comment: string;
  photos: { id: string; src: string }[];
}

const INITIAL_PRODUCT_FEEDBACK: ProductFeedbackDraft[] = [
  {
    id: 'pf-1',
    name: 'ZESPRI JUMBLE GOLD KIWIFRUIT',
    image: FEEDBACK_ASSETS.prodKiwi,
    rating: 5,
    expanded: true,
    tags: ['Delicious', 'Fresh', 'Juicy', 'Sweet and sour'],
    selectedTags: ['Delicious'],
    comment: '',
    photos: [{ id: 'ph-1', src: FEEDBACK_ASSETS.prodKiwi }],
  },
  {
    id: 'pf-2',
    name: 'Hot Pot Frozen US Beef Blade 140GM',
    image: FEEDBACK_ASSETS.prodBeef,
    rating: 0,
    expanded: false,
    tags: ['Tender', 'Fresh', 'Good value', 'Well packed'],
    selectedTags: [],
    comment: '',
    photos: [],
  },
  {
    id: 'pf-3',
    name: 'Bin 180 Cabernet Shiraz 750ML',
    image: FEEDBACK_ASSETS.prodBin180,
    rating: 0,
    expanded: false,
    tags: ['Rich aroma', 'Smooth', 'Great value', 'Intact bottle'],
    selectedTags: [],
    comment: '',
    photos: [],
  },
  {
    id: 'pf-4',
    name: 'Nissin Demae Iccho Sesame Oil Bowl Noodles 99GM',
    image: FEEDBACK_ASSETS.prodNissinBowl,
    rating: 0,
    expanded: false,
    tags: ['Delicious', 'Convenient', 'Good value', 'Fresh stock'],
    selectedTags: [],
    comment: '',
    photos: [],
  },
];

interface StarRowProps {
  value: number;
  onChange: (next: number) => void;
}

const StarRow: React.FC<StarRowProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-[8px]">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onChange(star);
        }}
        className="w-[24px] h-[24px] shrink-0 active:scale-90 transition-transform"
      >
        <img
          src={star <= value ? FEEDBACK_ASSETS.starFilled : FEEDBACK_ASSETS.starEmpty}
          alt=""
          className="w-[24px] h-[24px] object-contain"
        />
      </button>
    ))}
    {value > 0 && (
      <span className="text-[12px] leading-[16px] text-[#3D3D3D] whitespace-nowrap">
        {RATING_LABELS[value]}
      </span>
    )}
  </div>
);

export const FeedbackPage: React.FC = () => {
  const goBack = useAppStore((s) => s.goBack);
  const navigate = useAppStore((s) => s.navigate);
  const showToast = useAppStore((s) => s.showToast);

  const [overallRating, setOverallRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [packagingRating, setPackagingRating] = useState(0);
  const [products, setProducts] = useState<ProductFeedbackDraft[]>(INITIAL_PRODUCT_FEEDBACK);
  const [anonymous, setAnonymous] = useState(false);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);

  const ratedProductCount = products.filter((p) => p.rating > 0).length;

  const handleAllPraise = () => {
    setOverallRating(5);
    setDeliveryRating(5);
    setPackagingRating(5);
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        rating: 5,
        selectedTags: p.selectedTags.length > 0 ? p.selectedTags : [p.tags[0]],
      }))
    );
    showToast('All order & product ratings set to 5 stars!');
  };

  const handleProductRate = (id: string, rating: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rating, expanded: true } : p
      )
    );
  };

  const handleToggleExpand = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, expanded: !p.expanded } : p))
    );
  };

  const handleToggleTag = (id: string, tag: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const exists = p.selectedTags.includes(tag);
        return {
          ...p,
          selectedTags: exists
            ? p.selectedTags.filter((t) => t !== tag)
            : [...p.selectedTags, tag],
        };
      })
    );
  };

  const handleCommentChange = (id: string, comment: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, comment } : p))
    );
  };

  const handleAddPhoto = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.photos.length >= 9) {
          showToast('Maximum 9 images per product');
          return p;
        }
        return {
          ...p,
          photos: [...p.photos, { id: `ph-${Date.now()}`, src: p.image }],
        };
      })
    );
  };

  const handleRemovePhoto = (productId: string, photoId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, photos: p.photos.filter((ph) => ph.id !== photoId) }
          : p
      )
    );
  };

  const handleSubmit = () => {
    if (overallRating === 0) {
      showToast('Please rate your overall satisfaction first');
      return;
    }
    setSubmittedModalOpen(true);
    showToast('Feedback submitted! +100 yuu points earned');
  };

  return (
    <div className="min-h-dvh bg-[#F5F5F5] pb-[118px] flex flex-col">
      {/* Top White Navigation Bar (Figma 3109:137166 -> 6337:101687) */}
      <header className="sticky top-0 z-20 bg-white pt-[max(4px,env(safe-area-inset-top))] h-[48px] px-[16px] flex items-center">
        <button
          type="button"
          aria-label="Go back"
          onClick={goBack}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-full active:bg-[#F5F5F5] shrink-0"
        >
          <img
            src={FEEDBACK_ASSETS.chevronLeft}
            alt=""
            className="w-[32px] h-[32px] object-contain"
          />
        </button>
        <h1 className="flex-1 text-center text-[16px] leading-[24px] font-bold text-black pr-[32px]">
          Feedback
        </h1>
      </header>

      {/* Order Info Row (Figma 3007:346991) */}
      <div className="bg-white px-[20px] py-[12px] flex items-center justify-between">
        <div className="bg-[#F7F7F7] px-[8px] py-[4px] rounded-[4px] flex items-center gap-[4px]">
          <img
            src={FEEDBACK_ASSETS.fulfillmentBag}
            alt=""
            className="w-[16px] h-[16px] object-contain shrink-0"
          />
          <span className="text-[12px] leading-[16px] text-[#1A1A1A]">
            Click &amp; collect
          </span>
        </div>
        <div className="flex items-center gap-[4px] text-[12px] leading-[16px] text-[#3D3D3D]">
          <span>Order No:</span>
          <span className="tabular-nums">10008099984271</span>
        </div>
      </div>

      {/* Yuu Points Reward Banner (Figma 3109:137168) */}
      <div className="p-[8px]">
        <button
          type="button"
          onClick={() =>
            showToast('Complete your order & product feedback to earn 100 yuu points!')
          }
          className="w-full h-[52px] rounded-[12px] border-2 border-white bg-gradient-to-r from-white to-[#FFF6F5] relative overflow-hidden flex items-center pl-[104px] pr-[8px] text-left active:opacity-90"
        >
          <div className="absolute left-px top-[-2px] w-[91px] h-[52px] rounded-[14px] overflow-hidden pointer-events-none">
            <img
              src={FEEDBACK_ASSETS.yuuBannerArtwork}
              alt=""
              className="absolute h-[256.18%] left-[-10%] max-w-none top-[-78.09%] w-[431.66%]"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <span className="text-[12px] leading-[16px] text-[#1A1A1A]">
              Share your feedback and earn
            </span>
            <span className="text-[14px] leading-[20px] font-bold text-[#1A1A1A]">
              100 yuu points
            </span>
          </div>
          <img
            src={FEEDBACK_ASSETS.chevronRight}
            alt=""
            className="w-[16px] h-[16px] object-contain shrink-0"
          />
        </button>
      </div>

      {/* Order Feedback Section (Figma 3007:347002) */}
      <section className="px-[8px] py-[8px] flex flex-col gap-[8px]">
        <div className="px-[12px] pt-[8px] pb-[4px] flex flex-col gap-[4px]">
          <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
            Order Feedback
          </h2>
          <p className="text-[12px] leading-[16px] text-[#666666]">
            Rate the overall service of the order. Your feedback helps us improve our service.
          </p>
        </div>

        <div className="bg-white rounded-[12px] px-[12px] py-[12px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
              Overall satisfaction
            </p>
            <StarRow value={overallRating} onChange={setOverallRating} />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
              Delivery service
            </p>
            <StarRow value={deliveryRating} onChange={setDeliveryRating} />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-[14px] leading-[20px] text-[#1A1A1A]">
              Intact packaging
            </p>
            <StarRow value={packagingRating} onChange={setPackagingRating} />
          </div>
        </div>
      </section>

      {/* Product Feedback Section (Figma 3007:347017) */}
      <section className="px-[8px] py-[8px] flex flex-col gap-[8px]">
        <div className="px-[12px] pt-[8px] pb-[4px] flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1A1A]">
              Product Feedback
            </h2>
            <span className="text-[14px] leading-[20px] tabular-nums">
              <span className="text-[#1A1A1A]">{ratedProductCount}</span>
              <span className="text-[#666666]">/{products.length}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAllPraise}
            className="bg-[#E40032] text-white h-[32px] px-[12px] rounded-[4px] text-[12px] leading-[16px] font-bold flex items-center justify-center active:opacity-90"
          >
            All praise
          </button>
        </div>

        <div className="flex flex-col gap-[8px]">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-[8px] px-[12px] py-[12px] flex flex-col gap-[12px]"
            >
              {/* Product Header + Star Row */}
              <div
                onClick={() => handleToggleExpand(prod.id)}
                className="flex items-center gap-[9px] cursor-pointer"
              >
                <div className="w-[64px] h-[64px] rounded-[10px] bg-white overflow-hidden shrink-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-[8px]">
                  <p className="text-[14px] leading-[20px] text-[#1A1A1A] truncate">
                    {prod.name}
                  </p>
                  <StarRow
                    value={prod.rating}
                    onChange={(r) => handleProductRate(prod.id, r)}
                  />
                </div>
              </div>

              {/* Expanded Detail Panel (Tags + Textarea + Image Upload) */}
              {prod.expanded && (
                <div className="flex flex-col gap-[12px]">
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-[8px]">
                    {prod.tags.map((tag) => {
                      const active = prod.selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(prod.id, tag)}
                          className={`h-[32px] min-w-[64px] px-[12px] rounded-full text-[12px] leading-[16px] transition-colors ${
                            active
                              ? 'bg-white border border-[#E40032] text-[#E40032] font-bold'
                              : 'bg-[#F7F7F7] border border-transparent text-[#1A1A1A] font-normal'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Text Area */}
                  <textarea
                    value={prod.comment}
                    onChange={(e) => handleCommentChange(prod.id, e.target.value)}
                    placeholder="Share your feedback of the product"
                    className="w-full h-[120px] rounded-[8px] border border-[#E0E0E0] bg-white px-[12px] py-[8px] text-[14px] leading-[20px] text-[#1A1A1A] placeholder:text-[#666666] resize-none outline-none focus:border-[#E40032]"
                  />

                  {/* Photo Upload Strip */}
                  <div className="flex flex-wrap gap-[8px]">
                    {prod.photos.map((ph) => (
                      <div
                        key={ph.id}
                        className="relative w-[78px] h-[78px] rounded-[10px] bg-white overflow-hidden shrink-0 border border-[#F0F0F0]"
                      >
                        <img
                          src={ph.src}
                          alt="Uploaded product feedback"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={() => handleRemovePhoto(prod.id, ph.id)}
                          className="absolute right-[4px] top-[4px] w-[20px] h-[20px] active:scale-90"
                        >
                          <img
                            src={FEEDBACK_ASSETS.removePhotoBtn}
                            alt=""
                            className="w-[20px] h-[20px] object-contain"
                          />
                        </button>
                      </div>
                    ))}

                    {prod.photos.length < 9 && (
                      <button
                        type="button"
                        onClick={() => handleAddPhoto(prod.id)}
                        className="w-[82px] h-[82px] rounded-[8px] border border-[#E0E0E0] bg-white flex flex-col items-center justify-center gap-[2px] active:bg-[#FAFAFA]"
                      >
                        <img
                          src={FEEDBACK_ASSETS.addImagePlus}
                          alt=""
                          className="w-[24px] h-[24px] object-contain"
                        />
                        <span className="text-[12px] leading-[16px] font-semibold text-[#666666]">
                          Add image
                        </span>
                        <span className="text-[10px] leading-[14px] text-[#666666]">
                          ({prod.photos.length}/9)
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fixed Bottom Sticky Footer (.app-fixed-bar) (Figma 6629:47307) */}
      <div className="app-fixed-bar bottom-0 z-30 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] px-[12px] pt-[12px] pb-[max(14px,env(safe-area-inset-bottom))] flex flex-col gap-[8px]">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-[48px] rounded-[8px] bg-[#E40032] text-white text-[16px] leading-[24px] font-bold flex items-center justify-center active:opacity-90 transition-opacity"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={() => setAnonymous((prev) => !prev)}
          className="flex items-center gap-[4px] self-start active:opacity-75"
        >
          <img
            src={anonymous ? FEEDBACK_ASSETS.radioChecked : FEEDBACK_ASSETS.radioBlank}
            alt=""
            className="w-[24px] h-[24px] object-contain"
          />
          <span className="text-[14px] leading-[20px] text-[#666666]">
            Anonymous feedback
          </span>
        </button>
      </div>

      {/* Submission Confirmation Sheet */}
      <BottomSheetDrawer
        open={submittedModalOpen}
        onClose={() => setSubmittedModalOpen(false)}
        title="Thank You for Your Feedback!"
      >
        <div className="p-[20px] flex flex-col items-center text-center gap-[14px]">
          <div className="w-[56px] h-[56px] rounded-full bg-[#EAF7EF] text-[#178A4A] text-[28px] font-bold flex items-center justify-center">
            ✓
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[16px] font-bold text-[#1A1A1A]">
              100 yuu points credited!
            </p>
            <p className="text-[13px] text-[#666666]">
              Your {anonymous ? 'anonymous ' : ''}review for Order #10008099984271 ({ratedProductCount} products rated) has been saved.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmittedModalOpen(false);
              navigate('home');
            }}
            className="w-full h-[44px] rounded-[8px] bg-[#E40032] text-white text-[15px] font-bold"
          >
            Back to Home
          </button>
        </div>
      </BottomSheetDrawer>
    </div>
  );
};
