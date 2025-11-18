# Harihara Home Affordability Tool — Working Requirements

_Last synced with Harihara_PRD.pdf (Version 2.0, November 2025)_

## Objectives & KPIs
- Provide a mobile-first, sub-60-second flow that estimates purchasing power using FOIR-based logic.
- Capture high-quality leads (name, phone, email, consent) before showing results.
- Drive WhatsApp handoff with at least 3 qualified property suggestions.
- KPIs from the PRD: lead capture rate >40%, journey completion <60 sec, 3–12 property matches, WhatsApp CTR >10%.

## User Journey (per PRD)
1. Lead capture (name, phone, email, consent toggle).
2. Income details (employment type, primary income, existing EMIs, age, optional co-applicant section).
3. Loan preferences (tenure slider 15–30 years, down payment slider 20–50%).
4. Result view (affordability summary, EMI table, recommended properties, WhatsApp CTA).
5. Persistent WhatsApp CTA + progress indicator throughout.

## Calculation & Validation Rules
- **Surplus income** = total monthly household income – existing monthly EMIs.
- **Base FOIR**: 0.50 for salaried, 0.45 for self-employed.
- **Adjustments** (capped so FOIR ≤ 0.60):
  - +0.10 if a “young” co-applicant (age ≤ 32) with income ≥ ₹25k/month.
  - +0.05 if combined monthly income ≥ ₹250k (high-income boost).
- **Eligible EMI** = max(0, surplus × FOIR).
- **Loan amount** uses the PRD formula `Loan = EMI × (1 - (1+r)^(-n)) / r` with:
  - `r` = monthly interest rate; assumption: fixed 8.5% annual (0.085 / 12 monthly).
  - `n` = tenure in months.
- **Property price caps**:
  - `Price_by_LTV = Loan / 0.80` (80% LTV cap).
  - `Price_by_DownPayment = Loan / (1 - downPaymentPercent)` where percent slider ∈ [0.20, 0.50].
  - `Affordable Price = min(Price_by_LTV, Price_by_DownPayment)`.
- **EMI vs income guardrails**:
  - Existing + new EMI ≤ 80% of total monthly income.
  - Age + tenure (years) ≤ 70.
- **Validation essentials**: phone must be 10 digits, emails valid, income/EMI positive numbers, consent required to move past Step 1.

## Data & Matching Assumptions
- Maintain a curated catalog (JSON/TS) of Harihara inventory with: id, project, tower, configuration, carpet area, price, city, tags, delivery quarter, hero image.
- Recommended list should surface 3–12 properties priced ≤ Affordable Price × 1.05 (5% wiggle room to avoid empty states). If <3 matches, fill with closest higher units labeled "Stretch".
- EMI table should show three scenarios (70%, 85%, 100% of affordable price) with EMI & required down payment so users can compare quickly.

## UX & Tech Notes
- Tech stack per PRD: Next.js App Router + Tailwind. Use serverless API routes for lightweight lead capture/property endpoints (simulated, no external DB yet).
- Include a visible stepper, sticky footer CTA on mobile, and animations/micro-copy that reinforce the "60-second" pitch.
- WhatsApp CTA should deep-link to `https://wa.me/<sales-number>` with prefilled text containing name, city, and affordable price summary.
- Ensure accessibility basics (labels, keyboard nav, aria-live for errors) and responsive layout (≤480px focus).

## Open Questions / Stretch (documented for stakeholders)
- Actual interest rate source? Currently fixed at 8.5% until bank API provided.
- Co-applicant definition of "young" or "high income" unclarified—assumptions above can be tweaked via config.
- No Supabase/Firebase instance provided; current build uses local JSON + API routes but can be swapped later.
