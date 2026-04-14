# Design System Strategy: The Fluid Academic

## 1. Overview & Creative North Star
The "Smart Attendance Tracker" transcends the utility of a spreadsheet to become **"The Fluid Academic."** This creative North Star moves away from the rigid, institutional aesthetics of traditional school software and toward a high-end, editorial dashboard experience.

We achieve this through **Organic Structure**. Instead of a grid of boxes, the UI feels like a series of curated, floating "intelligence layers." By leveraging intentional asymmetry—placing a large `display-sm` greeting offset against a compact `surface-container` stat card—we create a rhythm that feels human and modern. This system prioritizes breathing room, utilizing whitespace as a functional tool to reduce student cognitive load.

---

## 2. Colors & Surface Architecture
The palette is built on a sophisticated interplay of deep indigos and vibrant amethysts, optimized for high-contrast legibility and "modern web" depth.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited.** We define boundaries through tonal transitions. Use `surface-container-low` for large section backgrounds and `surface-container-highest` for interactive elements within them. This creates a "molded" look rather than a "drawn" one.

### Surface Hierarchy & Nesting
Treat the dashboard as a physical stack of semi-transparent materials:
*   **Base Layer:** `surface` (#faf4ff) – The canvas.
*   **Section Layer:** `surface-container-low` (#f4eeff) – Groups related content.
*   **Action Layer:** `surface-container-lowest` (#ffffff) – Reserved for the highest priority cards (e.g., "Current Class").

### The "Glass & Gradient" Rule
To inject "soul" into the UI, main CTAs and Hero sections must utilize the **Signature Texture**: A linear gradient from `primary` (#4647d3) to `primary-container` (#9396ff) at a 135° angle. Floating navigation or modal overlays should use `surface-variant` at 60% opacity with a `24px` backdrop-blur to create a premium glassmorphism effect.

---

## 3. Typography: Editorial Clarity
We pair **Plus Jakarta Sans** (Display/Headlines) with **Inter** (Body/Labels) to balance personality with extreme readability.

*   **The Power Scale:** Use `display-md` for "Hero Stats" (e.g., "98% Attendance") to make data feel like an achievement.
*   **The Narrative Lead:** Headlines (`headline-sm`) should be treated as editorial headers, using `on-surface` (#302950) to command attention.
*   **Functional Body:** All utility text uses `body-md` in `on-surface-variant` (#5e5680) to ensure the eye settles on the most important data points first.

---

## 4. Elevation & Depth
Hierarchy is achieved through **Tonal Layering** and ambient light, not heavy structural shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container` background. This `12-step` color shift provides enough contrast for the eye to perceive depth without visual clutter.
*   **Ambient Shadows:** For "Active" states or floating modals, use a shadow with a `48px` blur and `6%` opacity, tinted with `on-surface`. This mimics natural light dispersion.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., high-contrast mode), use `outline-variant` (#b0a7d6) at **15% opacity**. Never use a solid, 100% opaque stroke.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `full` roundedness, `title-sm` typography. 
*   **Secondary:** `surface-container-highest` fill with `on-primary-container` text. No border.
*   **State:** On hover, increase the gradient saturation; on press, scale the component to 98%.

### Modern Input Fields
*   **Default:** Use `surface-container-high` as the background. Roundedness `md` (1.5rem).
*   **Interaction:** On focus, the background shifts to `surface-container-lowest` and an `outline` (#79719d) appears at 20% opacity.

### Attendance Chips
*   **Present:** `primary-container` background with `on-primary-container` text.
*   **Absent:** `error-container` background with `on-error-container` text.
*   **Late:** `secondary-container` background with `on-secondary-container` text.

### Cards & Data Lists
*   **The "No-Divider" Rule:** Forbid the use of horizontal lines. Separate list items using `12px` of vertical margin and a subtle toggle of background colors (even/odd) using `surface` and `surface-container-low`.
*   **Attendance Progress Bar:** A thick (`12px`), `full` rounded track using `surface-container-highest` with a `primary` gradient fill indicating progress.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use `xl` (3rem) rounded corners for main dashboard containers to emphasize the "Soft Minimalism" feel.
*   **DO** use `display-lg` for empty state numbers to turn "zero data" into a design statement.
*   **DO** ensure that in Dark Mode, the `surface` color remains deep and desaturated to let the `primary` vibrant accents "glow."

### Don't:
*   **DON'T** use pure black (#000000) for text or shadows. Always use the `on-surface` palette for a softer, premium feel.
*   **DON'T** use "Standard" 4px or 8px corners. If it’s not `lg`, `xl`, or `full`, it doesn't belong in this system.
*   **DON'T** crowd the screen. If a view feels "full," increase the padding using the top end of the spacing scale. This system lives and breathes on whitespace.

---

## 7. Token Reference Summary
*   **Primary Action:** `#4647d3` (Vibrant Blue)
*   **Secondary Accent:** `#8126cf` (Vibrant Purple)
*   **Corner Radius (Hero):** `3rem` (xl)
*   **Corner Radius (Component):** `1rem` (DEFAULT)
*   **Typography (Headings):** Plus Jakarta Sans
*   **Typography (UI/Body):** Inter