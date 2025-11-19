# Performance & Implementation Checklist

## Critical Path
- [ ] Inline hero-critical CSS and font preload tags in `layout.tsx`.
- [ ] Enable Next.js image optimization + `priority` on hero media.
- [ ] Configure CDN caching headers (immutable for images/icons, 1h for HTML).

## Core Web Vitals Targets
| Metric | Target | Notes |
| --- | --- | --- |
| Lighthouse Mobile | ≥ 90 | Test on Moto G4 / 3G Fast throttle |
| FCP | < 1.5s | Keep hero payload < 130KB |
| LCP | < 2.5s | Use `priority` images + responsive `sizes` |
| CLS | < 0.1 | Reserve aspect ratios for galleries/cards |
| TBT | < 200ms | Code-split per route; defer non-critical JS |

## Implementation To-Dos
- [ ] Audit bundle with `next build --analyze` before launch.
- [ ] Lazy-load below-the-fold carousels & testimonials.
- [ ] Use `IntersectionObserver` for ROI calculator graphs.
- [ ] Compress hero imagery to WebP/AVIF (<220KB).
- [ ] Serve icons as inline SVG where possible.
- [ ] Setup monitoring (SpeedCurve or Calibre) for live CWV tracking.

## Accessibility / SEO
- [ ] Run `npm run lint` + `next lint --strict`.
- [ ] Execute axe DevTools on key routes (home, listings, property detail, dashboard).
- [ ] Validate schema via `https://validator.schema.org/`.
- [ ] Add meta tags + structured data script via `<script type="application/ld+json">`.

## Deployment Notes
- Prefetch `/properties/[id]` routes via `<Link prefetch>`.
- Enable ISR or revalidation for `/properties` page if backed by CMS.
- Monitor Appwrite latency; use caching layer when >250ms.
