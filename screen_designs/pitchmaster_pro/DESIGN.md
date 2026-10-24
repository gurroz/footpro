# Design System Document: The Pitch Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Tactical Kinetic"**
This design system rejects the static, boxy nature of traditional management tools. Instead, it draws inspiration from high-end sports journalism and tactical playbooks. We achieve a "High-End Editorial" feel by treating the mobile screen as a dynamic pitch. We break the "template" look through **intentional asymmetry**, where player cards might slightly overlap a tactical pitch, and **tonal depth**, where hierarchy is defined by light and shadow rather than rigid lines. This is a system built for speed, authority, and the beautiful game.

---

2. Colors: Tonal Depth & The "No-Line" Rule
Our palette moves beyond simple "green and gray." We use a sophisticated scale of Material Design tokens to create a layered, immersive environment.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
*   **Primary Sectioning:** Use `surface-container-low` (#edf0ff) against the main `background` (#f5f6ff).
*   **Secondary Sectioning:** Use `surface-container-high` (#d9e2fd) to pull secondary tactical data into focus.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface` (#f5f6ff)
*   **Section:** `surface-container-low` (#edf0ff)
*   **Card/Interactive Element:** `surface-container-lowest` (#ffffff)
This "stacking" creates a natural, soft lift that feels premium and intentional.

### Signature Textures & Glass
To avoid a "flat" app feel:
*   **The Grass Gradient:** Use a linear gradient from `primary` (#386631) to `primary_container` (#b9eeab) for main CTAs and active tactical zones.
*   **Tactical Glass:** For floating action buttons or over-the-pitch overlays, use `surface_container_lowest` (#ffffff) at 70% opacity with a `24px` backdrop blur.

---

## 3. Typography: The Athletic Editorial
The typography system uses a high-contrast scale to mirror the energy of a stadium.

*   **Display & Headlines (Lexend):** This is our "Athletic" voice. It is bold, wide, and authoritative. Use `display-lg` (3.5rem) for scorelines and `headline-md` (1.75rem) for team names.
*   **Body & Labels (Inter):** Our "Tactical" voice. High readability is paramount. Use `body-lg` (1rem) for player bios and `label-sm` (0.6875rem) for technical stats.
*   **Editorial Spacing:** Always increase letter-spacing by 2-5% on `label` styles to ensure they feel like professional annotations.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines. We use light.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "Paper-on-Table" effect that is cleaner than a drop shadow.
*   **Ambient Shadows:** For floating elements (like a selected player on a pitch), use a shadow tinted with `on-surface` (#282f3f). 
    *   *Spec:* `0px 12px 32px rgba(40, 47, 63, 0.06)`. 
*   **The Ghost Border:** If a boundary is required for accessibility (e.g., in a high-glare outdoor coaching environment), use `outline-variant` (#a6adc1) at **15% opacity**. Never 100%.

---

## 5. Components

### Tactical Cards
*   **Style:** No borders. Use `surface-container-lowest` (#ffffff) with a `xl` (0.75rem) corner radius. 
*   **Asymmetry:** Player photos should "break the box," overlapping the top-left edge of the card by `spacing-2` (0.5rem) to create movement.

### Visual Soccer Pitch (Custom Component)
*   **Base:** `tertiary` (#006947) with a subtle grain texture.
*   **Markings:** Use `outline-variant` (#a6adc1) at 40% opacity.
*   **Interaction:** Drag-and-drop players are styled as circular `surface-container-lowest` avatars with an `ambient shadow`.

### Buttons
*   **Primary:** Gradient from `primary` to `primary_dim`. Roundedness: `full`. No shadow.
*   **Secondary:** `surface-container-highest` (#d3dcf9) with `on-surface` text.
*   **Tertiary:** Ghost style. `title-sm` typography with a `primary` color tint.

### Input Fields
*   **State:** Default state is `surface-container-low` (#edf0ff). 
*   **Focus State:** Shift to `surface-container-lowest` (#ffffff) with a 2px `primary` bottom-bar only. No full-box focus rings.

### Lists
*   **Rule:** Forbid divider lines. Separate list items using `spacing-2` (0.5rem) of vertical white space or alternating backgrounds between `surface` and `surface-container-low`.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `display-lg` typography for singular, high-impact numbers (e.g., goals, jersey numbers).
*   **Do** use `tertiary` (#006947) for "success" or "active" states to keep the soccer-pitch green consistent.
*   **Do** embrace negative space. If a layout feels crowded, increase padding using the `spacing-8` (2rem) token.

### Don't:
*   **Don't** use pure black (#000000). Always use `on-surface` (#282f3f) for text to maintain a premium, charcoal feel.
*   **Don't** use standard Material shadows. They are too heavy. Use our "Ambient Shadow" spec.
*   **Don't** use 90-degree corners. Even the "sharpest" elements should have at least a `sm` (0.125rem) radius to feel modern.