# Figma / Prototype Structure

Use this map when building/organizing the actual Figma file.

- **Pages**
  1. `Design System` – tokens, typography, components, interaction specs.
  2. `Desktop` – Homepage, Listings, Property Detail, Dashboard, Admin, Contact.
  3. `Tablet` – Key flows for 1024/768 widths.
  4. `Mobile` – 412/360 artboards with sticky CTA + drawer nav.
  5. `Prototype` – Flow map connecting hero → listings → property → schedule modal → dashboard.

- **Prototype Requirements**
  - Minimum 10 micro-interactions (hover lifts, filter apply, card expansion, gallery fade, modal open, toast).
  - Search ↔ map sync and schedule modal must be clickable.
  - Edge cases: no results, overloaded filters, slow network skeleton.

- **Frames / Naming**
  - Prefix `TE/` for UI frames (e.g., `TE/Desktop/Home`).
  - Use Auto Layout + Components for nav, cards, filters.
  - Variants: Buttons (primary/secondary/ghost), Property Card (default/active/skeleton), Filter Chips (default/selected/error).

- **Prototype Link Export**
  - Publish to `Prototype > Share > Anyone with link can view`.
  - Document notes + hotspots using Figma comments referencing component names.
