# Love Directory - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Eros.com and premium adult classifieds platforms with a focus on sophisticated, discreet visual language. The design prioritizes image-first presentation with professional, neutral aesthetics that respect user privacy while maximizing content discovery.

**Core Principles**:
- Image-dominant, grid-first layouts (never single-column lists)
- Dark-first theme with high contrast for readability
- Discreet, professional adult visual language
- Minimal distractions, content-focused experience
- Privacy-conscious UI patterns

---

## Color Palette

**Dark Mode (Primary)**:
- Background: 15 8% 8% (deep charcoal)
- Surface: 15 6% 12% (elevated cards)
- Surface Elevated: 15 5% 16% (modals, overlays)
- Border: 15 10% 22% (subtle dividers)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%

**Accent Colors**:
- Primary: 340 75% 55% (deep rose - for CTAs, badges)
- Highlight: 45 95% 60% (amber - for "Available Now", highlights)
- VIP: 280 65% 65% (purple - VIP tier badge)
- Elite: 30 80% 55% (gold - Elite tier badge)
- Success: 140 50% 50% (verified badges)

**Semantic Colors**:
- Warning: 25 95% 55%
- Error: 0 75% 55%
- Info: 210 75% 60%

---

## Typography

**Fonts**: Bunny Fonts (fonts.bunny.net)
- Primary: Inter (clean, modern sans-serif)
- Display: DM Sans (headings, hero elements)

**Type Scale**:
- Hero: 3.5rem / 4rem (56px/64px) - bold
- H1: 2.5rem / 3rem - semibold
- H2: 2rem / 2.5rem - semibold
- H3: 1.5rem / 2rem - medium
- Body: 1rem / 1.5rem - regular
- Small: 0.875rem / 1.25rem - regular
- Tiny (labels): 0.75rem / 1rem - medium

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24**
- Card padding: p-4 to p-6
- Section spacing: py-12 to py-24
- Grid gaps: gap-4 to gap-6

**Grid Layouts (Critical Constraint)**:
- Desktop: `grid-cols-4` to `grid-cols-5` (4-5 cards/row)
- Tablet: `md:grid-cols-3` (3 cards/row)
- Mobile: `grid-cols-2` to `grid-cols-3` (2-3 cards/row)
- **Never** single column for listing grids

**Container Widths**:
- Max content: `max-w-7xl` (1280px)
- Listing grids: Full width with inner padding

---

## Component Library

### Navigation
- Sticky top nav with transparent-to-solid background on scroll
- Logo left, main nav center, user/coins balance right
- Mobile: hamburger menu with slide-out drawer
- Category mega-menu on hover (desktop) with grid layout

### Listing Cards (Image-First)
- Aspect ratio: 3:4 portrait for thumbnails
- Large image with dark gradient overlay at bottom
- Minimal text overlay: title (1-2 lines), city, price
- Corner ribbons: "Available Now" (amber), "VIP" (purple), "Elite" (gold), "Verified" (green checkmark)
- Hover state: slight scale (1.02), brightness increase, quick preview button
- Smooth image lazy loading with blur placeholder

### Upgrade Badges & Tags
- Small, pill-shaped badges (px-2 py-1)
- Semi-transparent backgrounds with border
- Corner positioned (top-left or top-right)
- Never obstruct main image content

### Buttons
- Primary: Rose gradient with hover brightness
- Secondary: Outlined with border-2
- Ghost: Text-only with hover background
- Sizes: sm (py-2 px-4), md (py-3 px-6), lg (py-4 px-8)

### Forms
- Dark input backgrounds (surface elevated color)
- High contrast borders on focus
- Labels above inputs (text-sm, text-secondary)
- Error states with red border and helper text
- File uploads: drag-drop zone with image previews grid

### Modals & Overlays
- Backdrop blur with dark overlay (bg-black/80)
- Surface elevated background for modal content
- Close button top-right (subtle, icon-only)
- Smooth slide-up animation

### Dashboard & Admin
- Sidebar navigation (left, collapsible on mobile)
- Stats cards with icons and large numbers
- Data tables with alternating row backgrounds
- Action buttons grouped right-aligned

---

## Page-Specific Layouts

### Homepage
- Hero: Large search bar over dark gradient, featured categories grid (3-4 cols)
- "Available Now" section: Horizontal scrolling carousel (6-8 cards visible)
- Featured listings: 4-5 column grid
- Category sections: Tabbed interface with grids per category
- No single-column layouts anywhere

### Category Pages
- Breadcrumb navigation
- Filter sidebar (left, collapsible)
- Main content: 4-5 column listing grid
- Pagination at bottom
- Banner slots (top/bottom) for advertisers

### Listing Detail
- Image gallery: Large main image with thumbnail strip below
- Right sidebar: Price, tier badge, verified badge, contact/message buttons
- Description section with formatting
- Related listings carousel: 4-6 cards horizontal scroll

### User Dashboard
- Top stats row: Token balance, active listings, tier info
- Tabbed interface: My Listings, Purchases, Settings
- Listing management: Grid view with edit/delete actions
- Token purchase flow: Amount selector, Bitcoin QR code, status tracker

---

## Animations

**Minimal Approach**:
- Card hover: transform scale(1.02), 200ms ease
- Image lazy load: blur-to-sharp fade, 300ms
- Modal open: slide-up from bottom, 250ms
- Page transitions: Simple fade, 150ms
- **No** auto-playing carousels or distracting motion

---

## Images Strategy

**Hero Section**: 
- Large background image (dark overlay) with models in professional poses
- Alternative: Abstract dark patterns or cityscapes for neutral feel

**Listing Images**:
- Professional photography preferred
- EXIF stripped, responsive sizes (400w, 800w, 1200w)
- Lazy loaded with blur placeholder

**Category Icons**:
- Use Heroicons (via CDN)
- Outlined style for consistency
- 24x24 or 32x32 sizes

**Empty States**:
- Illustration or icon + helpful text
- Encourage action (e.g., "Create your first listing")

---

## Accessibility & Privacy

- High contrast dark mode (WCAG AA minimum)
- Keyboard navigation for all interactive elements
- ARIA labels for icon buttons and images
- Focus visible states with 2px rose outline
- Cookie consent banner: tarteaucitron.js integration, minimal, bottom-positioned
- Discreet browsing: No explicit text in page titles/tabs when possible

---

## Trust & Safety UI

- Report button: Subtle flag icon, opens modal with reason dropdown
- Verification badge: Small green checkmark shield
- Moderation labels: Transparent yellow badge for "Under Review"
- GDPR controls: Clear links in footer and user settings

---

## Responsive Behavior

- Mobile-first approach
- Grid columns adapt fluidly: 2 → 3 → 4 → 5 as viewport grows
- Navigation collapses to hamburger < 768px
- Filter sidebar becomes bottom sheet on mobile
- Touch-friendly tap targets (min 44x44px)