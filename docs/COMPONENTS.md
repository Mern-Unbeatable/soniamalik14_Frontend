# Components Index

This document maps the main reusable components in the project and where to find them.

## Shared (reusable) components

- `src/components/ui`
  - `Button.jsx` — generic button used across pages.
  - `CallToAction.jsx` — CTA block used in landing sections.
  - `Card.jsx` — simple card wrapper for items.
  - `DashboardHeader.jsx` — dashboard page header with title and subtitle.
  - `FeatureCard.jsx` — specialized card for feature lists.
  - `HeroTitle.jsx` — hero section title component.
  - `PageHeader.jsx` — page header with title and optional actions.
  - `Pagination.jsx` — reusable pagination control.
  - `SectionHeader.jsx` — small header for sections.
  - `Table.jsx` — reusable table component with customizable columns and rows.
  - `TablePagination.jsx` — pagination for tables with prev/next navigation.
  - `Title.jsx` — simple heading component.
  - `UnderConstruction.jsx` — placeholder component for unfinished pages.

- `src/components/layout`
  - `Container.jsx` — page container wrapper.
  - `FooterLayout.jsx` — site footer layout.
  - `HeaderTop.jsx` — top portion of the header (aux links).
  - `HeaderNav.jsx` — main navigation component.
  - `NavbarLayout.jsx` — navbar wrapper and layout.
  - `RootLayout.jsx` — top-level layout for routes.
  - `Sidebar.jsx` — sidebar used on listing/detail pages.

- `src/components/ProtectedRoute.jsx` — route guard used for private routes.

## Page-specific components

- News (`src/pages/public/public_news/components`)
  - `NewsHero.jsx` — hero/banner for news page.
  - `NewsList.jsx` — list of news items.
  - `NewsItem.jsx` — single news item card.

- Market (`src/pages/public/public_market/components`)
  - `MarketplaceCard.jsx` — product card used in marketplace.
  - `AddProductModal.jsx` — modal form to add products.

- Event (`src/pages/public/public_event/components`)
  - `EventCard.jsx` — event listing card.
  - `EventFilters.jsx` — filters for event listings.

- Home (`src/pages/public/public_Home/components`)
  - `Hero.jsx` — home page hero.
  - `CoreFeatures.jsx` — list of core features.
  - `HowItWorks.jsx` — steps explaining how the app works.
  - `InjurySupportHub.jsx` — special section for support resources.
  - `JoinCta.jsx` — join call-to-action component.

- Discover (`src/pages/public/public_discover/components`)
  - `DiscoverCard.jsx` — card for discover items.
  - `Filters.jsx` — discover filters.
  - `Pagination.jsx` — page-level pagination (page-scoped).

- Community (`src/pages/public/public_community/components`)
  - `CategorySidebar.jsx` — category filter sidebar.
  - `CommunityDetails.jsx` — community detail panel.
  - `ForumTopicCard.jsx` — forum topic card.
  - `NewDiscussionModal.jsx` — modal to create a new discussion.

- Service (`src/pages/public/public_service/components`)
  - `ServiceFilters.jsx` — filters for service listings.

## Notes & conventions

- Shared UI components should go into `src/components/ui` and be written to be reusable with clear props.
- Page-specific components belong inside the respective page folder `src/pages/.../components`.
- When adding a shared component, update `docs/COMPONENTS.md` and mention usage examples.

If you want, I can also update `README.md` to link to these docs and/or open a PR with these files. Reply with what you'd like next.
