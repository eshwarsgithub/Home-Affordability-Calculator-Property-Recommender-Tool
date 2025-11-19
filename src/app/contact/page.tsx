"use client";

import { useState } from "react";
import { SectionHeading, Button, Badge } from "@/components/ui/primitives";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("success");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="page-shell mt-16 space-y-10">
      <SectionHeading
        eyebrow="Contact"
        title="Confidential lead capture & trust signals"
        description="Keyboard-friendly form with inline validation and testimonials to increase conversion."
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-white/70">
              Full name
              <input required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base" />
            </label>
            <label className="text-sm text-white/70">
              Family office / fund
              <input required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-white/70">
              Email
              <input type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base" />
            </label>
            <label className="text-sm text-white/70">
              WhatsApp
              <input
                type="tel"
                pattern="[0-9+\\-\\s()]+"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              />
            </label>
          </div>
          <label className="text-sm text-white/70">
            Message
            <textarea
              required
              rows={4}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-base"
              placeholder="Desired asset, ticket size, closing velocity, etc."
            />
          </label>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <input type="checkbox" id="consent" required className="h-5 w-5 rounded border-white/30 bg-white/5" />
            <label htmlFor="consent">I consent to encrypted storage aligned with GDPR & DPDP Act.</label>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" size="lg">
              {status === "success" ? "Submitted" : "Send request"}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <a href="tel:+18004561234">Call concierge</a>
            </Button>
          </div>
          {status === "success" ? (
            <p className="text-sm text-[#61ffc8]" role="status" aria-live="polite">
              Concierge alerted. Expect a private reply within 15 minutes.
            </p>
          ) : null}
        </form>
        <div className="space-y-4">
          <div className="glass-panel p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Trust</p>
            <p className="font-serif text-3xl">Certifications & assurances</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• ISO 27001, SOC 2 Type II, GDPR + DPDP Act compliant.</li>
              <li>• Accessibility: WCAG 2.1 AA, keyboard navigable forms.</li>
              <li>• SEO: schema.org/RealEstateListing + structured data.</li>
              <li>• Microcopy explains data retention & encryption.</li>
            </ul>
          </div>
          <div className="glass-panel p-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Location</p>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1c3f] to-[#0f0f1a] p-6 text-sm text-white/70">
              <p>Tycoon Estates Command Center</p>
              <p>UB City, Vittal Mallya Road, Bengaluru</p>
              <p className="mt-2">Coordinates: 12.9716° N, 77.5946° E</p>
              <div className="mt-4 h-40 rounded-2xl bg-[url('/icons/map-pin.svg')] bg-contain bg-center bg-no-repeat" role="img" aria-label="Stylized map" />
            </div>
            <Badge tone="info">Available 24/7</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
