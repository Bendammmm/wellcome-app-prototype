# Wellcome App Prototype — Shared Project Context & Multi-Thread Guide

> **For any new agent / parallel thread:** Read this file first before writing code so all pages share the exact same design system, store contract, and visual quality bar.

---

## 1. Project & Deployment Info

- **Directory**: `wellcome-app/`
- **GitHub Repo**: `https://github.com/Bendammmm/wellcome-app-prototype`
- **Deployment**: Vercel auto-deploys `main` to production and automatically generates a **Preview URL** for every feature branch pushed to GitHub.
- **Stack**: React 18 + TypeScript + Vite 6 + Tailwind CSS v4 + Zustand (`persist` to `localStorage`) + PWA `manifest.json`.
- **Commands**:
  - Dev server: `npm run dev` (local preview at `http://localhost:5173/`)
  - Type-check & Build gate: `npm run build` (`tsc -b && vite build`)

---

## 2. Figma Design Sources (Single Source of Truth)

- **Main App Design (`Core Process - WE`)**:
  `https://www.figma.com/design/qyeqWHWP73QRPYG6YQrR1d/-New-Wellcome-App?node-id=531-67273`
  - Home (Immersive Christmas Header `2329:171344`, collapsed sticky bar `7515:50982`; **no** 5-icon circular category row)
  - PDP (Case Deal Wine & standard products)
  - Cart (Filled, Empty, Delivery & Click & Collect)
  - Smart Tips 凑单页 (`7406:228212`)
- **Component Library**:
  `https://www.figma.com/design/ywmvE9fwRx3pLHEjMYHLMY/Wellcome-Component-library?node-id=451-18774`
  - Product Card (`486:55467`), Price Footer (`490:55771`, fixed `46px` height, `add button` pinned `bottom: 4px; right: 4px`)
  - 4-state `add button` (`452:19011`): default `32x32`→`24x24` red `+`, disabled `24x24` `#EEE`, active `92x32` white pill `- qty +`, added `24x24` red qty badge
  - `_Cart Quantity Stepper` (`1328:547`, `88x24`)

---

## 3. Architecture & Directory Map

```text
wellcome-app/
├── public/assets/
│   ├── products/            # Product photography
│   └── figma/               # 3x exported banners & original Figma SVG icons
└── src/
    ├── App.tsx              # Route switcher (RoutePage) + 393px shell + desktop sidebar
    ├── index.css            # Layout shell (.app-viewport-shell, .app-fixed-bar) & keyframes
    ├── styles/tokens.css    # Figma color, radius, shadow & typography CSS variables
    ├── types/index.ts       # Shared TypeScript interfaces (RoutePage, Product, CartItem, etc.)
    ├── data/catalog.ts      # Mock products, addresses, pickup stores, coupons, initial cart
    ├── store/useAppStore.ts # Global Zustand store + real promo & threshold calculation engine
    ├── components/shared/   # Reusable Figma-aligned components (DO NOT break existing props)
    └── pages/
        ├── Home/HomePage.tsx
        ├── PDP/PdpPage.tsx
        ├── Cart/CartPage.tsx
        └── Cart/SmartTipsPage.tsx
```

### Shared Components (`src/components/shared/`)
- `AppTabBar.tsx`: Bottom navigation bar (uses `.app-fixed-bar` for full-width mobile / `393px` desktop shell).
- `BottomSheetDrawer.tsx`: Reusable bottom sheet modal.
- `FulfillmentSheet.tsx`: Home Delivery / Click & Collect address & store picker.
- `ThresholdProgressBar.tsx`: 3-milestone threshold progress bar (Home & Cart).
- `ProductCard.tsx`: Standard product card (aligns with Figma `486:55467`; borderless card surface, bottom-aligned add control).
- `ProductAddControl.tsx`: 4-state add-to-cart control (`452:19011`).
- `QuantityStepper.tsx`: Cart quantity stepper (`1328:547`, `88x24`).
- `PriceBlock.tsx`, `PromoTag.tsx`, `CountdownTimer.tsx`, `ToastBanner.tsx`.

---

## 4. Core Business Logic Contract (`src/store/useAppStore.ts`)

- **Fulfillment Thresholds**:
  - **Home Delivery (`delivery`)**: `$200` min order (`$50` fee) → `$500` Free Delivery → `$800` 12% off
  - **Click & Collect (`click_and_collect`)**: `$50` min order (`$20` fee) → `$200` Free Pick-up → `$800` 12% off
- **Routing (`RoutePage` in `src/types/index.ts`)**:
  - Current routes: `'home' | 'pdp' | 'cart' | 'smart-tips'`
  - Navigate via `useAppStore((s) => s.navigate)(page, productId?)` and `goBack()`.
- **Cart Actions**: `addToCart`, `setCartItemQty`, `removeCartItem`, `toggleItemSelected`, `toggleSelectAll`, `submitMockOrder`.
- **Responsive Fixed Bars**: Any `position: fixed` top bar, bottom bar, or sheet MUST use `.app-fixed-bar` (full viewport width on mobile `<= 480px`, centered `393px` max-width on desktop).

---

## 5. Strict Visual & Quality Rules

1. **No CSS-redrawn icons or marketing banners**: Always export original Figma SVGs and `3x` raster banners into `public/assets/figma/`.
2. **Exact Figma alignment**: Check font sizes, weights, icon dimensions, padding, edge margins (horizontal scroll sections have left padding at rest and right padding at scroll-end), and component library states — never eyeball or invent dimensions.
3. **Mandatory Visual QA Skill & Pixel-Diff Tool**: Before declaring any page/module done, load `.agents/skills/visual-qa-figma/SKILL.md` and run `node scripts/visual-diff.mjs <figma.png> <actual.png> <out-triptych.png>` to inspect the 3-panel `[Figma | Actual | Diff Heatmap]` and complete the 7-point checklist.
4. **Build gate**: Run `npm run build` and ensure zero TypeScript/Vite errors before committing.

---

## 6. Multi-Thread Collaboration Protocol

To run multiple threads/agents in parallel cleanly:
1. **Isolate by Git branch** (or `git worktree`): Create a branch per task, e.g. `feat/search-page`, `feat/categories-page`, `feat/checkout-flow`, `fix/pdp-visual`.
2. **Isolate by directory**: Put new pages in their own folder under `src/pages/<PageName>/`.
3. **Keep shared files additive only**: When adding a new route or store slice, only append to `RoutePage` in `src/types/index.ts`, `src/App.tsx`, `src/data/catalog.ts`, or `src/store/useAppStore.ts` — avoid refactoring existing signatures while another thread is active.
4. **Push branch → Preview on Vercel → Merge to `main`**: Push your branch to get an automatic Vercel Preview URL for mobile QA, then merge into `main` once approved.
