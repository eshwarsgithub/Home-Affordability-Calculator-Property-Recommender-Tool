"use client";

import type { Property } from "@/data/properties";
import { motion } from "framer-motion";

interface MapPanelProps {
  properties: Property[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

const computePosition = (value: number, min: number, max: number) => {
  if (max - min === 0) return 50;
  return ((value - min) / (max - min)) * 100;
};

export const MapPanel = ({ properties, selectedId, onSelect }: MapPanelProps) => {
  const latitudes = properties.map((p) => p.latitude);
  const longitudes = properties.map((p) => p.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return (
    <div className="relative h-[520px] rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(10,93,255,0.32),rgba(5,7,14,0.8))] overflow-hidden">
      <svg className="absolute inset-0 opacity-40" aria-hidden width="100%" height="100%">
        <defs>
          <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
          </linearGradient>
        </defs>
        {[...Array(20)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={(i / 20) * 100 + "%"}
            x2="100%"
            y2={(i / 20) * 100 + "%"}
            stroke="url(#grid)"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={(i / 20) * 100 + "%"}
            y1="0"
            x2={(i / 20) * 100 + "%"}
            y2="100%"
            stroke="url(#grid)"
            strokeWidth="0.5"
          />
        ))}
      </svg>
      {properties.map((property) => {
        const top = 100 - computePosition(property.latitude, minLat, maxLat);
        const left = computePosition(property.longitude, minLng, maxLng);
        const isActive = property.id === selectedId;
        return (
          <motion.button
            key={property.id}
            aria-label={`Focus ${property.name}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${top}%`, left: `${left}%` }}
            whileHover={{ scale: 1.15 }}
            onMouseEnter={() => onSelect?.(property.id)}
            onFocus={() => onSelect?.(property.id)}
            onClick={() => onSelect?.(property.id)}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-150 ${
                isActive
                  ? "bg-[var(--color-royal)] border-white shadow-[0_10px_30px_rgba(10,93,255,0.6)]"
                  : "bg-white/10 border-white/40"
              }`}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-white" />
            </span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
              className="mt-2 block rounded-full bg-white/10 px-3 py-1 text-xs text-white"
            >
              {property.configuration}
            </motion.span>
          </motion.button>
        );
      })}
      {selectedId ? (
        <div className="absolute left-6 bottom-6 right-6 rounded-2xl bg-black/60 p-4 backdrop-blur">
          {(() => {
            const property = properties.find((p) => p.id === selectedId);
            if (!property) return null;
            return (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Active Asset</p>
                  <p className="font-serif text-2xl">{property.name}</p>
                  <p className="text-sm text-white/70">{property.location}</p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-white/60">Price</p>
                    <p>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(property.price)}</p>
                  </div>
                  <div>
                    <p className="text-white/60">ROI</p>
                    <p>{property.roi}%</p>
                  </div>
                  <div>
                    <p className="text-white/60">Occupancy</p>
                    <p>{property.occupancyRate}%</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : null}
    </div>
  );
};
