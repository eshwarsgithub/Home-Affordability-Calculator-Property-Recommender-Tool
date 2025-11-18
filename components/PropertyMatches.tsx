import { PropertyCard } from "@/components/PropertyCard";
import type { PropertyMatch } from "@/types";

interface PropertyMatchesProps {
  properties: PropertyMatch[];
}

export function PropertyMatches({ properties }: PropertyMatchesProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        No inventory yet. Adjust tenure or down payment to unlock active listings.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
