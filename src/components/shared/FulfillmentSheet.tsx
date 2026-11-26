import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Crosshair,
  PencilLine,
  Plus,
  ScanLine,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { ASSETS, DELIVERY_ADDRESSES, PICKUP_STORES } from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import type { FulfillmentMode } from '../../types';
import { BottomSheetDrawer } from './BottomSheetDrawer';

export const FulfillmentSheet: React.FC = () => {
  const open = useAppStore((s) => s.fulfillmentSheetOpen);
  const close = useAppStore((s) => s.closeFulfillmentSheet);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const selectedAddressId = useAppStore((s) => s.selectedAddressId);
  const selectedStoreId = useAppStore((s) => s.selectedStoreId);
  const setFulfillment = useAppStore((s) => s.setFulfillment);
  const showToast = useAppStore((s) => s.showToast);

  const [tab, setTab] = useState<FulfillmentMode>(fulfillmentMode);
  const [draftAddressId, setDraftAddressId] = useState(selectedAddressId);
  const [draftStoreId, setDraftStoreId] = useState(selectedStoreId);
  const [storeQuery, setStoreQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'All' | 'New territories'>('New territories');

  useEffect(() => {
    if (open) {
      setTab(fulfillmentMode);
      setDraftAddressId(selectedAddressId);
      setDraftStoreId(selectedStoreId);
    }
  }, [open, fulfillmentMode, selectedAddressId, selectedStoreId]);

  const filteredStores = PICKUP_STORES.filter((store) => {
    const matchRegion = regionFilter === 'All' || store.region === regionFilter;
    const matchQuery =
      !storeQuery.trim() ||
      store.name.toLowerCase().includes(storeQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(storeQuery.toLowerCase());
    return matchRegion && matchQuery;
  });

  const handleConfirm = () => {
    setFulfillment(tab, draftAddressId, draftStoreId);
  };

  return (
    <BottomSheetDrawer
      open={open}
      onClose={close}
      title="Delivery or pickup?"
      maxHeightClass="max-h-[90dvh]"
      footer={
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-[46px] rounded-[10px] bg-[#E40032] text-white text-[15px] font-bold active:opacity-90 transition-opacity"
        >
          Continue
        </button>
      }
    >
      {/* Dual mode segmented tabs matching 5832:128131 & 5832:128512 */}
      <div className="grid grid-cols-2 bg-[#F5F5F5]">
        <button
          type="button"
          onClick={() => setTab('delivery')}
          className={`h-[48px] flex items-center justify-center gap-1.5 text-[14px] font-semibold transition-all ${
            tab === 'delivery'
              ? 'bg-gradient-to-b from-[#FFE8EC] to-white text-[#E40032] rounded-tr-[14px]'
              : 'text-[#3D3D3D]'
          }`}
        >
          <Truck className="w-4 h-4" strokeWidth={2} />
          Home Delivery
        </button>
        <button
          type="button"
          onClick={() => setTab('click_and_collect')}
          className={`h-[48px] flex items-center justify-center gap-1.5 text-[14px] font-semibold transition-all ${
            tab === 'click_and_collect'
              ? 'bg-gradient-to-b from-[#FFE8EC] to-white text-[#E40032] rounded-tl-[14px]'
              : 'text-[#3D3D3D]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={2} />
          Click &amp; Collect
        </button>
      </div>

      {/* Threshold quick hint pill */}
      <div className="px-4 pt-3">
        <div className="bg-[#FFF6F5] border border-[#FFD6DE] rounded-[8px] px-3 py-1.5 text-[11px] text-[#3D3D3D] flex items-center justify-between">
          {tab === 'delivery' ? (
            <span>
              Min order <strong className="text-[#E40032]">&#36;200</strong> · Free delivery at{' '}
              <strong className="text-[#E40032]">&#36;500</strong> · 12% off at{' '}
              <strong className="text-[#E40032]">&#36;800</strong>
            </span>
          ) : (
            <span>
              Min order <strong className="text-[#E40032]">&#36;50</strong> · Free pick-up at{' '}
              <strong className="text-[#E40032]">&#36;200</strong> · 12% off at{' '}
              <strong className="text-[#E40032]">&#36;800</strong>
            </span>
          )}
        </div>
      </div>

      {tab === 'delivery' ? (
        <div className="p-4 space-y-3 min-h-[380px]">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#1A1A1A]">
              Select delivery address
            </span>
            <button
              type="button"
              onClick={() => showToast('Add new address is mocked in this demo')}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[#666666]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          {DELIVERY_ADDRESSES.map((addr) => {
            const active = draftAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => setDraftAddressId(addr.id)}
                className={`rounded-[12px] p-3.5 border transition-colors cursor-pointer flex items-center gap-3 ${
                  active
                    ? 'border-[#E40032] bg-white'
                    : 'border-[#E5E5E5] bg-white'
                }`}
              >
                <span
                  className={`w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 border-2 ${
                    active ? 'border-[#E40032] bg-[#E40032]' : 'border-[#858585]'
                  }`}
                >
                  {active && <span className="w-[7px] h-[7px] rounded-full bg-white" />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {addr.tag && (
                      <span className="text-[10px] font-semibold text-[#E40032] border border-[#E40032] rounded-[4px] px-1.5 py-[0.5px] leading-[14px]">
                        {addr.tag}
                      </span>
                    )}
                    <p className="text-[15px] font-bold text-[#1A1A1A] truncate">
                      {addr.title}
                    </p>
                  </div>
                  <p className="text-[13px] text-[#3D3D3D] mt-1 leading-[18px]">
                    {addr.address}
                  </p>
                  <p className="text-[12px] text-[#858585] mt-1">
                    {addr.recipient} &nbsp; {addr.phone}
                  </p>
                </div>

                <PencilLine className="w-4 h-4 text-[#858585] shrink-0" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {/* Interactive Map Preview */}
          <div className="relative w-full h-[185px] rounded-[12px] overflow-hidden border border-[#EAEAEA]">
            <img
              src={ASSETS.mapImage}
              alt="Store locations map"
              className="w-full h-full object-cover"
            />
            {/* Wellcome brand map pins matching 5832:128512 */}
            <div className="absolute top-3 left-[28%] bg-[#E40032] text-white text-[10px] font-bold px-2 py-1 rounded-[6px] shadow-md">
              惠康 wellcome
            </div>
            <div className="absolute top-[42%] left-[52%] bg-[#E40032] text-white text-[10px] font-bold px-2 py-1 rounded-[6px] shadow-md">
              惠康 wellcome
            </div>
            <div className="absolute top-[46%] right-[16%] bg-[#1A1A1A] text-white text-[9px] font-bold px-1.5 py-1 rounded-[6px] shadow-md">
              MARKET PLACE
            </div>
          </div>

          {/* Search input */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[38px] rounded-[8px] border border-[#E0E0E0] px-2.5 flex items-center gap-2 bg-white">
              <Search className="w-4 h-4 text-[#666666] shrink-0" />
              <input
                type="text"
                value={storeQuery}
                onChange={(e) => setStoreQuery(e.target.value)}
                placeholder="Enter address/ building"
                className="flex-1 text-[13px] text-[#1A1A1A] placeholder:text-[#858585] outline-none bg-transparent"
              />
              <ScanLine className="w-4 h-4 text-[#3D3D3D] shrink-0" />
            </div>
            <button
              type="button"
              onClick={() => showToast('Located nearest Wellcome store')}
              className="w-[38px] h-[38px] rounded-[8px] border border-[#E0E0E0] flex items-center justify-center text-[#1A1A1A] bg-white"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

          {/* Region filter chips */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setRegionFilter((r) =>
                    r === 'New territories' ? 'All' : 'New territories'
                  )
                }
                className={`h-[30px] px-3 rounded-full text-[12px] font-medium inline-flex items-center gap-1 border ${
                  regionFilter === 'New territories'
                    ? 'border-[#E40032] text-[#E40032] bg-[#FFF6F5]'
                    : 'border-[#E0E0E0] text-[#3D3D3D] bg-[#F7F7F7]'
                }`}
              >
                {regionFilter === 'New territories' ? 'New territories' : 'All regions'}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <span className="h-[30px] px-3 rounded-full text-[12px] text-[#3D3D3D] bg-[#F5F5F5] inline-flex items-center gap-1">
                District
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('All');
                setStoreQuery('');
              }}
              className="text-[12px] font-semibold text-[#E40032] underline"
            >
              Reset
            </button>
          </div>

          {/* Store list */}
          <div className="space-y-2.5">
            {filteredStores.map((store) => {
              const active = draftStoreId === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setDraftStoreId(store.id)}
                  className={`rounded-[12px] p-3.5 border transition-colors cursor-pointer flex items-center gap-3 ${
                    active ? 'border-[#E40032] bg-white' : 'border-[#E5E5E5] bg-white'
                  }`}
                >
                  <span
                    className={`w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 border-2 ${
                      active ? 'border-[#E40032] bg-[#E40032]' : 'border-[#858585]'
                    }`}
                  >
                    {active && <span className="w-[7px] h-[7px] rounded-full bg-white" />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[15px] font-bold text-[#1A1A1A]">{store.name}</p>
                      <span className="text-[12px] text-[#858585]">{store.distance}</span>
                    </div>
                    <p className="text-[12px] text-[#3D3D3D] mt-1 leading-[17px]">
                      {store.address}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#858585] shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </BottomSheetDrawer>
  );
};
