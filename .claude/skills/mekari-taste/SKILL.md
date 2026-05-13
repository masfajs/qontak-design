---
name: mekari-taste
description: Translate Mekari PRDs or Figma key-page designs into runnable Vue/Nuxt code using Pixel 3 components on token 2.4. Use this skill whenever the user attaches a Figma link, a Confluence PRD, pastes requirements, or asks to "build/implement/code this screen" for Mekari products (Expense, Talenta, Qontak, Jurnal, Flex, KlikPajak, Sign, etc.). The skill replaces traditional Figma-to-handoff workflows — designers provide key pages only, this skill fills in all states (hover, empty, error, loading) and edge cases the designer skipped, then routes through the appropriate Pixel MCP prompt (`/implement-figma-to-pixel` for Figma input, `/create-design-to-pixel` for PRD input) and reconciles output against Mekari taste conventions. Output is always Vue/Nuxt code, structured for easy iteration. Also load this skill directly when reviewing a Mekari design, critiquing copy, comparing two layouts, or answering "how does Mekari handle X". Do not use for marketing pages, landing pages, or external-facing editorial content.
---

# Mekari Taste — Pixel 2.4 Product UI

This skill exists to replace traditional Figma handoff. Designers provide key pages only — this skill fills in everything else (interaction states, edge cases, copy gaps) and produces Vue/Nuxt code on Pixel 3. The output is structured for direct iteration: teams refine the code rather than refining Figma.

The skill carries two things: the **taste** (what a Mekari screen looks and feels like) and the **workflow** (how to get from input to iterable code).

## Token mode

**Default to Pixel 2.4 in all cases.** Do not ask.

Switch to a different mode only if the user explicitly mentions it — phrases like "Pixel 2.1", "the old token names", "Enterprise tokens", or names a specific legacy project. Return to 2.4 default for any subsequent task that doesn't mention tokens.

All examples and references use 2.4 semantic tokens (`Color/Text/default`, `pxl-space-md`, `Color/Background/surface`). If outputting 2.1 after explicit request, translate from these names — do not silently mix modes.

## The Mekari product look at a glance

A Mekari screen is **dense but legible**, **functional, not editorial**, and **trust-driven**. It is built for accountants, HR, sales ops, and finance teams who use the product daily. That audience leads to specific taste choices:

- **Inter everywhere.** No serif, no display font. Editorial taste is wrong here.
- **Stage background is `#F1F5F9` (warm-cool slate), not pure white.** Surfaces (cards, table containers) are white on top of the stage. The contrast between stage and surface is how sections separate — not heavy borders or shadows.
- **Color is reserved for signal.** Brand blue `#4B61DC` is for primary actions and active states only. Status colors (green success, red danger, yellow warning) only appear on pills, dots, and indicator icons. Backgrounds are never colored.
- **Accountability is visible.** Status fields don't just say "Approved" — they say "Approved by [name], [timestamp]". Audit trail is part of the UI, not buried in a side panel.
- **Density over decoration.** Generous-but-not-luxurious spacing. Row padding of 16 in tables, not 24. Page padding of 24, not 40. Mekari users scan a lot of data.
- **No gratuitous illustration in working states.** Empty states get a colored 3D illustration to soften the "nothing here yet" moment. Working states (data loaded, form in progress) get zero illustration.

## Foundations (Pixel 2.4 tokens)

Use these tokens by name in any code or annotation. Do not hardcode the hex values; the hex is shown only so you recognize the role.

### Color roles
- Stage / page bg → `Color/Background/surface` (`#F1F5F9`)
- Card / panel surface → `Color/Background/stage` (`#FFFFFF`) — yes, the names are inverted from intuition; this is correct
- Text primary → `Color/Text/default` (`#272B32`)
- Text secondary → `Color/Text/secondary` (`#656F80`)
- Text link / brand text → `Color/Text/link` (`#4B61DC`)
- Border default → `Color/Border/default` (`#DCDFE4`)
- Border / icon selected → `Color/Border/selected`, `Color/Icon/brand` (`#4B61DC`)
- Selected item bg (nav active, etc.) → `Color/Background/brand-selected` (`#D6DBF7`)
- Primary action bg → `Color/Background/brand-bold` (`#4B61DC`)
- Success → `Color/Background/success-bold` (`#1C8459`)
- Danger → `Color/Background/danger-bold` (`#C33E35`)

