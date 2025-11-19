"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { properties } from "@/data/properties";
import { PropertyFilters, type FilterState } from "@/components/properties/property-filters";
import { PropertyCard } from "@/components/properties/property-card";
import { MapPanel } from "@/components/properties/map-panel";
import { Button, Badge, SectionHeading } from "@/components/ui/primitives";
import { ScheduleModal } from "@/components/modals/schedule-modal";

const savedSearches = ["Asset-light villa", "Ready to move", "High ROI"];

export default function ListingsPage() {
  const minPrice = Math.min(...properties.map((p) => p.price));
  const maxPrice = Math.max(...properties.map((p) => p.price));
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    priceMin: minPrice,
    priceMax: maxPrice,
    configuration: "",
    tags: [],
  });
  const [selected, setSelected] = useState<string | null>(properties[0]?.id ?? null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleFiltersChange = (next: FilterState) => {
    setIsLoading(true);
    setFilters(next);
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
    loadingTimeout.current = setTimeout(() => setIsLoading(false), 700);
  };

  useEffect(() => () => {
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const matchesQuery = filters.query
        ? property.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          property.location.toLowerCase().includes(filters.query.toLowerCase())
        : true;
      const matchesPrice = property.price >= filters.priceMin && property.price <= filters.priceMax;
      const matchesConfig = filters.configuration ? property.configuration === filters.configuration : true;
      const matchesTags = filters.tags.length
        ? filters.tags.every((tag) =>
            property.highlights.some((highlight) => highlight.toLowerCase().includes(tag.toLowerCase())),
          )
        : true;
      return matchesQuery && matchesPrice && matchesConfig && matchesTags;
    });
  }, [filters]);

  const overloadedFilters = filters.tags.length > 3;

  const openSchedule = (name: string) => {
    setScheduleTarget(name);
    setScheduleOpen(true);
  };

  return (
    <section className="page-shell mt-16 space-y-10">
      <SectionHeading
        eyebrow="Listings"
        title="Search, filter, and book viewings with map-sync precision"
        description="Predictive search, saved filters, slow-network skeletons, and keyboard-accessible controls are built-in."
      />
      <PropertyFilters
        filters={filters}
        properties={properties}
        onChange={handleFiltersChange}
        savedSearches={savedSearches}
        onSavedSearchSelect={(query) => handleFiltersChange({ ...filters, query })}
      />
      {overloadedFilters ? (
        <div className="rounded-3xl border border-[#ff9c7b]/40 bg-[#ff9c7b]/10 p-4 text-sm text-white">
          Filter tip: narrowing with too many tags could hide trophy assets. Remove a tag or widen budget to continue.
        </div>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div>
          <div className="flex items-center justify-between">
            <Badge tone="neutral">{filtered.length} matches</Badge>
            <span className="sr-only" aria-live="polite">
              {filtered.length} properties match current filters
            </span>
            <div className="flex gap-2 text-xs uppercase tracking-[0.4em] text-white/60">
              <span>List</span>
              <span>•</span>
              <span>Map Sync</span>
            </div>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {isLoading
              ? [...Array(4)].map((_, index) => (
                  <div key={String(index)} className="h-80 animate-pulse rounded-[28px] bg-white/5" />
                ))
              : filtered.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    active={selected === property.id}
                    onHover={(value) => value && setSelected(value)}
                    onAction={() => openSchedule(property.name)}
                  />
                ))}
          </div>
          {filtered.length === 0 && !isLoading ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
              <p>No observed matches. Try clearing filters or switch to Saved Searches.</p>
              <Button
                className="mt-4"
                onClick={() =>
                  handleFiltersChange({ query: "", priceMin: minPrice, priceMax: maxPrice, configuration: "", tags: [] })
                }
              >
                Reset filters
              </Button>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <MapPanel properties={properties} selectedId={selected ?? undefined} onSelect={setSelected} />
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Keyboard + screen readers</p>
            <p className="mt-2">
              Map pins announce price, ROI, and location with aria labels; list view mirrors highlight on focus for WCAG compliance.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="sm" onClick={() => openSchedule("Portfolio call")}>
                Book call
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/style-guide">View accessibility notes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {scheduleOpen ? (
        <ScheduleModal propertyName={scheduleTarget} onClose={() => setScheduleOpen(false)} />
      ) : null}
    </section>
  );
}
