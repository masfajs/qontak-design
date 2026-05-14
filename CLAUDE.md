# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This workspace contains four independent Nuxt prototype/design projects — each runs its own dev server and has its own `node_modules`:

| Directory | Purpose | Nuxt version |
|-----------|---------|--------------|
| `pixel-erp/` | Mekari ERP app shell boilerplate with 3-level sidebar navigation | Nuxt 4 |
| `qontak-design/` | Qontak CRM prototype template with Qontak navbar + sidebar | Nuxt 4 |
| `qontak-prototype/` | Earlier Qontak prototype | Nuxt 4 |
| `qontak-appointments/` | Qontak Appointments booking module (most feature-complete) | Nuxt 3 compat mode v4 |

## Commands

All commands must be run from within the specific sub-project directory.

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run generate  # Static site generation
npm run preview   # Preview production build
```

**pixel-erp only** has tests:
```bash
npm run test:design     # Design tests
npm run test:behavior   # Behavior tests
npm run test:all        # All tests (vitest)
```

## Pixel 3 Design System — Critical Rules

All projects use `@mekari/pixel3`. The following rules apply everywhere:

- **No auto-import** — always import components manually: `import { MpButton, MpFlex, MpText } from '@mekari/pixel3'`
- **SSR is disabled** (`ssr: false`) — Pixel 3 does not support server-side rendering
- CSS variables use the `--mp-colors-*` prefix, not `--pixel-colors-*`
- Design tokens require Token v2.4, enabled via `usePixelTheme().setNextTheme(true)` in `app/app.vue` — do not repeat in pages

## pixel-erp Architecture

The shell (`app/layouts/default.vue`, `app/components/ErpHeader.vue`, `app/components/ErpSidebar.vue`, `app/composables/useNavigation.ts`) is locked — do not modify.

**To add a new page:**
1. Create `app/components/pages/YourPage.vue`
2. Register it in `app/pages/index.vue` `pageRegistry` — the key must exactly match the sidebar label (case-sensitive)

**Custom patterns** (in `app/components/patterns/`) replace missing Enterprise Pixel components:
- `ErpTablePage` — use instead of `MpTable` for every index/list page
- `ErpStatusBadge` — wraps `MpBadge` with standard status→type mapping; use instead of raw `MpBadge` in table cells
- `ErpFilterBar`, `ErpPagination` — used internally by `ErpTablePage`

**Design rules** (from `DESIGN.md`):
- Enterprise theme: `setProductTheme('enterprise')` — already set in `app/app.vue`
- Stage padding: `24px` on all sides, no exceptions
- `MpTable` is not used — use `ErpTablePage` instead
- Mock data lives in `app/data/` — do not hardcode in components
- IDR format: `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(amount)`
- Date format: `DD/MM/YYYY` via `new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })`

## qontak-design / qontak-prototype Architecture

The layout shell (`app/layouts/default.vue`, `app/app.vue`, `app/composables/usePixelLayout.ts`) is locked — do not modify.

**To add a new page**, duplicate `app/pages/template.vue` and add `definePageMeta({ layout: 'default' })`.

Every page content wrapper must use:
```vue
<main data-pixel-component="PixelContent" v-bind="pixelContentAttrs">
```
where `pixelContentAttrs` comes from `usePixelLayout()`.

## qontak-appointments Architecture

This is the most complete project — Nuxt 3 with Pinia state management.

**Pinia stores** (`app/stores/`):
- `appointments/bookings.ts` — booking CRUD and state
- `appointments/timeline.ts` — timeline view (day/week grid)
- `masterData/locations.ts`, `masterData/staff.ts`, `masterData/services.ts`

**Key composables:**
- `useRole.ts` + `app/middleware/appointments-role.ts` — role-based access (admin vs staff views)
- `useBookingForm.ts` — booking creation/edit form logic
- `useRealtime.ts` — WebSocket connection for live updates
- `useIdempotency.ts` — prevents duplicate booking submissions
- `useTransferOrBlock.ts` — slot transfer and blocking logic

**Key utilities:**
- `bookingStateMachine.ts` — booking status transitions
- `timelineGrid.ts` — timeline column/row layout calculations
- `phoneNormalization.ts` / `usePhoneNormalization.ts` — phone format handling

Components are organized under `app/components/appointments/` by feature: `booking/`, `timeline/`, `audit/`, `transfer-or-block/`, `settings/`.

The nuxt config uses `pathPrefix: false` for components, so files are imported by filename only (not directory path).
