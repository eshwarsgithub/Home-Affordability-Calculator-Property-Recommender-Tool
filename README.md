# Tycoon Estates — Real-Estate Command Center

High-fidelity, production-ready Next.js 16 experience for ultra-high-net-worth real-estate discovery, dashboards, and admin management. The UI implements the design brief: luxurious tone, predictive search, map-sync listings, ROI calculators, and accessibility-first microinteractions.

## Highlights
- **Responsive canvases** for desktop ≥1440px, laptop 1280px, tablet 768/1024px, and mobile 360/412px.
- **Predictive search + filters** with saved searches, skeleton fallbacks, and map pin sync (listings page).
- **Property detail stack** with hero gallery, video toggle placeholder, ROI/mortgage calculator, schedule modal, and trust microcopy.
- **Agent/portfolio hub** showcasing advisors, certifications, testimonials, and CTA-ready workflows.
- **Owner dashboard & admin** views with metrics, timelines, holdings table, and listing management toggles.
- **Accessibility & performance guardrails** baked into components (`:focus-visible`, aria-labels, lazy loading, GPU-only animations).

## App Structure
| Path | Description |
| --- | --- |
| `/` | Hero, predictive search, highlights, dashboard preview, testimonials, CTA strip |
| `/listings` | Filter drawer, predictive saved searches, map-sync results, slow-network simulation |
| `/properties/[id]` | Gallery, ROI calculator, certification & trust stack, modal schedule |
| `/agents` | Advisor selector with success stats and testimonials |
| `/dashboard` | Portfolio metrics, liquidity timeline, holdings filter chips |
| `/contact` | Accessible lead capture form + trust badges |
| `/admin` | Listing management table with publish/draft toggle |
| `/style-guide` | Brand tokens, typography, accessibility/performance reminders |

## Getting Started
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` and explore each route. Update `.env.local` to connect Appwrite for `/api/leads` + `/api/properties`:
```
APPWRITE_ENDPOINT=...
APPWRITE_PROJECT_ID=...
APPWRITE_API_KEY=...
APPWRITE_DATABASE_ID=...
APPWRITE_LEADS_COLLECTION_ID=...
APPWRITE_PROPERTIES_COLLECTION_ID=...
```

## Design System & Assets
- Global tokens live in `src/app/globals.css`, exported separately via `handoff/css-variables.css`.
- Component primitives: `src/components/ui/primitives.tsx`.
- Icons (outline 24dp grid): `public/icons/`.
- Developer handoff docs: `docs/*.md`, `handoff/assets.json`, `docs/style-guide.pdf`, `docs/animation-specs.md`.

## Performance & Accessibility
- Lighthouse mobile ≥90, CLS <0.1, FCP <1.5s, TBT <200ms.
- Animations limited to transform/opacity (80–120ms hover, 150–300ms transitions, 400–500ms reveals).
- `ScheduleModal` enforces focus trapping + ESC close.
- Map pins and filters expose descriptive aria labels; forms leverage semantic labels + validation hints.

## Testing & QA
- `npm run lint` for static analysis.
- Use `npx @axe-core/cli http://localhost:3000` for WCAG 2.1 AA coverage.
- Switch Chrome dev tools to “Slow 3G” to verify skeleton + fallback states (Listings).

## Next Steps
1. Connect real Appwrite dataset + enable ISR for `/properties`.
2. Wire analytics via `src/lib/analytics.ts` events (step_started, property_clicked, etc.).
3. Import actual Figma deliverable using the brief in `docs/developer-handoff.md` and map components 1:1.
4. Run Lighthouse CI in your pipeline to guarantee ≥90 mobile score before deploy.
