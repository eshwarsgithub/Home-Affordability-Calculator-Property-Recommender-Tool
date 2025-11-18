"use client";

import { DOWN_PAYMENT_RANGE, TENURE_RANGE } from "@/lib/constants";
import type { LoanPreferences, ValidationErrors } from "@/types";

interface LoanPreferencesFormProps {
  data: LoanPreferences;
  errors: ValidationErrors;
  onChange: (field: keyof LoanPreferences, value: number) => void;
}

export function LoanPreferencesForm({ data, errors, onChange }: LoanPreferencesFormProps) {
  const tenurePercent = ((data.tenureYears - TENURE_RANGE.min) / (TENURE_RANGE.max - TENURE_RANGE.min)) * 100;
  const downPaymentPercent =
    ((data.downPaymentPercent - DOWN_PAYMENT_RANGE.min) / (DOWN_PAYMENT_RANGE.max - DOWN_PAYMENT_RANGE.min)) * 100;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <label className="field-label" htmlFor="tenure">
            Preferred tenure ({data.tenureYears} yrs)
          </label>
          <span className="text-sm text-slate-500">{TENURE_RANGE.min}–{TENURE_RANGE.max} yrs</span>
        </div>
        <input
          id="tenure"
          type="range"
          min={TENURE_RANGE.min}
          max={TENURE_RANGE.max}
          value={data.tenureYears}
          onChange={(e) => onChange("tenureYears", Number(e.target.value))}
          className="range"
        />
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Shorter EMI, higher payout</span>
          <span>Longer EMI, lower EMI</span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-500"
            style={{ width: `${tenurePercent}%` }}
          />
        </div>
        {errors["loan.tenureYears"] && <p className="field-error">{errors["loan.tenureYears"]}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="field-label" htmlFor="downPayment">
            Down payment ({Math.round(data.downPaymentPercent * 100)}%)
          </label>
          <span className="text-sm text-slate-500">
            {Math.round(DOWN_PAYMENT_RANGE.min * 100)}–{Math.round(DOWN_PAYMENT_RANGE.max * 100)}%
          </span>
        </div>
        <input
          id="downPayment"
          type="range"
          min={DOWN_PAYMENT_RANGE.min}
          max={DOWN_PAYMENT_RANGE.max}
          step={0.01}
          value={data.downPaymentPercent}
          onChange={(e) => onChange("downPaymentPercent", Number(e.target.value))}
          className="range"
        />
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Lower upfront</span>
          <span>Higher upfront</span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-violet-500"
            style={{ width: `${downPaymentPercent}%` }}
          />
        </div>
        {errors["loan.downPaymentPercent"] && (
          <p className="field-error">{errors["loan.downPaymentPercent"]}</p>
        )}
      </div>
    </div>
  );
}
