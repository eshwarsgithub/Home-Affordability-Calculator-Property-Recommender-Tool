"use client";

import { useId } from "react";
import type { Property } from "@/data/properties";
import { Button, Badge } from "@/components/ui/primitives";

export type FilterState = {
  query: string;
  priceMin: number;
  priceMax: number;
  configuration: string;
  tags: string[];
};

interface PropertyFiltersProps {
  filters: FilterState;
  properties: Property[];
  onChange: (next: FilterState) => void;
  savedSearches: string[];
  onSavedSearchSelect: (query: string) => void;
}

const configurations = ["Any", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "Villa"];
const tagPool = ["Ready to move", "Lake view", "Sky deck", "EV ready", "High ROI", "Managed"];

export const PropertyFilters = ({ filters, properties, onChange, savedSearches, onSavedSearchSelect }: PropertyFiltersProps) => {
  const minPrice = Math.min(...properties.map((p) => p.price));
  const maxPrice = Math.max(...properties.map((p) => p.price));
  const priceStep = 500000;
  const queryId = useId();

  const handleTagToggle = (tag: string) => {
    const tags = filters.tags.includes(tag)
      ? filters.tags.filter((item) => item !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags });
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[220px]">
          <label htmlFor={queryId} className="text-xs uppercase tracking-[0.3em] text-white/60">
            Search
          </label>
          <input
            id={queryId}
            type="search"
            placeholder="City, asset, keyword"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            className="mt-2 w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
          />
        </div>
        <div className="min-w-[200px]">
          <label className="text-xs uppercase tracking-[0.3em] text-white/60">Configuration</label>
          <div className="mt-2">
            <select
              value={filters.configuration}
              onChange={(event) => onChange({ ...filters, configuration: event.target.value })}
              className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm text-white"
            >
              {configurations.map((config) => (
                <option key={config} value={config === "Any" ? "" : config} className="bg-[#050b16]">
                  {config}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Budget (₹)</p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-3">
              <input
                type="number"
                min={minPrice}
                max={filters.priceMax - priceStep}
                step={priceStep}
                value={filters.priceMin}
                onChange={(event) => onChange({ ...filters, priceMin: Number(event.target.value) })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
              />
              <input
                type="number"
                min={filters.priceMin + priceStep}
                max={maxPrice}
                step={priceStep}
                value={filters.priceMax}
                onChange={(event) => onChange({ ...filters, priceMax: Number(event.target.value) })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={priceStep}
                value={filters.priceMin}
                onChange={(event) => onChange({ ...filters, priceMin: Math.min(Number(event.target.value), filters.priceMax - priceStep) })}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={priceStep}
                value={filters.priceMax}
                onChange={(event) => onChange({ ...filters, priceMax: Math.max(Number(event.target.value), filters.priceMin + priceStep) })}
              />
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tagPool.map((tag) => (
              <button
                key={tag}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  filters.tags.includes(tag)
                    ? "border-[var(--color-royal)] bg-[var(--color-royal)]/20"
                    : "border-white/20 text-white/70"
                }`}
                onClick={() => handleTagToggle(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="neutral">Saved Searches</Badge>
        {savedSearches.map((search) => (
          <button
            key={search}
            onClick={() => onSavedSearchSelect(search)}
            type="button"
            className="rounded-full border border-white/10 px-4 py-1 text-sm text-white/70 hover:border-white/30"
          >
            {search}
          </button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              ...filters,
              query: "",
              tags: [],
              configuration: "",
              priceMin: minPrice,
              priceMax: maxPrice,
            })
          }
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};
