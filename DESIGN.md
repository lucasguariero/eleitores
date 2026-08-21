<!-- Extraído do design system "Intelligence Protocol" do projeto Stitch
     https://stitch.withgoogle.com/projects/1034378190447547880
     Fonte da verdade para tokens. Não editar à mão: reexportar do Stitch. -->

---
name: Intelligence Protocol
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#23005c'
  on-tertiary-container: '#9466ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  topbar-height: 64px
  gutter: 24px
  margin-page: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for a premium political and territorial intelligence platform. It prioritizes clarity, data density, and an authoritative yet modern aesthetic. The brand personality is analytical, strategic, and sophisticated, designed to instill confidence in decision-makers handling complex geographical and social data.

The UI style follows a **Corporate / Modern** approach with a focus on high-performance utility. It utilizes a layered surface architecture where information hierarchy is established through subtle tonal shifts and precise geometry rather than heavy ornamentation. The visual language conveys reliability and technical precision, ensuring that the interface never competes with the data it presents.

## Colors

This design system uses a sophisticated palette rooted in deep professional tones. 

- **Primary (Deep Navy):** Reserved for core navigational structures like sidebars and headers to provide a strong visual anchor.
- **Surface (Light Gray):** The primary background color to minimize eye strain during long analytical sessions.
- **Accents (Cyan, Violet, Emerald, Coral):** These represent specific data categories or status indicators. 
  - **Cyan** is the primary action color.
  - **Violet** is used for secondary intelligence metrics.
  - **Emerald** denotes positive growth or territory acquisition.
  - **Coral** highlights priority alerts or competitive threats.

All backgrounds use high-legibility contrast ratios to ensure data accessibility.

## Typography

The system utilizes **Inter** across all levels to maintain a systematic, utilitarian, and clean appearance. 

- **Headlines:** Use tighter letter-spacing and Semi-Bold/Bold weights to create a strong hierarchy in data dashboards.
- **Labels:** Use a slightly increased letter-spacing and uppercase styling for "Meta Data" or "Section Headers" to differentiate them from body content.
- **Data Tables:** Should use `body-sm` for maximum information density without sacrificing legibility.
- **Scale:** On mobile devices, large headlines automatically downscale to ensure they fit within portrait-oriented data cards.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a fixed sidebar for navigation. 

- **Sidebar:** Positioned on the left, fixed at 280px. It contains primary navigation icons and branding.
- **Main Canvas:** A fluid area that adjusts based on screen width, utilizing a 12-column grid for desktop views.
- **Guttering:** A consistent 24px gutter is maintained between all data cards and modules to ensure visual breathing room amidst complex data.
- **Breakpoints:**
  - **Desktop (1440px+):** Full 12-column visibility with sidebar expanded.
  - **Tablet (768px - 1439px):** Sidebar collapses to icon-only view; grid transitions to 8 columns.
  - **Mobile (<767px):** Sidebar moves to a hidden drawer; 4-column layout; margins reduced to 16px.

## Elevation & Depth

The system uses a **Tonal Layering** approach combined with **Ambient Shadows**.

1. **Level 0 (Background):** Solid `#F8FAFC`. No shadow.
2. **Level 1 (Cards/Sheets):** Solid white `#FFFFFF` with a 1px border of `#E2E8F0`. Shadow: `0 1px 3px rgba(15, 23, 42, 0.08)`.
3. **Level 2 (Popovers/Dropdowns):** Solid white. Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.12)`.
4. **Interactive Elements:** Buttons and interactive cards use a 180ms ease-in-out transition. On hover, elevation should slightly increase (larger shadow) to provide tactile feedback.

Avoid heavy blurs; maintain a "crisp" feeling through light borders that define the structure.

## Shapes

The shape language is **Rounded**, strike a balance between friendly and professional.

- **Standard Elements (Buttons, Inputs, Small Cards):** Use a 0.5rem (8px) radius.
- **Large Containers (Charts, Section Panels):** Use a 1rem (16px) radius to soften the high-density layout.
- **Interaction Feedback:** Hover states on list items or navigation links should use a 0.25rem (4px) radius for sharp precision.
- **Icons:** Should follow a 2px stroke weight with slight rounding to match the UI elements.

## Components

### Navigation & Search
- **Sidebar:** Deep Navy background. Active states use a Cyan vertical indicator on the left edge and a subtle white opacity background for the icon.
- **Topbar:** Transparent or White background with a 1px bottom border. Contains a global search bar with an inset search icon and a `Cmd+K` keyboard shortcut label.

### Data & Intelligence
- **Data Cards:** White background, 8px corners, subtle shadow. Include a "Header" area with a title and an optional "More" menu.
- **Insights Card:** Distinctive styling featuring a Violet or Cyan left-border (4px) to denote it as an AI-generated or priority metric. Use a slight gradient background (White to 2% Violet) to draw the eye.
- **Charts:** Use the accent palette (Cyan, Violet, Emerald, Coral). Grid lines should be light gray (`#F1F5F9`) and labels in `label-sm`.

### Controls
- **Buttons:** Primary buttons use Cyan with white text. Secondary buttons use a white background with a light gray border.
- **Input Fields:** 8px rounded corners. On focus, the border shifts to Cyan with a 2px outer glow (ring).
- **Chips/Status:** Small capsules with 100px radius. Use low-saturation background versions of the accent colors with high-saturation text for readability (e.g., Light Emerald background with Dark Emerald text).

### Transitions
- All interactive states (hover, focus, active) must utilize a **180ms ease-in-out** transition to feel responsive and premium.