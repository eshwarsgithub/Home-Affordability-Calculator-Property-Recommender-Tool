# Tycoon Estates — Developer Handoff

## Stack Guidance
- Next.js 16 App Router with React 19 and RSC enabled routes.
- Styling via CSS custom properties plus utility classes (Tailwind 4 inline import). Animations lean on `framer-motion` for transform/opacity only.
- Recommended deployment: Vercel Edge with CDN image optimization + Appwrite backend for CRM persistence.

## Page Inventory
1. `/` – Hero, predictive search, property highlights, dashboard preview, testimonials, CTA.
2. `/listings` – Filter panel, predictive search, saved searches, map-sync, skeletons.
3. `/properties/[id]` – Gallery, ROI/mortgage calculator, highlight stack, schedule modal.
4. `/agents` – Advisor selector with testimonials + certifications.
5. `/dashboard` – Metrics grid, liquidity timeline, holdings filters.
6. `/contact` – Accessible form + trust/SEO notes.
7. `/admin` – Listing management table (publish/draft toggle).
8. `/style-guide` – Brand tokens, accessibility, performance guardrails.

## Components & Tokens
- Shared primitives live in `src/components/ui/primitives.tsx` (Button, Badge, StatCard, Card, Fieldset, SectionHeading).
- Property-focused components: `PropertyCard`, `PropertyFilters`, `MapPanel`, `PropertyDetailView`.
- Modals & calculators: `ScheduleModal`, `RoiCalculator`.
- CSS variables exported in `handoff/css-variables.css` – import into any downstream stack for theming.

## Example Snippets
### Button
```tsx
<Button size="lg" onClick={() => setOpen(true)}>Schedule Viewing</Button>
```
### Property Card
```tsx
<PropertyCard
  property={property}
  active={property.id === selected}
  onHover={(id) => setSelected(id ?? selected)}
  onAction={() => handleSchedule(property.name)}
/>
```
### Schedule Modal Trigger
```tsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Book a briefing</Button>
<ScheduleModal open={open} propertyName={property.name} onClose={() => setOpen(false)} />
```

## Accessibility Checklist
- Focus halo: automatic via global styles / `:focus-visible`.
- Map pins expose aria-labels; filter controls wrapped in `<label>`; modals focus-trap via JS.
- All CTA buttons reachable via keyboard (tab order preserved top → bottom).
- Run `npx @axe-core/cli http://localhost:3000 --tags wcag2a,wcag2aa` before release.

## Performance Checklist (summary)
See `docs/performance-checklist.md` for the full matrix.
- Target Lighthouse Mobile ≥ 90, CLS < 0.1, LCP < 2.5s.
- Inline critical hero styles, lazy-load below fold images (`loading="lazy"`).
- Serve assets through CDN with brotli + HTTP/2 push/preload for fonts.

## Assets & Delivery
- SVG icons: `public/icons/*.svg` (24dp grid, tone-ready).
- Style/PDF + CSS tokens + asset manifest in `/docs` and `/handoff`.
- Prototype reference: use `/listings` + `/properties/[id]` for interactive micro-animations (≥10 present).

## Next Steps
1. Wire Appwrite credentials (`.env.local`) to persist leads + listings.
2. Create actual Figma boards mirroring `/style-guide` tokens (pages: Design System, Desktop, Tablet, Mobile, Prototype).
3. Hook analytics (GA4 + GTag) through `src/lib/analytics.ts` events defined earlier.
