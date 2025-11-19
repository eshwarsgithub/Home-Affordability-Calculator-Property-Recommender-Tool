"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Property } from "@/data/properties";
import { Button, Badge } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/calculations";

interface PropertyCardProps {
  property: Property;
  active?: boolean;
  onHover?: (propertyId: string | null) => void;
  onAction?: (property: Property) => void;
}

export const PropertyCard = ({ property, active, onHover, onAction }: PropertyCardProps) => (
  <motion.article
    layout
    whileHover={{ translateY: -6 }}
    onMouseEnter={() => onHover?.(property.id)}
    onFocus={() => onHover?.(property.id)}
    onMouseLeave={() => onHover?.(null)}
    className={`flex flex-col overflow-hidden rounded-[28px] border transition-all duration-200 ${
      active ? "border-[var(--color-royal)] shadow-[0_24px_60px_rgba(10,93,255,0.35)]" : "border-white/10"
    }`}
  >
    <div className="relative h-64 overflow-hidden">
      <Image
        src={property.imageUrl}
        alt={`${property.name} in ${property.location}`}
        fill
        priority={false}
        sizes="(min-width: 1280px) 400px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute left-5 right-5 bottom-5 flex items-center justify-between">
        <div>
          <p className="font-serif text-2xl text-white">{property.name}</p>
          <p className="text-sm text-white/80">{property.location}</p>
        </div>
        <Badge tone="success">{property.roi}% projected ROI</Badge>
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-4 bg-[rgba(10,10,16,0.9)] p-6">
      <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
        <span aria-label="Configuration">{property.configuration}</span>
        <span>•</span>
        <span>{property.carpetArea}</span>
        <span>•</span>
        <span>{property.possession}</span>
      </div>
      <p className="text-3xl font-semibold">{formatCurrency(property.price)}</p>
      <ul className="flex flex-wrap gap-2 text-sm text-white/70">
        {property.highlights.slice(0, 3).map((highlight) => (
          <li key={highlight} className="rounded-full bg-white/5 px-3 py-1">
            {highlight}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Occupancy</p>
          <p className="text-lg">{property.occupancyRate}%</p>
        </div>
        <Button onClick={() => onAction?.(property)} size="lg">
          Book Viewing
        </Button>
      </div>
    </div>
  </motion.article>
);
