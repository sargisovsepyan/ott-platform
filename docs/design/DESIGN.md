# Lumio Design Specification

## 1. Purpose

Lumio is a responsive OTT streaming interface for discovering movies and managing the catalogue. The experience should feel like a quiet cinema lobby: black architecture, clear white typography, restrained steel-blue interaction cues, and poster artwork as the dominant visual material.

This specification is the implementation source of truth for a React, Vite, JavaScript, and Tailwind CSS v4 frontend. It covers the public catalogue, authentication, movie details, and administrator workflows supported by the project.

## 2. Design principles

1. **Content is the visual identity.** Posters carry color and personality. Interface chrome stays monochrome and recedes.
2. **Darkness creates focus.** Use pure black for the page and near-black surfaces for grouping. Do not brighten large interface regions.
3. **One restrained accent.** Steel blue identifies links, focus, selection, and primary actions. It is punctuation, not decoration.
4. **Flat, not weightless.** Separate layers with spacing, borders, and surface color. Do not use shadows, blur, glass effects, or decorative gradients.
5. **Editorial hierarchy.** Large, clean titles and generous vertical rhythm create a premium tone. Small labels may use moderate positive tracking.
6. **Motion is functional.** Movement should explain state changes or horizontal navigation. Avoid continuous or ornamental animation.
7. **Every state is designed.** Loading, empty, failed, unauthorized, disabled, and success states are first-class UI.
8. **Responsive by composition.** Mobile is not a compressed desktop. Controls stack, rows become touch-scrollable, and admin tables become cards.

## 3. Visual language

- Page canvas: pure black.
- Secondary surfaces: neutral near-black with no visible tint.
- Primary typography: white.
- Supporting typography: cool neutral gray.
- Accent: muted steel blue.
- Imagery: portrait movie posters and a single art-directed hero image or poster composition.
- Geometry: rectangular, compact radii, hairline borders.
- Density: generous between sections; efficient inside controls and admin views.
- Navigation: minimal labels, one clear active state, no oversized navigation chrome.
- Decorative treatment: none beyond content imagery. Never add abstract blobs, glowing orbs, textured noise, ornamental lines, or background illustrations.

## 4. Color system

### 4.1 Core palette

| Semantic token | Value | Usage |
|---|---:|---|
| `--color-background` | `#000000` | Body, page canvas, full-width hero base |
| `--color-surface` | `#080A0D` | Header after scroll, panels, cards that need separation |
| `--color-surface-raised` | `#11151A` | Menus, dialogs, selected admin rows |
| `--color-surface-hover` | `#181D23` | Neutral hover and pressed surfaces |
| `--color-primary` | `#4E7599` | Primary buttons, active navigation, selected filters |
| `--color-primary-hover` | `#6188AD` | Primary hover |
| `--color-primary-active` | `#3E6385` | Primary pressed state |
| `--color-primary-soft` | `#142231` | Subtle selected background |
| `--color-text` | `#FFFFFF` | Headings and primary content |
| `--color-text-muted` | `#A9B0B8` | Body copy, metadata, helper text |
| `--color-text-subtle` | `#747D87` | Placeholders, inactive metadata |
| `--color-border` | `#282E35` | Hairline borders and dividers |
| `--color-border-strong` | `#424A54` | Input hover and emphasized dividers |
| `--color-focus` | `#8CB5DA` | Keyboard focus ring |
| `--color-overlay` | `rgba(0, 0, 0, 0.72)` | Dialog backdrop and flat image scrim |
| `--color-success` | `#4C9A75` | Success messages only |
| `--color-warning` | `#C0964C` | Warning messages only |
| `--color-danger` | `#C05D65` | Destructive actions and errors only |

Status colors must occupy small areas. They do not become section backgrounds or decorative accents. Text on colored buttons must meet WCAG AA contrast.

### 4.2 Semantic CSS variables

