## Harihara Home Affordability Calculator & Property Recommender

This Next.js 14 + Tailwind CSS app implements the interactive four-step flow from the Harihara Constructions PRD. The experience captures leads, calculates bank-aligned affordability using FOIR logic, and recommends eligible projects with WhatsApp follow-through.

### Core Features

- **Lead capture:** Name, phone, email and consent with validation aligned to PRD requirements.
- **Eligibility engine:** FOIR-based surplus evaluation with co-applicant and high income adjustments, capped at 60%.
- **Loan preferences:** Tenure slider (15-30 yrs), down-payment slider (20-50%), and adjustable rate.
- **Result hub:** Affordability summary, EMI sensitivity table, curated property matches (3-12 items) and sticky WhatsApp CTA.

### Local Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the tool. UI updates live thanks to Next.js fast refresh.

### Environment Variables

Create `.env.local` based on the Appwrite project:

```
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=...
APPWRITE_API_KEY=...
APPWRITE_DATABASE_ID=...
APPWRITE_LEADS_COLLECTION_ID=...
APPWRITE_PROPERTIES_COLLECTION_ID=...
```

The `scripts/setup-appwrite-schema.ts` helper can bootstrap the database/collection schema once the variables are in place:

```bash
npx tsx scripts/setup-appwrite-schema.ts
```

### Project Structure Highlights

- `src/app/page.tsx` – multi-step form, validation, presentation and CTA surface.
- `src/lib/calculations.ts` – FOIR helpers, EMI math, and affordability utilities.
- `src/data/properties.ts` – fallback inventory (live data now loads from Appwrite via `/api/properties`).
- `src/lib/server/appwrite.ts` – server SDK wrapper shared by App Router endpoints.
- `src/app/api/leads/route.ts` – secure lead capture endpoint posting to Appwrite.
- `src/app/api/properties/route.ts` – fetches property catalogue from Appwrite for the recommender.

### Next Steps

1. Seed production-ready property docs (images, pricing tiers) into Appwrite and tighten read filters.
2. Replace placeholder property imagery and enrich meta-information.
3. Add analytics + A/B testing hooks for the WhatsApp CTA and completion rate KPIs.
4. Harden form validations with server-side duplication checks before launch.

### Deployment

The app is Vercel-ready out of the box. Configure environment variables for backend services before shipping to production.
