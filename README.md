# Harihara Home Affordability Tool

Bank-grade FOIR affordability calculator plus curated property recommender for Harihara Constructions, built directly from **Harihara_PRD.pdf (v2.0, Nov 2025)**. The experience walks prospects through a 3-step, mobile-first flow, captures compliant leads, and instantly surfaces EMI math, purchase power, and 3-12 matched Harihara units with a WhatsApp handoff.

## Feature Highlights
- **Lead-first journey:** Stepper-driven UX covering lead capture, income profile (with optional co-applicant), and loan preference sliders (15-30 yr tenure, 20-50% down payment). Inline validations enforce PII, FOIR guardrails, age + tenure caps, and consent.
- **FOIR logic + EMI engine:** Implements surplus income, base FOIR (0.50 salaried / 0.45 self-employed), +0.10 young co-app boost (age <= 32, income >= 25k), +0.05 high-income boost (household >= 250k), capped at 0.60. Uses the PRD loan formula with an 8.5% annual rate to derive loan limits, EMI limits, and affordable price (min of down-payment vs 80% LTV paths).
- **Result stack:** Affordability summary cards, guardrail warnings, EMI comparison table (70/85/100% scenarios), WhatsApp-ready messaging, and a sticky CTA for mobile.
- **Property intelligence:** `data/properties.ts` stores Harihara inventory metadata; the matcher returns 3-12 records priced within 5% of the affordable price (fills with stretch units if needed) and tags each with EMI/down-payment breakdowns.
- **Backend touchpoint:** `/api/lead` route logs submissions for onward sync (ready to swap with Supabase/Firebase). `docs/requirements.md` tracks every PRD rule and assumption.

## Running the Project
```bash
npm install        # install deps
npm run dev        # start local dev server on http://localhost:3000
npm run lint       # type & lint checks
npm run build      # production build validation
```

## Key Files & Folders
- `app/page.tsx` and `components/*` — multi-step flow, summary widgets, WhatsApp CTA.
- `lib/calculations.ts` — FOIR math + EMI helpers; `lib/property-match.ts` — inventory filtering logic.
- `data/properties.ts` — curated units + marketing metadata.
- `docs/requirements.md` — extracted PRD requirements, assumptions, guardrails.

## Configuration & Assumptions
- Interest rate fixed at **8.5% annual** (see `lib/constants.ts`). Update when a bank feed is available.
- Phone validation expects **Indian 10-digit numbers** starting 6-9; tweak `PHONE_REGEX` for other regions.
- WhatsApp CTA targets `+91 73388 89900` (placeholder). Adjust `SALES_WHATSAPP_NUMBER` in `lib/constants.ts` for production.
- No persistent DB is wired in yet; plug Supabase/Firebase inside `/api/lead` or add edge functions per the roadmap section of the PRD.

## Next Suggestions
1. Connect `/api/lead` to Supabase (row-level security + encryption) and surface success/failure states to sales ops dashboards.
2. Replace the static property catalog with a CMS or Supabase table plus filters (budget band, location, possession timeline).
3. Add analytics & SLA timers (completion under 60 sec, WhatsApp CTR) to honor KPI tracking.
