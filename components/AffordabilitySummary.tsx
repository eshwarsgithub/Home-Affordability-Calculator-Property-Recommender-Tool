import { formatCurrency, formatNumber } from "@/lib/format";
import type { AffordabilityResult } from "@/types";

interface SummaryProps {
  result: AffordabilityResult;
}

const summaryMetrics = [
  { key: "affordablePrice", label: "Affordable property budget" },
  { key: "loanAmount", label: "Eligible loan" },
  { key: "eligibleEmi", label: "Max EMI" },
  { key: "foir", label: "FOIR applied" },
] as const;

export function AffordabilitySummary({ result }: SummaryProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Affordability</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            {formatCurrency(result.affordablePrice)}
          </h2>
          <p className="text-sm text-slate-500">based on FOIR logic + input sliders</p>
        </div>
        <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-xs font-semibold uppercase text-emerald-900">
          FOIR {Math.round(result.foir * 100)}%
        </div>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {summaryMetrics.map((metric) => (
          <div key={metric.key} className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {metric.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900">
              {metric.key === "foir"
                ? `${Math.round(result.foir * 100)}%`
                : metric.key === "eligibleEmi"
                  ? `₹${formatNumber(result.eligibleEmi)}`
                  : formatCurrency(result[metric.key as keyof AffordabilityResult] as number)}
            </dd>
          </div>
        ))}
      </dl>
      {result.warnings.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Heads-up</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