```css
:root {
  color-scheme: dark;

  --color-background: #000000;
  --color-surface: #080a0d;
  --color-surface-raised: #11151a;
  --color-surface-hover: #181d23;
  --color-primary: #4e7599;
  --color-primary-hover: #6188ad;
  --color-primary-active: #3e6385;
  --color-primary-soft: #142231;
  --color-text: #ffffff;
  --color-text-muted: #a9b0b8;
  --color-text-subtle: #747d87;
  --color-border: #282e35;
  --color-border-strong: #424a54;
  --color-focus: #8cb5da;
  --color-overlay: rgb(0 0 0 / 72%);
  --color-success: #4c9a75;
  --color-warning: #c0964c;
  --color-danger: #c05d65;
}
```

## 5. Typography

Use Inter when available, followed by system fonts. Do not require a licensed or proprietary typeface.

```css
--font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

| Role | Mobile | Desktop | Line height | Weight | Tracking |
|---|---:|---:|---:|---:|---:|
| Display | 40px | 64px | 1.0 | 600 | `-0.025em` |
| Page title | 32px | 48px | 1.05 | 600 | `-0.02em` |
| Section title | 24px | 32px | 1.15 | 600 | `-0.015em` |
| Card title | 16px | 18px | 1.3 | 600 | normal |
| Body large | 17px | 18px | 1.55 | 400 | normal |
| Body | 15px | 16px | 1.55 | 400 | normal |
| Small | 13px | 14px | 1.45 | 400 | normal |
| Label | 12px | 12px | 1.4 | 600 | `0.06em` |

Rules:

- Use weights 400, 500, 600, and 700 only.
- Use uppercase sparingly for short labels and badges, never paragraphs.
- Keep body text at least 15px on mobile.
- Limit readable prose to 65–75 characters per line.
- Truncate card titles to two lines; never reduce their font size to force a fit.
- Use tabular numerals for ratings, years, and pagination where supported.

## 6. Spacing and sizing

Use a 4px base unit.

| Token | Value | Typical use |
|---|---:|---|
| `--space-1` | 4px | Icon-to-label micro gap |
| `--space-2` | 8px | Tight component gap |
| `--space-3` | 12px | Control internals |
| `--space-4` | 16px | Default element gap |
| `--space-5` | 20px | Card padding on mobile |
| `--space-6` | 24px | Card padding and grid gap |
| `--space-8` | 32px | Subsection gap |
| `--space-10` | 40px | Mobile section rhythm |
| `--space-12` | 48px | Tablet section rhythm |
| `--space-16` | 64px | Desktop section rhythm |
| `--space-20` | 80px | Major desktop separation |
| `--space-24` | 96px | Hero-to-content separation |

Interactive controls must be at least 44px high. Standard inputs and buttons are 48px high; compact admin controls may be 40px on desktop only.

## 7. Border radii and borders

```css
--radius-xs: 3px;
--radius-sm: 5px;
--radius-md: 8px;
--radius-full: 999px;
--border-width: 1px;
```

- Poster cards and thumbnails: `5px`.
- Inputs, selects, textareas, buttons, alerts, and dialogs: `8px`.
- Badges: `3px`, or full radius only for compact status pills.
- Do not use radii above 8px for panels or cards.
- Use a 1px border. Do not simulate depth with box shadows.

## 8. Layout widths and breakpoints

```css
--layout-max: 1440px;
--content-max: 1280px;
--reading-max: 720px;
--gutter-mobile: 16px;
--gutter-tablet: 24px;
--gutter-desktop: 40px;
```

Tailwind breakpoints:

| Name | Minimum width | Design mode |
|---|---:|---|
| Base | 0 | Mobile |
| `sm` | 640px | Large mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop |

Full-bleed hero and horizontal rows may extend to viewport edges. Their headings and controls align to the content container. Standard pages use `min(100% - 2 * gutter, 1280px)`.

## 9. Responsive rules

### Mobile: below 768px

- Use a single content column.
- Header height: 60px.
- Hide desktop navigation and show a menu button.
- Hero height: 72–82svh, minimum 520px.
- Hero copy uses the lower portion of the image with a flat black scrim if needed.
- Horizontal rows use touch scrolling and CSS scroll snap; hide arrow buttons.
- Catalogue grid uses two columns with 12px gaps.
- Filters open in a full-width sheet or stack below search.
- Admin tables become stacked cards.
- Dialogs use `calc(100vw - 32px)` and may become bottom-aligned when content is short.

### Tablet: 768–1023px

- Header height: 68px.
- Show primary navigation if it fits; move user/admin actions into a compact menu.
- Hero height: 68–76svh.
- Horizontal rows show approximately 3.5–4.5 posters.
- Catalogue grid uses three or four columns.
- Filters wrap onto two lines.
- Forms use one column, except short paired numeric fields.

### Desktop: 1024px and above

- Header height: 72px.
- Show full navigation and account controls.
- Hero height: min(82vh, 860px), minimum 620px.
- Horizontal rows show 5–7 posters depending on viewport.
- Catalogue grid uses four columns at `lg`, five at `xl`, and six at `2xl`.
- Admin uses a table with fixed action column.
- Forms may use two columns while descriptions and upload fields span both.

## 10. Header and mobile navigation

### Header

- Position over the hero on the home page; use pure black elsewhere.
- Before scroll: transparent only when the hero image provides adequate contrast.
- After scroll: `--color-background` or `--color-surface`, separated by a 1px border.
- Do not add blur.
- Left: text wordmark “Lumio”.
- Center/left navigation: Home and Movies. Add Admin only for administrators.
- Right: search affordance when useful, then Login/Register or the signed-in user menu.
- Active navigation uses white text plus a 2px steel-blue underline.
- Wordmark is text, not a copied logo treatment.

### Mobile menu

- Menu button has a visible label for assistive technology.
- Open a solid black panel below the header or a full-height side panel.
- Links are at least 48px high with clear separators.
- Close on Escape, outside interaction, and successful navigation.
- Lock background scrolling and return focus to the trigger on close.
- Do not use a blurred or translucent glass panel.

## 11. Hero section

The home hero is full width and poster-driven.

- Use either of the following as the visual anchor:
  - one cinematic backdrop;
  - a curated poster composition.
- Both options must preserve the same premium dark aesthetic and keep content imagery dominant.
- Place copy within the content container, aligned left on desktop and near the bottom on mobile.
- Include eyebrow, title, short description, metadata, and one primary action.
- Optional secondary action uses the outline button.
- Limit description to roughly 140 characters and two or three lines.
- Use a flat `rgba(0, 0, 0, 0.55–0.72)` scrim only when required for contrast. Do not use a gradient.
- If no suitable hero image exists, use a pure-black hero with an offset poster composition; never invent unsupported backdrop data.
- Do not autoplay video or audio.
- Do not imply playback when the product has no playback capability. The main action should be “View details”.

## 12. Movie cards

- Poster aspect ratio: `2 / 3`.
- Poster images must never stretch.
- Always preserve the original aspect ratio.
- Always use `object-fit: cover`; crop within the defined poster frame instead of distorting the image.
- Card background remains black; metadata appears below the image.
- Title: one or two lines.
- Secondary row: year, genre, and rating in muted text.
- Rating may use a small neutral badge; do not use large stars or bright gold.
- Use no shadow and no decorative overlay.
- Default card radius: 5px on image, zero or 5px on the outer interactive area.
- Broken or absent imagery uses a near-black placeholder with movie title and a simple film-frame icon.

Interaction:

- Hover: image or card translates upward by at most 2px; border becomes `--color-border-strong`.
- Focus: 2px `--color-focus` ring with 2px offset.
- Active: remove translation and use the stronger border.
- Motion duration: 140–180ms.
- Never scale cards enough to overlap adjacent content.

## 13. Horizontal content rows

- Row heading and optional “View all” action align above the scroller.
- Cards use fixed responsive widths rather than an equal grid:
  - mobile: 42–46vw;
  - tablet: 180–210px;
  - desktop: 200–230px.
- Use `overflow-x: auto`, `scroll-snap-type: x proximity`, and hidden decorative scrollbars while preserving scrolling.
- Desktop arrow controls sit beside the heading or at row edges and scroll one viewport group.
- Disable arrows at boundaries.
- Preserve 16px mobile, 20px tablet, and 24px desktop gaps.
- Do not add edge fades or gradient masks.
- Rows must remain usable by keyboard and touch.

## 14. Movie catalogue grid

- Place page title, result count, search, and filters above the grid.
- Use the responsive columns defined in Section 9.
- Default vertical gap: 28px mobile, 36px desktop.
- Pagination appears after the grid and never floats over content.
- Preserve filter and page state in URL query parameters.
- When filters change, return to page 1.
- If a page becomes invalid after deletion, move to the last valid page.
- Avoid masonry; poster ratios and metadata alignment must remain predictable.

## 15. Search and filters

- Search is the dominant control, with a visible label or accessible name.
- Search input includes a leading search icon and a clear button when populated.
- Debounced search feedback must not shift layout.
- Filters: year, genre, sort, and items per page when needed.
- Mobile filters open from a “Filters” button showing the active-filter count.
- Desktop filters appear in a single toolbar and may wrap at tablet width.
- Selected filters use `--color-primary-soft`, a steel-blue border, and white text.
- Provide a “Clear filters” action only when at least one non-default filter is active.
- Do not populate genre choices from an incomplete current page. Use a text input unless a reliable list is available.

## 16. Movie details page

- Desktop: poster column at 28–34% width and details column at 66–72%.
- Mobile: poster above content, maximum poster width 320px, left aligned or centered consistently.
- Display title, year, genre, rating, and description.
- Keep metadata compact and separated by dots or small gaps.
- Administrator edit action appears beside the title on desktop and below metadata on mobile.
- Missing description uses neutral copy such as “No description available.”
- Do not show unsupported cast, duration, trailers, episodes, favorites, reviews, or playback controls.
- Error and not-found states retain the application header and provide a route back to the catalogue.

## 17. Login and registration

- Use a centered form column with maximum width 440px.
- Background remains black. An optional poster strip may occupy the other half on wide screens, but must disappear below `lg`.
- Form surface may be `--color-surface`; no image blur, translucent panel, or shadow.
- Wordmark, concise title, form, submit action, and cross-link are sufficient.
- Inputs are full width.
- Password fields include a text-based show/hide control with an accessible name.
- Validation appears under the relevant field; request-level errors appear above the submit button.
- Keep entered non-password values after a failed request.
- Registration success clearly directs the user to login.

## 18. Admin dashboard

- Separate the administrator area through heading, navigation context, and denser layout—not a different visual brand.
- Header row: “Movie management”, result count, and primary “Add movie” action.
- Desktop table columns: poster thumbnail, title, year, genre, rating, updated date, actions.
- Use 48×72px poster thumbnails.
- Row actions: Edit as neutral; Delete as danger. Put secondary actions in a compact menu when space is limited.
- Mobile cards show poster, core metadata, and full-width actions.
- Empty state offers the add action.
- Loading uses table-row or card skeletons matching final dimensions.

## 19. Movie creation and editing forms

- Use the same reusable metadata form for create and edit.
- Fields: title, year, genre, rating, description.
- Desktop uses two columns:
  - title spans both;
  - year and rating share a row;
  - genre spans both or one column according to available space;
  - description spans both.
- Mobile uses one column.
- Required markers are textual and explained once.
- Show character count near title and description limits.
- Numeric fields keep native numeric semantics and readable validation.
- Primary submit and secondary cancel actions sit at the bottom; on mobile they may stack.
- Disable submit during requests, keep values on error, and show a visible success result.
- Editing metadata and replacing a poster remain separate actions because they use separate API operations.

## 20. Poster upload interface

- Use a bordered upload region with solid near-black background.
- Accept JPG/JPEG, PNG, and WebP.
- Provide file picker and optional drag-and-drop enhancement.
- Show accepted formats and the approved client size limit before selection.
- After selection, display a 2:3 preview, file name, size, Replace, and Remove.
- The create form requires a poster before submission.
- The edit page shows current and proposed posters side by side on desktop and stacked on mobile.
- Upload progress is optional unless reliable progress data is available.
- File-type and size errors appear beside the upload control.
- Do not use a decorative cloud illustration or animated upload effect.

## 21. Component specifications

### Buttons

- Standard height: 48px; compact desktop height: 40px.
- Horizontal padding: 16–20px.
- Radius: 8px.
- Label weight: 600.
- Icon-only buttons require an accessible name and a 44×44px target.

#### Standard variants

- **Primary:** steel-blue background with white text.
- **Secondary:** transparent background with white text and a strong border.
- **Ghost:** transparent background without a border, muted text by default, and white text on hover.
- **Danger:** transparent or danger-filled treatment used only inside confirmed destructive contexts.
- **Link:** transparent background without a border, steel-blue text, and an underline on hover or keyboard focus.

### Icon system

- Use Lucide React as the only icon library.
- Keep icons minimal and functional.
- Do not mix icon libraries.
- Use outlined icons by default.
- Icons that perform actions must follow the accessible-name and target-size requirements defined for icon-only buttons.

### Inputs, selects, and textareas

- Background: `--color-surface`.
- Border: 1px `--color-border`.
- Text: white; placeholder: `--color-text-subtle`.
- Standard height: 48px; textarea minimum height: 128px.
- Padding: 12px 14px.
- Hover border: `--color-border-strong`.
- Focus border and ring: `--color-focus`.
- Error border: `--color-danger`; do not rely on color alone.
- Disabled: reduced contrast, `not-allowed` cursor, no opacity below 55%.
- Native select arrow may be retained if contrast is correct.

### Badges

- Height: 22–26px.
- Padding: 4px 8px.
- Label size: 12px, weight 600.
- Neutral badges use surface and border.
- Status badges use status color sparingly with an accessible text label.

### Dialogs

- Backdrop: `--color-overlay`.
- Surface: `--color-surface-raised`.
- Width: up to 520px for confirmation, up to 720px for complex content.
- Border: 1px solid `--color-border`.
- Radius: 8px.
- No shadow or blur.
- Include title, concise body, explicit actions, focus trap, Escape behavior, and focus restoration.
- Destructive confirmation names the affected movie.

### Alerts

- Use a 4px status border on the left, near-black surface, icon, title, and optional detail.
- Radius: 5px.
- Never use a fully saturated large background.
- Error detail lists may show backend validation messages.
- Dismiss controls are optional and must be keyboard accessible.

## 22. System states

### Loading

- Use inline spinners for button submissions.
- Use structural skeletons for pages, rows, grids, and details.
- Delay a full-page spinner briefly to avoid flashing on fast requests.
- Preserve page geometry while loading.

### Skeleton

- Base: `--color-surface`.
- Moving highlight is optional and must be a subtle solid-opacity animation, not a gradient. A simple pulse is preferred.
- Respect reduced-motion preferences by disabling animation.

### Empty

- Use a concise heading, one sentence, and one relevant action.
- Catalogue empty state offers “Clear filters” when filters are active.
- Admin empty state offers “Add movie”.
- Do not use large decorative illustrations.

### Error

- Explain what failed in plain language.
- Provide Retry when the action is safe.
- Preserve entered form data.
- Show technical server text only when it is suitable for users; otherwise use a safe fallback.

### Unauthorized and forbidden

- Logged-out users are directed to login and can return to the intended route.
- Signed-in non-administrators see a 403 page with a catalogue link.
- Expired sessions show a short explanation before login.
- Do not expose or imply restricted data.

### Success

- Use a compact success alert or persistent page message.
- Announce via `aria-live="polite"`.
- Do not rely on a transient message for the only confirmation of a destructive operation.

## 23. Interaction states

Every interactive component must define:

- **Default:** normal surface, text, and border.
- **Hover:** modest color or border change; never required to understand the control.
- **Focus-visible:** 2px focus ring with at least 2px separation from the component.
- **Active:** stronger surface and no hover translation.
- **Selected/current:** steel-blue indicator plus a non-color cue such as underline, checkmark, or `aria-current`.
- **Disabled:** visibly muted, non-interactive, and semantically disabled.
- **Loading:** label retained where space permits, spinner added, repeat action blocked.
- **Error:** text explanation associated with the control.

- Easing: `ease-out`.
- Color and border transitions: `140ms`.
- Transform transitions: `180ms`.

Never animate layout height for essential content unless focus and reduced-motion behavior are verified.

## 24. Accessibility

- Meet WCAG 2.2 AA for contrast, keyboard access, focus visibility, and target sizes.
- Use semantic landmarks: header, nav, main, section, footer.
- Maintain one page-level `h1` and a logical heading order.
- Associate every field with a visible label.
- Use `aria-describedby` for helper and error text.
- Use buttons for actions and links for navigation.
- All functionality must work without a pointer.
- Maintain a visible focus ring on dark and image backgrounds.
- Supply meaningful poster alt text, such as “Poster for {title}”; mark decorative imagery with empty alt text.
- Use live regions for request results without repeatedly announcing skeleton updates.
- Trap focus in dialogs and menus; restore it on close.
- Support browser zoom to 200% without loss of content.
- Respect `prefers-reduced-motion`.
- Do not communicate rating, status, validation, or selection by color alone.
- Ensure horizontal rows remain reachable and operable by keyboard.

## 25. Tailwind CSS v4 implementation

Use the Vite plugin and CSS-first configuration. The application stylesheet should begin with:

```css
@import "tailwindcss";

