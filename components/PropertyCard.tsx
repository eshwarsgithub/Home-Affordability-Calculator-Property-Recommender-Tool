import { formatCurrency, formatNumber } from "@/lib/format";
import type { PropertyMatch } from "@/types";

interface PropertyCardProps {
  property: PropertyMatch;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {property.fit === "Ideal" ? "Ideal match" : "Stretch"}
          </p>
          <h4 className="mt-1 text-lg font-semibold text-slate-900">{property.name}</h4>
          <p className="text-sm text-slate-500">{property.location}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {property.configuration}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1">{property.status}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">{property.delivery}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-6 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Ticket size</p>
          <p className="text-base font-semibold text-slate-900">{formatCurrency(property.price)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Monthly EMI</p>
          <p className="text-base font-semibold text-slate-900">₹{formatNumber(property.monthlyEmi)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Down payment</p>
          <p className="text-base font-semibold text-slate-900">₹{formatNumber(property.downPaymentAmount)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
        {property.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
