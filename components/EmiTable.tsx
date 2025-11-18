import { formatCurrency, formatNumber } from "@/lib/format";
import type { EmiScenario } from "@/types";

interface EmiTableProps {
  scenarios: EmiScenario[];
}

export function EmiTable({ scenarios }: EmiTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">EMI Table</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">Compare monthly impact</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">₹ in INR</span>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Scenario</th>
              <th className="px-4 py-3 font-semibold">Property price</th>
              <th className="px-4 py-3 font-semibold">Down payment</th>
              <th className="px-4 py-3 font-semibold">Monthly EMI</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => (
              <tr key={scenario.label} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-800">{scenario.label}</td>
                <td className="px-4 py-3">{formatCurrency(scenario.propertyPrice)}</td>
                <td className="px-4 py-3">₹{formatNumber(scenario.downPaymentAmount)}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">₹{formatNumber(scenario.monthlyEmi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
