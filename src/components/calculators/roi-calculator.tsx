"use client";

import { useMemo, useState } from "react";
import { calculateAffordability, buildEmiTable, formatCurrency } from "@/lib/calculations";
import { Button } from "@/components/ui/primitives";

interface RoiCalculatorProps {
  price: number;
}

export const RoiCalculator = ({ price }: RoiCalculatorProps) => {
  const [input, setInput] = useState({
    primaryIncome: 450000,
    coApplicantIncome: 0,
    existingEmis: 0,
    employmentType: "salaried" as const,
    hasYoungCoApplicant: false,
    tenureYears: 20,
    downPaymentPercent: 0.3,
    interestRate: 8.6,
    rentYield: 0.045,
    appreciation: 0.08,
  });

  const summary = useMemo(() => calculateAffordability(input), [input]);
  const emiRows = useMemo(() => buildEmiTable(summary.eligibleLoanAmount, input.interestRate, [15, 20, 25, input.tenureYears]), [summary.eligibleLoanAmount, input.interestRate, input.tenureYears]);

  const projectedRent = price * input.rentYield;
  const projectedAppreciation = price * input.appreciation;

  return (
    <div className="glass-panel p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">ROI & Mortgage</p>
          <h3 className="font-serif text-3xl">Capital stack modeling</h3>
        </div>
        <Button variant="secondary" size="sm">
          Export assumptions
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-white/70">
          Household income / month (₹)
          <input
            type="number"
            value={input.primaryIncome}
            min={50000}
            step={10000}
            onChange={(event) => setInput((prev) => ({ ...prev, primaryIncome: Number(event.target.value) }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base"
          />
        </label>
        <label className="text-sm text-white/70">
          Existing EMIs (₹)
          <input
            type="number"
            value={input.existingEmis}
            min={0}
            step={5000}
            onChange={(event) => setInput((prev) => ({ ...prev, existingEmis: Number(event.target.value) }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base"
          />
        </label>
        <label className="text-sm text-white/70">
          Tenure (years)
          <input
            type="range"
            min={15}
            max={30}
            value={input.tenureYears}
            onChange={(event) => setInput((prev) => ({ ...prev, tenureYears: Number(event.target.value) }))}
            className="mt-4 w-full"
          />
          <p className="text-xs text-white/60">{input.tenureYears} years</p>
        </label>
        <label className="text-sm text-white/70">
          Down payment (%)
          <input
            type="range"
            min={20}
            max={60}
            value={input.downPaymentPercent * 100}
            onChange={(event) => setInput((prev) => ({ ...prev, downPaymentPercent: Number(event.target.value) / 100 }))}
            className="mt-4 w-full"
          />
          <p className="text-xs text-white/60">{Math.round(input.downPaymentPercent * 100)}%</p>
        </label>
        <label className="text-sm text-white/70">
          Interest rate (%)
          <input
            type="number"
            step={0.1}
            value={input.interestRate}
            onChange={(event) => setInput((prev) => ({ ...prev, interestRate: Number(event.target.value) }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base"
          />
        </label>
        <label className="text-sm text-white/70">
          Rent yield (%)
          <input
            type="number"
            step={0.1}
            value={input.rentYield * 100}
            onChange={(event) => setInput((prev) => ({ ...prev, rentYield: Number(event.target.value) / 100 }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base"
          />
        </label>
        <label className="text-sm text-white/70">
          Appreciation (%)
          <input
            type="number"
            step={0.1}
            value={input.appreciation * 100}
            onChange={(event) => setInput((prev) => ({ ...prev, appreciation: Number(event.target.value) / 100 }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Eligible Loan</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.eligibleLoanAmount)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Target Budget</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.affordablePrice)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Monthly EMI</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.maxEligibleEmi)}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 text-sm text-white/70">
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-white/60">Projected rent pa.</p>
          <p className="text-lg">{formatCurrency(projectedRent)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-white/60">Projected appreciation</p>
          <p className="text-lg">{formatCurrency(projectedAppreciation)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-white/60">Down payment</p>
          <p className="text-lg">{formatCurrency(summary.downPaymentAmount)}</p>
        </div>
      </div>
      <div className="overflow-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Tenure</th>
              <th className="px-4 py-3 text-left">Rate</th>
              <th className="px-4 py-3 text-left">EMI</th>
            </tr>
          </thead>
          <tbody>
            {emiRows.slice(0, 6).map((row) => (
              <tr key={`${row.tenureYears}-${row.rate}`} className="border-t border-white/5">
                <td className="px-4 py-3">{row.tenureYears} yrs</td>
                <td className="px-4 py-3">{row.rate}%</td>
                <td className="px-4 py-3">{formatCurrency(row.emi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
