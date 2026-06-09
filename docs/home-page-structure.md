# Home Page Structure

This document explains how the home page is organized, where each part lives, and how to extend it without turning the page into a maze.

## High-Level Flow

The home page is assembled in this order:

```text
src/app/page.tsx
  -> src/screens/home/index.ts
  -> src/screens/home/ui/home-page.tsx
  -> src/screens/home/ui/home-shell.tsx
  -> src/widgets/homepage/*
  -> src/widgets/layout/*
  -> src/shared/ui/*
```

`src/app/page.tsx` is intentionally thin. It only renders `HomePage` from the screen layer.

`HomePage` owns the page composition: hero, promotions, rewards, features, onboarding, games, leaderboard, FAQ, and footer.

`HomeShell` owns the persistent layout behavior around the page content: header, sidebar, sidebar open state, sidebar collapsed state, and body scroll locking while the mobile sidebar is open.

## Main Entry Files

### `src/app/page.tsx`

Next.js route entry for `/`.

Keep this file small. It should only delegate to the screen-level component:

```tsx
import { HomePage } from "@/screens/home";

export default function Home() {
  return <HomePage />;
}
```

### `src/screens/home/index.ts`

Public export for the home screen.

Use this file when importing the full home screen from outside the screen folder.

### `src/screens/home/ui/home-page.tsx`

Main home page composition.

Responsibilities:

- Defines the page-level `<main>`.
- Wraps content in `HomeShell`.
- Orders all homepage sections.
- Defines the central content container width and responsive spacing.
- Renders the footer after the content sections.

Current section order:

```text
HeroSection
PromotionsSection
RewardsBanner
FeaturesSection
OnboardingSection
GamesSection
LeaderboardSection
FaqSection
Footer
```

### `src/screens/home/ui/home-shell.tsx`

Client component for layout state.

Responsibilities:

- Stores `isSidebarOpen`.
- Stores `isSidebarCollapsed`.
- Passes sidebar state to `HomeHeader` and `Sidebar`.
- Locks `document.body.style.overflow` while the mobile sidebar is open.
- Applies desktop content offset based on collapsed sidebar width.

Do not move section content into `HomeShell`; it should stay layout-focused.

## Homepage Widgets

Homepage sections live in:

```text
src/widgets/homepage
```

Each section follows this pattern:

```text
section-name/
  index.ts
  ui/
    section-component.tsx
  model/
    static-data.ts        optional
```

Use `index.ts` as the public export for the section. Import sections through `@/widgets/homepage` instead of reaching into nested `ui` files from the screen.

### `hero`

Path:

```text
src/widgets/homepage/hero/ui/hero-section.tsx
```

Purpose:

- First visual block of the page.
- Contains the welcome headline, supporting text, register button, background art, and floating decorative images.

Notes:

- Most images here are decorative and use empty `alt`.
- Keep hero-specific assets under `src/assets/homePage/heroSection`.
- This component is presentational and currently has no local model file.

### `promotions`

Paths:

```text
src/widgets/homepage/promotions/ui/promotions-section.tsx
src/widgets/homepage/promotions/ui/promotion-copy-button.tsx
```

Purpose:

- Shows promotion cards such as fortune bonus and competition.
- Handles promo code copy behavior.

Data:

- Promotion card data is currently local to `promotions-section.tsx`.
- Move it to `model/` only if it becomes shared or grows significantly.

Copy behavior:

- `PromotionCopyButton` writes the promo code to the clipboard.
- It has a fallback using a temporary hidden `textarea`.

### `rewards`

Paths:

```text
src/widgets/homepage/rewards/ui/rewards-banner.tsx
src/widgets/homepage/rewards/ui/reward-counter.tsx
src/widgets/homepage/rewards/ui/digit-wheel.tsx
```

Purpose:

- Displays the rewards banner and animated-looking reward counter.

Component roles:

- `RewardsBanner` lays out the reward block.
- `RewardCounter` formats the full counter.
- `DigitWheel` renders individual digit cells.

Keep digit sizing changes coordinated across `RewardCounter` and `DigitWheel`.

### `features`

Path:

```text
src/widgets/homepage/features/ui/features-section.tsx
```

Purpose:

- Renders feature cards for Leaderboard, Rewards, and Games.

Data:

- Feature data is currently local to the file.
- Each item includes background image, foreground image, title, and `href`.

### `onboarding`

Paths:

