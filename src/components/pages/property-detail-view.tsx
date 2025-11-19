"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Property } from "@/data/properties";
import { SectionHeading, Badge, Button } from "@/components/ui/primitives";
import { RoiCalculator } from "@/components/calculators/roi-calculator";
import { ScheduleModal } from "@/components/modals/schedule-modal";
import { formatCurrency } from "@/lib/calculations";

interface PropertyDetailViewProps {
  property: Property;
}

export const PropertyDetailView = ({ property }: PropertyDetailViewProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const heroImages = property.heroImages.length ? property.heroImages : [property.imageUrl];
  const facts = useMemo(
    () => [
      { label: "Price", value: formatCurrency(property.price) },
      { label: "ROI", value: `${property.roi}%` },
      { label: "Occupancy", value: `${property.occupancyRate}%` },
      { label: "Configuration", value: property.configuration },
      { label: "Carpet area", value: property.carpetArea },
      { label: "Possession", value: property.possession },
    ],
    [property],
  );

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <div className="space-y-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[40px] border border-white/10">
            {heroImages.map((image, index) => (
              <Image
                key={image}
                src={image}
                alt={`${property.name} slide ${index + 1}`}
                fill
                sizes="100vw"
                className={`object-cover transition-opacity duration-500 ${index === activeImage ? "opacity-100" : "opacity-0"}`}
                priority={index === 0}
              />
            ))}
            <div className="absolute left-6 bottom-6 space-y-2">
              <Badge tone="neutral">{property.location}</Badge>
              <p className="font-serif text-4xl">{property.name}</p>
              <p className="text-sm text-white/70">LEED Gold • RERA verified • Managed concierge</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {heroImages.map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
                className={`h-20 w-32 overflow-hidden rounded-2xl border transition-all ${
                  index === activeImage ? "border-[var(--color-royal)]" : "border-white/10"
                }`}
              >
                <Image src={image} alt="gallery thumbnail" width={128} height={80} className="h-full w-full object-cover" />
              </button>
            ))}
            <button
              className="rounded-2xl border border-white/20 px-4 py-3 text-sm text-white/80 hover:text-white"
              onClick={() => alert("Video cue placeholder – integrate secure streaming")}
              type="button"
            >
              Watch video walkthrough
            </button>
          </div>
        </div>
        <div className="glass-panel p-8 space-y-4">
          <SectionHeading
            eyebrow="Key facts"
            title="Investment narrative"
            description="Contact CTA remains visible on every breakpoint."
          />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="text-white/60">{fact.label}</dt>
                <dd className="text-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="text-white">Trust microcopy</p>
            <p>NDA-backed data room, escrow-managed bookings, independent RICS valuation uploaded Nov 18, 2025.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setShowSchedule(true)}>
              Schedule viewing
            </Button>
            <Button asChild variant="ghost">
              <Link href={property.detailsUrl} target="_blank">
                Download dossier
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/listings">Back to listings</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <RoiCalculator price={property.price} />
        <div className="glass-panel p-6 space-y-5">
          <SectionHeading
            eyebrow="Highlights"
            title="Why this asset wins"
            description="Hover reveals microcopy, keyboard focus supported."
          />
          <ul className="space-y-3 text-sm text-white/80">
            {property.highlights.map((highlight) => (
              <li key={highlight} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {highlight}
              </li>
            ))}
          </ul>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Certifications</p>
            <p className="mt-2">{property.certification ?? "Pending"}</p>
            <p className="mt-2 text-white/60">WCAG-friendly microcopy assures compliance teams during due diligence.</p>
          </div>
        </div>
      </div>
      {showSchedule ? (
        <ScheduleModal propertyName={property.name} onClose={() => setShowSchedule(false)} />
      ) : null}
    </>
  );
};