### Spacing scale
`pxl-space-4xs` 2 · `3xs` 4 · `2xs` 6 · `xs` 8 · `sm` 12 · `md` 16 · `xl` 24 · `3xl` 40 · `4xl` 80

**Default choices:**
- Field-to-field vertical gap in a form → `md` (16)
- Card internal padding → `xl` (24)
- Page horizontal padding inside content area → `xl` (24)
- Row vertical padding in data tables → `md` (16)
- Section-to-section vertical gap → `3xl` (40) or a divider line
- Icon-to-label gap → `xs` (8)

### Typography
- `Heading/H1` → 24 Semibold, line-height 32, letter-spacing dense (-0.2) — page titles only, one per screen
- `Heading/H2` → 20 Semibold, line-height 32 — card / section headers
- `Heading/H3` → 16 Semibold — sub-sections inside a card
- `Label/Semibold` → 14 Semibold — form labels, table headers, key labels in detail views
- `Label/Regular` → 14 Regular — values, body, default UI text
- `Label small/Regular` → 12 Regular — secondary/meta text, helper text, breadcrumbs
- `Overline/Semibold` → 10 Semibold, uppercase, tracking normal — sidebar section headers ("TRANSACTIONS", "BENEFIT REIMBURSEMENT")

### Radius
- `pxl-radii-md` 6 — buttons, inputs, cards (default)
- `pxl-radii-full` 999 — pills, badges, avatars

### Shadows
By default, none. If a component must lift (dropdown menu, modal, popover), use the lightest Pixel elevation token and only on that floating layer. Cards in the page flow are flat — they separate from the stage by color contrast, not shadow.

## Pattern decision table

When you have a screen to design or build, map it to one of these patterns first, then read the matching reference. Most screens are 1 layout shell + 1 primary pattern + 1–2 nested patterns.

| If the screen is… | Pattern | Reference |
|---|---|---|
| The frame every screen sits in (top bar, nav, content area, page header) | **Layout shell** | `references/layout-shell.md` |
| A page showing a single record with many fields | **Detail view** | `references/detail-view.md` |
| A page listing many records (with sort/filter) | **Index/list view** | `references/index-view.md` |
| A page for creating or editing a record | **Form view** | `references/form-view.md` |
| A blank state before the first record exists | **Empty state** (often nested) | `references/empty-state.md` |
| Uploading files (single or multiple, with progress) | **Upload flow** | `references/upload-flow.md` |
| Selecting multiple table rows to act on | **Bulk select** | `references/bulk-select.md` |
| Narrowing a list with multiple criteria | **Filter** | `references/filter.md` |
| Asking the user "are you sure?" before a destructive action | **Confirmation** | `references/confirmation.md` |

Always read `layout-shell.md` once at the start of a new screen. Then read only the pattern reference(s) the task actually needs — progressive disclosure.

Each pattern reference covers anatomy, anti-patterns specific to that pattern, edge cases that PRDs typically forget, and an output contract.

## Workflow — input to iterable Vue/Nuxt code

This skill replaces handoff. Designers attach key pages only; you fill in everything else and produce code teams can iterate on directly. The workflow has two branches based on input type, but the bulk of the work is shared.

### Branch A: Input is a Figma key page

1. **Fetch the design.** Load `figma-implement-design`. Extract `fileKey` and `nodeId` from the URL, then call `get_design_context`, `get_screenshot`, and `get_variable_defs` for the target node. For large nodes, use `get_metadata` first then drill into specific children.

2. **Detect product and confirm token mode.** Read the product name from the top bar logo lockup in the screenshot ("mekari expense", "mekari talenta", etc.) or from the Figma file name. Confirm token mode from `get_variable_defs` — if shape looks like 2.4 (`Color/Background/surface`, `pxl-space-md`), proceed. If 2.1 (`$gray-600`, `Spacing/xs`), inform the user and ask whether to translate to 2.4 or keep 2.1.

3. **Identify patterns and read references.** Map what you see in the screenshot to the pattern decision table above. Read only the references for patterns actually present.

