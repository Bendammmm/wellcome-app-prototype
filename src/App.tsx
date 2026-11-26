import React from 'react';
import { HomePage } from './pages/Home/HomePage';
import { PdpPage } from './pages/PDP/PdpPage';
import { CartPage } from './pages/Cart/CartPage';
import { SmartTipsPage } from './pages/Cart/SmartTipsPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { PaymentSuccessPage } from './pages/Checkout/PaymentSuccessPage';
import { SearchPage } from './pages/Search/SearchPage';
import { SearchResultsPage } from './pages/Search/SearchResultsPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { MePage } from './pages/Me/MePage';
import { YuuIdPage } from './pages/Me/YuuIdPage';
import { OrderListPage } from './pages/Orders/OrderListPage';
import { OrderDetailPage } from './pages/Orders/OrderDetailPage';
import { InStorePage } from './pages/InStore/InStorePage';
import { ShoppingListPage } from './pages/InStore/ShoppingListPage';
import { RefundRequestPage } from './pages/Refund/RefundRequestPage';
import { RefundSuccessPage } from './pages/Refund/RefundSuccessPage';
import { FeedbackPage } from './pages/Feedback/FeedbackPage';
import { SplashPage } from './pages/Auth/SplashPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { FulfillmentSheet } from './components/shared/FulfillmentSheet';
import { ToastBanner } from './components/shared/ToastBanner';
import { getTotalCartCount, useAppStore } from './store/useAppStore';

export const App: React.FC = () => {
  const activePage = useAppStore((s) => s.activePage);
  const navigate = useAppStore((s) => s.navigate);
  const fulfillmentMode = useAppStore((s) => s.fulfillmentMode);
  const openFulfillmentSheet = useAppStore((s) => s.openFulfillmentSheet);
  const resetDemoCart = useAppStore((s) => s.resetDemoCart);
  const cartCount = useAppStore((s) => getTotalCartCount(s.cartItems));

  return (
    <div className="app-viewport-outer">
      {/* Desktop-only preview helper sidebar (hidden on mobile phones <= 440px) */}
      <aside className="hidden lg:flex fixed left-6 top-6 max-h-[calc(100vh-48px)] overflow-y-auto flex-col gap-3 w-[230px] bg-white/95 backdrop-blur rounded-[16px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/5 z-40">
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#E40032] bg-[#FFF0F2] px-2 py-0.5 rounded-full">
            Wellcome Prototype
          </span>
          <h2 className="text-[15px] font-bold text-[#1A1A1A] mt-1.5">
            393px Mobile Preview
          </h2>
          <p className="text-[11px] text-[#666666] leading-[16px] mt-0.5">
            Open this URL on iPhone/Android &amp; &ldquo;Add to Home Screen&rdquo; for fullscreen app feel.
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-[#858585]">Quick Jump</p>
          {(
            [
              { id: 'splash', label: 'Splash Screen' },
              { id: 'login', label: 'Login / Sign up' },
              { id: 'home', label: 'Home (Immersive)' },
              { id: 'categories', label: 'Categories (分类)' },
              { id: 'search', label: 'Search Entry' },
              { id: 'search-results', label: 'Search Results (Milk)' },
              { id: 'pdp', label: 'PDP (Case Deal Wine)' },
              { id: 'cart', label: `Cart (${cartCount})` },
              { id: 'smart-tips', label: 'Smart Tips (凑单页)' },
              { id: 'checkout', label: 'Checkout' },
              { id: 'payment-success', label: 'Payment Result' },
              { id: 'me', label: 'Me (个人中心)' },
              { id: 'yuu-id', label: 'yuu ID (会员码)' },
              { id: 'order-list', label: 'Order List (订单列表)' },
              { id: 'order-detail', label: 'Order Detail (订单详情)' },
              { id: 'in-store', label: 'In-Store (WESTWOOD)' },
              { id: 'shopping-list', label: 'Shopping List' },
              { id: 'refund', label: 'Request Refund' },
              { id: 'refund-success', label: 'Refund Details' },
              { id: 'feedback', label: 'Order Feedback' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id, item.id === 'pdp' ? 'belena-shiraz' : undefined)}
              className={`w-full text-left px-3 py-2 rounded-[8px] text-[12px] font-semibold transition-colors ${
                activePage === item.id
                  ? 'bg-[#E40032] text-white'
                  : 'bg-[#F5F5F5] text-[#3D3D3D] hover:bg-[#EAEAEA]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-[#EFEFEF] space-y-2">
          <p className="text-[11px] font-semibold text-[#858585]">Fulfillment Mode</p>
          <button
            type="button"
            onClick={openFulfillmentSheet}
            className="w-full px-3 py-2 rounded-[8px] border border-[#E0E0E0] text-[12px] font-medium text-[#1A1A1A] hover:bg-[#FAFAFA] text-left"
          >
            {fulfillmentMode === 'delivery'
              ? '🚚 Delivery ($200/$500/$800)'
              : '🛍️ Click & Collect ($50/$200/$800)'}
          </button>
          <button
            type="button"
            onClick={resetDemoCart}
            className="w-full px-3 py-1.5 rounded-[8px] text-[11px] font-medium text-[#666666] hover:bg-[#F5F5F5]"
          >
            Reset Demo Cart
          </button>
        </div>
      </aside>

      {/* Main 393px Mobile App Shell */}
      <main className="app-viewport-shell">
        {activePage === 'splash' && <SplashPage />}
        {activePage === 'login' && <LoginPage />}
        {activePage === 'home' && <HomePage />}
        {activePage === 'categories' && <CategoriesPage />}
        {activePage === 'search' && <SearchPage />}
        {activePage === 'search-results' && <SearchResultsPage />}
        {activePage === 'pdp' && <PdpPage />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'smart-tips' && <SmartTipsPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'payment-success' && <PaymentSuccessPage />}
        {activePage === 'me' && <MePage />}
        {activePage === 'yuu-id' && <YuuIdPage />}
        {activePage === 'order-list' && <OrderListPage />}
        {activePage === 'order-detail' && <OrderDetailPage />}
        {activePage === 'in-store' && <InStorePage />}
        {activePage === 'shopping-list' && <ShoppingListPage />}
        {activePage === 'refund' && <RefundRequestPage />}
        {activePage === 'refund-success' && <RefundSuccessPage />}
        {activePage === 'feedback' && <FeedbackPage />}

        <FulfillmentSheet />
        <ToastBanner />
      </main>
    </div>
  );
};

export default App;