@theme {
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  --color-background: #000000;
  --color-surface: #080a0d;
  --color-surface-raised: #11151a;
  --color-surface-hover: #181d23;
  --color-primary: #4e7599;
  --color-primary-hover: #6188ad;
  --color-primary-active: #3e6385;
  --color-primary-soft: #142231;
  --color-text: #ffffff;
  --color-text-muted: #a9b0b8;
  --color-text-subtle: #747d87;
  --color-border: #282e35;
  --color-border-strong: #424a54;
  --color-focus: #8cb5da;
  --color-success: #4c9a75;
  --color-warning: #c0964c;
  --color-danger: #c05d65;

  --radius-xs: 3px;
  --radius-sm: 5px;
  --radius-md: 8px;

  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;
}
```

Implementation rules:

- Prefer semantic utilities such as `bg-background`, `bg-surface`, `text-text`, `text-text-muted`, `border-border`, and `bg-primary`.
- Store reusable component variants in React component mappings, not dynamically constructed class fragments that Tailwind cannot detect.
- Use a small global base layer for body, focus defaults, selection, and reduced motion.
- Do not introduce a JavaScript Tailwind configuration unless a requirement cannot be represented in CSS.
- Do not use arbitrary color values in components when a semantic token exists.
- Do not add a component framework solely to reproduce these primitives.
- Keep content-specific poster colors out of the token system.

## 26. Anti-patterns and restrictions

Do not:

- use any copied logo, artwork, wordmark treatment, page composition, or proprietary font;
- make the accent bright, neon, or dominant;
- add decorative gradients, edge fades, or gradient text;
- add drop shadows, inner shadows, glow, backdrop blur, glass panels, or frosted navigation;
- place text over imagery without verified contrast;
- use oversized pill-shaped cards or controls everywhere;
- use radii above 8px on cards and panels;
- animate cards so they overlap adjacent content;
- autoplay video, audio, or carousels;
- hide essential controls until hover;
- create a different visual system for administrator pages;
- use a carousel where a simple grid communicates the content better;
- invent content fields or actions not supported by the application;
- use placeholder artwork that could be mistaken for licensed content;
- hardcode incomplete genre options as if they were authoritative;
- use gray text below accessible contrast for essential information;
- use icons without labels when their meaning is not universal;
- put destructive actions next to primary actions without spacing and confirmation;
- replace page-level navigation with a complex mega-menu;
- add visual decoration merely to fill empty space.

## 27. Definition of design completion

A Lumio screen is complete when:

1. It uses only documented semantic tokens.
2. It has defined mobile, tablet, and desktop behavior.
3. Loading, empty, error, success, and permission states are present where relevant.
4. Keyboard, focus, labels, contrast, and reduced motion have been checked.
5. Poster imagery remains the dominant visual element.
6. The interface remains flat, black, spacious, and restrained.
7. No unsupported product capability is implied.
8. The page is recognizable as Lumio through consistent typography, geometry, spacing, and steel-blue interaction cues rather than borrowed brand elements.