```text
src/widgets/homepage/onboarding/ui/onboarding-section.tsx
src/widgets/homepage/onboarding/ui/copy-button.tsx
```

Purpose:

- Shows the steps for getting started.
- Includes a promo code copy button for the registration step.

Data:

- Step data is local to `onboarding-section.tsx`.
- The `text` field accepts `ReactNode`, so steps can contain inline formatting and components.

### `games`

Paths:

```text
src/widgets/homepage/games/model/games.ts
src/widgets/homepage/games/ui/games-section.tsx
src/widgets/homepage/games/ui/game-card.tsx
src/widgets/homepage/games/ui/game-mark.tsx
```

Purpose:

- Displays the game card grid.

Data:

- `model/games.ts` stores the game list and the `Game` type.
- Each game defines title, href, image, accent color, blur color, and SVG gradient values.

Component roles:

- `GamesSection` maps over `games`.
- `GameCard` renders one clickable game card.
- `GameMark` renders decorative SVG styling for the card.

Add new games by updating `model/games.ts`, then adding the related asset under `src/assets/homePage/games`.

### `leaderboard`

Paths:

```text
src/widgets/homepage/leaderboard/model/players.ts
src/widgets/homepage/leaderboard/ui/leaderboard-section.tsx
src/widgets/homepage/leaderboard/ui/leaderboard-card.tsx
src/widgets/homepage/leaderboard/ui/avatar-rank.tsx
src/widgets/homepage/leaderboard/ui/leaderboard-glow.tsx
```

Purpose:

- Shows the monthly leaderboard section.

Data:

- `model/players.ts` stores the player list and the `Player` type.
- The `winner` flag marks the highlighted center card.

Component roles:

- `LeaderboardSection` owns the section layout and mobile card order.
- `LeaderboardCard` renders player stats and prize details.
- `AvatarRank` composes the avatar and rank badge.
- `LeaderboardGlow` renders the decorative background glow.

### `faq`

Path:

```text
src/widgets/homepage/faq/ui/faq-section.tsx
```

Purpose:

- Renders the FAQ accordion.

State:

- Uses local `openIndex` state.
- The default open item is currently index `1`.

If FAQ data becomes dynamic or shared, move the `questions` array into `model/`.

## Layout Widgets

Layout widgets live in:

```text
src/widgets/layout
```

They are separate from homepage content because they frame the page instead of being page sections.

### `header`

Path:

```text
src/widgets/layout/header/ui/home-header.tsx
```

Purpose:

- Fixed top header.
- Renders the logo, login button, and mobile/tablet sidebar toggle.

Props:

- `isSidebarOpen` controls toggle accessibility state and label.
- `onMenuClick` toggles the sidebar.

### `sidebar`

Paths:

```text
src/widgets/layout/sidebar/model/nav-items.ts
src/widgets/layout/sidebar/model/types.ts
src/widgets/layout/sidebar/ui/sidebar.tsx
src/widgets/layout/sidebar/ui/nav-link.tsx
src/widgets/layout/sidebar/ui/nav-dropdown.tsx
src/widgets/layout/sidebar/ui/claim-card.tsx
```

Purpose:

- Main side navigation.
- Collapsible on desktop.
- Slide-in drawer on mobile/tablet.

Data:

- `model/nav-items.ts` stores sidebar navigation data.
- `model/types.ts` defines link and dropdown item types.

Component roles:

- `Sidebar` owns layout and delegates item rendering.
- `NavLink` renders a single navigation link.
- `NavDropdown` renders the games dropdown.
- `ClaimCard` renders the daily claim block.

State ownership:

- `Sidebar` does not own open/collapsed state.
- `HomeShell` owns the state and passes handlers down.

Important responsive behavior:

- `desktop` starts at `1280px`.
- Below `desktop`, the sidebar is controlled by `isMobileOpen`.
- At `desktop` and above, it is always positioned as the desktop sidebar.

### `footer`

Paths:

```text
src/widgets/layout/footer/ui/footer.tsx
src/widgets/layout/footer/ui/footer-brand.tsx
src/widgets/layout/footer/ui/footer-column.tsx
src/widgets/layout/footer/ui/footer-socials.tsx
src/widgets/layout/footer/ui/footer-legal.tsx
```

Purpose:

- Renders brand, legal copy, footer navigation, and social links.

Data:

- Footer link lists and social links are local to `footer.tsx`.
- Move them to `model/` if they become shared or fetched.

