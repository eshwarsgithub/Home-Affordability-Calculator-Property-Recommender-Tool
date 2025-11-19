"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { properties } from "@/data/properties";
import { metrics } from "@/data/dashboard";
import { PropertyCard } from "@/components/properties/property-card";
import { MapPanel } from "@/components/properties/map-panel";
import { Button, Badge, SectionHeading, StatCard } from "@/components/ui/primitives";
import { ScheduleModal } from "@/components/modals/schedule-modal";
import { Testimonials } from "@/components/testimonials";

const heroStats = [
  { label: "Assets Under Advisory", value: "₹48,200 Cr" },
  { label: "Average IRR", value: "19.2%" },
  { label: "Jurisdictions", value: "17 markets" },
];

const savedSearches = ["Bengaluru prime", "Managed villa", "Off-plan yield"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id ?? null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<string | undefined>();
  const [showFallback, setShowFallback] = useState(false);

  const suggestions = useMemo(() => {
    if (!query.trim()) return properties.slice(0, 4);
    return properties
      .filter((property) =>
        [property.name, property.location, property.configuration, property.highlights.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .slice(0, 5);
  }, [query]);

  const filteredProperties = useMemo(() => {
    if (!query.trim()) return properties;
    return properties.filter((property) =>
      [property.name, property.location, property.configuration, property.highlights.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  const handleBook = (propertyName: string) => {
    setScheduleTarget(propertyName);
    setScheduleOpen(true);
  };

  return (
    <>
      <section className="page-shell mt-16 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-panel p-10 space-y-6">
          <Badge>Private Briefing</Badge>
          <h1 className="font-serif text-[clamp(2.8rem,4vw,4.5rem)] leading-tight">
            Command every asset decision with a single, discreet interface.
          </h1>
          <p className="text-lg text-white/70">
            Tycoon Estates orchestrates discovery, diligence, and owner dashboards for global family offices and real-estate tycoons.
          </p>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <label className="text-xs uppercase tracking-[0.4em] text-white/60">Predictive search</label>
            <div className="mt-3 space-y-3">
              <div className="relative">
                <input
                  aria-label="Search properties"
                  className="w-full rounded-full border border-white/10 bg-[#050b16] px-5 py-4 text-base text-white"
                  placeholder="City, asset type, keyword"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-white/50">
                  CMD+K
                </div>
              </div>
              {query && suggestions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                  No matches yet. Try reducing filters or view the full listings grid.
                </div>
              ) : (
                <ul className="rounded-2xl border border-white/5 bg-black/30">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10"
                        onClick={() => {
                          setQuery(`${suggestion.name}`);
                          setSelectedPropertyId(suggestion.id);
                        }}
                      >
                        <span>
                          {suggestion.name}
                          <span className="ml-2 text-white/50">{suggestion.location}</span>
                        </span>
                        <span className="text-white">₹{(suggestion.price / 1_00_00_000).toFixed(2)} Cr</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((saved) => (
                  <button
                    key={saved}
                    className="rounded-full border border-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
                    type="button"
                    onClick={() => setQuery(saved)}
                  >
                    {saved}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {heroStats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => handleBook("Concierge liaison")}>Book a confidential briefing</Button>
            <Button asChild variant="ghost">
              <Link href="/listings">Explore listings</Link>
            </Button>
          </div>
        </div>
        <div className="space-y-4 rounded-[32px] border border-white/10 bg-[var(--gradient-hero)] p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Live intelligence</p>
          <div className="space-y-6">
            {metrics.map((metric) => (
              <div key={metric.id} className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm text-white/60">{metric.label}</p>
                <p className="mt-2 text-4xl font-semibold">{metric.value}</p>
                <div className="mt-4 h-16 w-full rounded-xl bg-white/5">
                  <div
                    className="h-full rounded-xl bg-[var(--color-royal)]/50"
                    style={{ width: `${metric.trend[metric.trend.length - 1] * 3}%` }}
                  />
                </div>
                <p className={`mt-2 text-sm ${metric.delta >= 0 ? "text-[#61ffc8]" : "text-[#ff9c7b]"}`}>
                  {metric.delta >= 0 ? "▲" : "▼"} {Math.abs(metric.delta)}% last 30d
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell mt-20 space-y-8">
        <SectionHeading
          eyebrow="Discovery"
          title="Property intelligence with map-sync precision"
          description="Filter, simulate, and book a site visit without leaving the hero canvas."
        />
        <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProperties.slice(0, 4).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                active={property.id === selectedPropertyId}
                onHover={(value) => value && setSelectedPropertyId(value)}
                onAction={() => handleBook(property.name)}
              />
            ))}
            {filteredProperties.length === 0 ? (
              <div className="surface-card col-span-2 text-center text-sm text-white/70">
                <p>No properties match this input.</p>
                <Button className="mt-4" onClick={() => setQuery("")}>Reset filters</Button>
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            <MapPanel properties={properties} selectedId={selectedPropertyId ?? undefined} onSelect={setSelectedPropertyId} />
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Edge cases</p>
              <p className="mt-2">
                Explore no-result messaging, overloaded filters, and slow-network skeletons in the Listings page prototype.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button size="sm" onClick={() => setShowFallback(true)}>Simulate slow network</Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/listings">View full flow</Link>
                </Button>
              </div>
              {showFallback ? (
                <div className="mt-4 space-y-2">
                  <div className="h-3 animate-pulse rounded-full bg-white/10" />
                  <div className="h-3 animate-pulse rounded-full bg-white/10" />
                  <div className="h-3 animate-pulse rounded-full bg-white/10" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-24 grid gap-10 lg:grid-cols-2">
        <div className="glass-panel p-8 space-y-6">
          <SectionHeading
            eyebrow="Owner dashboard"
            title="Portfolio cockpit for asset owners"
            description="Monitor risk drift, liquidity windows, tenant covenants, and ESG readiness from one luxurious console."
          />
          <ul className="space-y-4 text-sm text-white/70">
            <li>• Cashflow and IRR timeline with deviation alerts.</li>
            <li>• Interactive asset allocation donut with drill-down.</li>
            <li>• Co-investor communication trails and trust badges.</li>
            <li>• Microcopy reveals on click for compliance narratives.</li>
          </ul>
          <Button asChild size="lg">
            <Link href="/dashboard">Open owner dashboard</Link>
          </Button>
        </div>
        <div className="glass-panel p-8 space-y-6">
          <SectionHeading
            eyebrow="Conversion focus"
            title="Lead orchestration without friction"
            description="Every screen keeps a Book/View CTA visible and keyboard-accessible."
          />
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Schedule micro-interaction</p>
            <p className="font-serif text-2xl">One-click concierge</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => handleBook("Portfolio preview")}>Schedule now</Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/contact">Contact team</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Trust microcopy</p>
            <p className="font-serif text-2xl">ISO 27001 • GDPR • SOC 2 Type II</p>
            <p className="mt-2 text-sm text-white/70">Microcopy reveals appear on focus/hover to assure compliance-driven investors.</p>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="page-shell mt-20 mb-24">
        <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 text-center">
          <SectionHeading
            align="center"
            eyebrow="Prototype"
            title="Click through the full Tycoon Estates experience"
            description="Desktop, tablet, and mobile flows show predictive search, map sync, schedule modals, and dashboards with ≥10 purposeful micro-animations."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/listings">Launch interactive prototype</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/style-guide">View style guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {scheduleOpen ? (
        <ScheduleModal propertyName={scheduleTarget} onClose={() => setScheduleOpen(false)} />
      ) : null}
    </>
  );
}
