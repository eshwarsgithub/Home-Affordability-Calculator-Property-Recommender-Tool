"use client";

import type { EmploymentType, IncomeDetails, ValidationErrors } from "@/types";

interface IncomeDetailsFormProps {
  data: IncomeDetails;
  errors: ValidationErrors;
  onChange: (field: keyof IncomeDetails, value: IncomeDetails[keyof IncomeDetails]) => void;
}

const employmentOptions: EmploymentType[] = ["Salaried", "Self-Employed"];

export function IncomeDetailsForm({ data, errors, onChange }: IncomeDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="field-label">Employment type</p>
        <div className="grid grid-cols-2 gap-3">
          {employmentOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange("employmentType", option)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                data.employmentType === option
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="monthlyIncome">
            Monthly household income (₹)
          </label>
          <input
            id="monthlyIncome"
            type="number"
            min={0}
            step={1000}
            value={data.monthlyIncome || ""}
            onChange={(e) => onChange("monthlyIncome", Number(e.target.value))}
            placeholder="1,20,000"
            className="field-input"
          />
          {errors["income.monthlyIncome"] && (
            <p className="field-error">{errors["income.monthlyIncome"]}</p>
          )}
        </div>

        <div>
          <label className="field-label" htmlFor="existingEmis">
            Existing EMIs (₹)
          </label>
          <input
            id="existingEmis"
            type="number"
            min={0}
            step={1000}
            value={data.existingEmis || ""}
            onChange={(e) => onChange("existingEmis", Number(e.target.value))}
            placeholder="25,000"
            className="field-input"
          />
          {errors["income.existingEmis"] && (
            <p className="field-error">{errors["income.existingEmis"]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="age">
            Your age
          </label>
          <input
            id="age"
            type="number"
            min={21}
            max={65}
            value={data.age || ""}
            onChange={(e) => onChange("age", Number(e.target.value))}
            className="field-input"
          />
          {errors["income.age"] && <p className="field-error">{errors["income.age"]}</p>}
        </div>
        <div>
          <label className="field-label">Co-applicant</label>
          <button
            type="button"
            onClick={() => onChange("includeCoApplicant", !data.includeCoApplicant)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              data.includeCoApplicant
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {data.includeCoApplicant ? "Yes, include" : "No co-applicant"}
          </button>
        </div>
      </div>

      {data.includeCoApplicant && (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-sm font-semibold text-emerald-900">Co-applicant details</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="coIncome">
                Monthly income (₹)
              </label>
              <input
                id="coIncome"
                type="number"
                min={0}
                step={1000}
                value={data.coApplicantIncome || ""}
                onChange={(e) => onChange("coApplicantIncome", Number(e.target.value))}
                className="field-input"
              />
              {errors["income.coApplicantIncome"] && (
                <p className="field-error">{errors["income.coApplicantIncome"]}</p>
              )}
            </div>
            <div>
              <label className="field-label" htmlFor="coAge">
                Age
              </label>
              <input
                id="coAge"
                type="number"
                min={21}
                max={65}
                value={data.coApplicantAge || ""}
                onChange={(e) => onChange("coApplicantAge", Number(e.target.value))}
                className="field-input"
              />
              {errors["income.coApplicantAge"] && (
                <p className="field-error">{errors["income.coApplicantAge"]}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