## Shared UI

Shared components live in:

```text
src/shared/ui
```

Current shared components:

```text
button.tsx
section-title.tsx
```

### `Button`

Reusable button primitive.

Supports:

- Native button props.
- `variant="primary"`.
- `variant="ghost"`.

Use this for real buttons, not links. If navigation is needed, wrap it with `Link` only when the current project pattern already does so.

### `SectionTitle`

Small section heading with an icon.

Used by homepage sections such as Games, Features, FAQ, and Onboarding.

## Assets

Assets are stored under:

```text
src/assets
```

Relevant home page folders:

```text
src/assets/homePage/heroSection
src/assets/homePage/promotions
src/assets/homePage/rewards
src/assets/homePage/features
src/assets/homePage/onboarding
src/assets/homePage/games
src/assets/homePage/leaderboardSection
src/assets/aside
src/assets/header
src/assets/footer
```

Guidelines:

- Keep section-specific assets near the matching asset folder.
- Decorative images should usually use `alt=""`.
- Content images should have meaningful `alt` text.
- Prefer static imports with `next/image`, as the current codebase already does.

## Exports and Import Rules

Each feature folder exposes a public API through `index.ts`.

Use these imports:

```tsx
import { HomePage } from "@/screens/home";
import { GamesSection } from "@/widgets/homepage";
import { Sidebar } from "@/widgets/layout";
import { Button } from "@/shared";
```

Avoid imports like this from outside the owning folder:

```tsx
import { GamesSection } from "@/widgets/homepage/games/ui/games-section";
```

Direct nested imports make refactors harder and bypass the folder boundary.

## Responsive Breakpoints

Named Tailwind breakpoints are defined in:

```text
src/app/globals.css
```

Current aliases:

```text
mobile: 375px
tablet: 768px
laptop: 1024px
desktop: 1280px
large: 1440px
wide: 1920px
```

Common patterns:

```tsx
max-tablet:px-4
tablet:max-laptop:grid-cols-2
laptop:max-large:max-w-[960px]
desktop:w-[227px]
max-desktop:-translate-x-full
```

Do not replace desktop behavior with unbounded `lg:` or `xl:` unless the visual impact at `1440px` and `1920px` is intentional.

Some sidebar classes are safelisted with `@source inline(...)` because they are used inside conditional class strings. If you add new conditional Tailwind classes that do not appear in generated CSS, add them there or make the class strings statically discoverable.

## Adding a New Homepage Section

1. Create a new folder in `src/widgets/homepage`.
2. Add a `ui/` folder with the section component.
3. Add `model/` only if the section has typed static data or shared data.
4. Add an `index.ts` that exports the public component.
5. Re-export it from `src/widgets/homepage/index.ts`.
6. Place the section in `src/screens/home/ui/home-page.tsx`.
7. Add assets under `src/assets/homePage/<section-name>`.
8. Check `1920px`, `1440px`, `1024px`, `768px`, and `375px`.

Example:

```text
src/widgets/homepage/new-section/
  index.ts
  model/
    items.ts
  ui/
    new-section.tsx
```

## Where to Put Changes

Use this quick map:

```text
Change page order or section spacing:
  src/screens/home/ui/home-page.tsx

Change sidebar open/collapse behavior:
  src/screens/home/ui/home-shell.tsx
  src/widgets/layout/sidebar/ui/sidebar.tsx

Change sidebar links:
  src/widgets/layout/sidebar/model/nav-items.ts

Change game cards:
  src/widgets/homepage/games/model/games.ts
  src/widgets/homepage/games/ui/game-card.tsx

Change leaderboard players:
  src/widgets/homepage/leaderboard/model/players.ts

Change footer links or socials:
  src/widgets/layout/footer/ui/footer.tsx

Change shared button styles:
  src/shared/ui/button.tsx

Change section heading style:
  src/shared/ui/section-title.tsx

Change colors, shadows, gradients, breakpoints:
  src/app/globals.css
```

## Maintenance Notes

- Keep page composition in `screens/home`.
- Keep reusable page sections in `widgets/homepage`.
- Keep frame-level layout in `widgets/layout`.
- Keep simple primitives in `shared/ui`.
- Keep static typed data in `model/` when it is large, reused, or easier to test separately.
- Preserve the public `index.ts` exports for clean imports.
- Avoid moving responsive behavior into JavaScript when CSS variants are enough.