4. **Build the gap list — this is where this skill earns its value.** Designer key pages typically show only the happy path. Walk through every pattern's "Edge cases the PRD probably forgot" section and list what Figma did NOT show. Then specifically check for:

   - **Hover, active, disabled, focus states** for interactive elements
   - **Loading state** (skeleton rows, spinner, shimmer)
   - **Empty state** — is there a frame for "no data yet"? If not, build one
   - **Error states** — failed API call, failed form submit, validation errors
   - **Null/missing values** in detail rows and table cells
   - **Permission-gated rows or fields** — hidden, disabled, or redacted
   - **Conditional fields and sub-sections** — what triggers them, what hides them
   - **Sticky behavior on scroll** for headers, action bars, sidebars

   Use `mekari-taste` defaults from the pattern references for all of these. **Do not stop and ask for each one** — that defeats the goal of fast iteration. Use defaults, document them prominently in the output, and let the team override during code iteration.

5. **Route through Pixel MCP prompt.** Call `/implement-figma-to-pixel`. Pass: the Figma `fileKey`/`nodeId`, patterns identified, gap fills you applied, token mode 2.4.

6. **Reconcile against Mekari conventions.** The prompt produces components that match Figma but may carry decisions that conflict with Mekari taste. Apply overrides:

   - Status display: expand plain `Approved` to `Approved by [name], [date time] (timezone)` with status dot
   - Empty state: ensure illustrated + descriptive title + action-pointing helper with bold button name (build one if Figma didn't have it)
   - File input helper: specific formats and size limit, never generic
   - Table: 1px bottom row border only, no zebra, no outer border, numerics right-aligned (override Figma if needed)
   - Cancel button: text link or low-emphasis, never matching weight to primary submit
   - Required indicators: red asterisk on label
   - Copy voice: rewrite cheerful/generic copy to plain Mekari voice. **For copy explicitly chosen by the designer in Figma, flag rewrites in the output rather than silently change** — designer may have intended that copy.

7. **Validate with `pixel` and against the screenshot.** Load `pixel` for any uncertain prop or component API (use Pixel MCP `get-component` — never guess). Compare final output mentally against the Figma screenshot for layout/typography/color match.

8. **Hand off (see "Output structure" below).**

### Branch B: Input is a PRD (Confluence link, pasted text, chat description)

1. **Read the PRD.** Extract goal, user story, scope, functional requirements, acceptance criteria, copy already specified (labels, helper text, error messages, empty state copy), and explicit edge cases the PM has noted. If it's a Confluence link, fetch it. If pasted/described, use that.

2. **Detect product and confirm token mode.** Scan space name, page title, breadcrumb, repeated product mentions in body. Default Pixel 2.4 unless PRD or user mentions otherwise.

3. **Identify patterns and read references.** Same as Branch A step 3.

4. **Build the gap list.** PRDs commonly omit details that affect implementation. Walk through every pattern's "Edge cases the PRD probably forgot" section and list what the PRD did NOT cover. Specifically check for:

   - **Copy that will ship to users**: empty state copy, error messages, success toasts, helper text
   - **Edge case behavior**: null values, permission gating, max limits (selections, file size, row count)
   - **Default sort, default filter, default tab** on first load
   - **What triggers refresh** (manual, real-time, on-mount)
   - **Validation strategy** (on blur, on submit, on keystroke) per field type
   - **Loading and error states** for every async interaction
   - **Cancel/unsaved-changes behavior** for forms

   Use `mekari-taste` defaults for everything. **Do not stop and ask for each one.** Use defaults, document them prominently, let the team override during code iteration.

5. **Route through Pixel MCP prompt.** Call `/create-design-to-pixel`. Pass: PRD content (or your summary), patterns identified, gap fills applied, token mode 2.4.

6. **Reconcile against Mekari conventions.** Same as Branch A step 6.

7. **Validate with `pixel`.** Same as Branch A step 7, minus the screenshot comparison.

8. **Hand off (see "Output structure" below).**

### Output structure (both branches)

The goal is **easy iteration**. Structure output so the team can quickly refine specific sections without re-reading everything. Use this template at the top of the Vue file:

```vue
<!--
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Mekari [Product] — [Screen name]
  Source: [Figma fileKey/nodeId | PRD link or summary]
  Token mode: Pixel 2.4
  Patterns used: layout-shell, [pattern1], [pattern2], ...
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STATES FILLED IN (input did not show):
    - Empty state: illustrated, title "[…]", helper "[…]"
    - Loading: skeleton rows for table, spinner for buttons
    - Hover: subtle bg tint, cursor pointer
    - Error: form-level banner with retry, field-level inline for validation
    - Null values: em dash (—) in Color/Text/secondary

  COPY DEFAULTS (input did not specify — iterate these freely):
    - Submit verb: "Submit request"
    - Cancel label: "Cancel"
    - Empty state title: "[…]"
    - Empty state helper: "[…]"
    - Error banner: "Couldn't [action]. Please review the highlighted fields."

  CONVENTION OVERRIDES applied (input → Mekari):
    - Status pill: expanded from "Approved" to actor + timestamp + zone
    - [other overrides]

  OPEN ITEMS for product/design follow-up:
    - [Specific decisions outside scope of this generation]
-->
```

Then the component code, with these structural conventions:

- **One section per pattern.** Use `<!-- ═════ Layout shell ═════ -->`, `<!-- ═════ Page header ═════ -->`, `<!-- ═════ Filter toolbar ═════ -->` style dividers. Teams can target a section for iteration.
- **Sub-components for states.** Empty state, loading skeleton, error banner each as a separate small component if they exceed ~15 lines. Easier to swap.
- **Constants at the top of `<script setup>`.** Copy strings, helper text, field labels, status labels — extract as named constants so iteration is "change this constant" not "find the string in 3 places".
- **Token names inline, not hex.** When using Pixel CSS props or `css()`, use token names by reference. Inline comments explain non-obvious decisions.

This structure makes the deliverable feel less like "frozen handoff" and more like "starting point you refine".

## Anti-patterns (the things that break the Mekari feel)

Apply this scan before handing off. These come up repeatedly in design reviews:

- **Pure white page background.** Always use `Color/Background/surface` (`#F1F5F9`) for the page; reserve white for cards.
- **Shadows on flat cards.** Cards in the page flow do not lift. Only floating UI lifts.
- **Colored row backgrounds for status.** Use a status pill inside the row, not a tinted row.
- **Zebra striping in tables.** Rows separate with a 1px bottom border only.
- **Outer border on tables.** Borderless on the outside; the card provides the boundary.
- **Center-aligned numeric columns.** Numbers go right-aligned — always.
- **Status text without context.** Never just "Approved". Always "Approved by [Person], [Date Time Zone]".
- **Generic helper text.** "Upload file here" is wrong. State the formats and size limit.
- **Asterisk-only required indicator with no color.** Required asterisks are `Color/Background/danger-bold` red, on the label, not on the input border.
- **Cancel button styled equal to Submit.** Cancel is a text link or low-emphasis button.
- **Decorative illustration in working states.** Illustration is for empty states only.
- **Inventing copy in clever voice.** Mekari copy is plain, specific, accountable. No "Oops!", no "Let's get started!", no exclamation marks in errors.

## Copy voice

- Plain Indonesian or plain English, consistent within a product.
- Action labels are verbs in imperative ("Submit", "Add benefit", "Top up quota"), not "Click here to submit".
- Empty state title is descriptive ("Reimbursement benefit will appear here"), not motivational.
- Empty state helper points at the action: "Add benefit from **Add benefit** button" — bold the literal button name.
- Status timestamps include zone: `25 Jul 2023, 10:24 (GMT+7)`.
- Currency: `Rp` prefix, no space, dot thousand separator (`Rp150.000`). Secondary currency below in `Label small/Regular`.
- Errors describe what went wrong and what to do, plain language. No exclamation marks. No clever phrasing.

## QA checklist (apply before handoff)

- [ ] Page bg is `surface`, card bg is `stage` (white)?
- [ ] H1 is one per screen, status pill inline to right if entity has status?
- [ ] Primary CTA top-right of page header, not inside the card?
- [ ] Table rows: 1px bottom border, no zebra, no outer border, numerics right-aligned?
- [ ] Status field shows actor and timestamp, not just the state word?
- [ ] Required indicators are red asterisks on labels?
- [ ] Helper text on complex inputs is specific (formats, sizes, ranges)?
- [ ] Empty states have illustration + descriptive title + action-pointing helper?
- [ ] All non-happy-path states present (hover, loading, error, empty, null)?
- [ ] No shadows on cards in flow, no editorial serifs, no colored row backgrounds?
- [ ] Cancel is lower visual weight than primary submit?
- [ ] Copy is plain, specific, no exclamation marks, no clever voice?
- [ ] Tokens used are Pixel 2.4 semantic names, not raw hex?
- [ ] Header comment lists states filled, defaults applied, overrides made, and open items?
- [ ] Code is sectioned with comment dividers so teams can target sections for iteration?
