"use client";

import { useMemo, useState } from "react";
import { calculateAffordability, buildEmiTable, formatCurrency, emiFromLoan } from "@/lib/calculations";
import type { EmploymentType } from "@/lib/calculations";

const tenureBounds = { min: 15, max: 30 };
const downPaymentBounds = { min: 0.2, max: 0.5 };
const DEFAULT_EMPLOYMENT_TYPE: EmploymentType = "salaried";
const DEFAULT_MONTHLY_INCOME = 0;
const DEFAULT_EXISTING_EMIS = 0;
const DEFAULT_CO_INCOME = 60000;
const DEFAULT_CO_AGE = 30;
const DEFAULT_TENURE = 20;
const DEFAULT_DOWN_PAYMENT = 0.25;
const DEFAULT_INTEREST = 8.5;

const panelClass = "rounded-3xl border border-gray-200 bg-white shadow-sm";
const cardClass = "rounded-2xl border border-gray-200 bg-white";
const labelClass = "text-sm font-medium text-gray-700";
const helperTextClass = "text-xs text-gray-500";
const inputBaseClass = "mt-1 w-full rounded-lg px-3 py-2 text-sm placeholder:opacity-60 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 input-surface";
const checkboxClass = "h-5 w-5 rounded border input-surface text-sky-600 focus:ring-sky-500";

const tenureVariants = (selected: number) => {
  const variants = new Set<number>([selected]);
  variants.add(Math.max(tenureBounds.min, selected - 5));
  variants.add(Math.min(tenureBounds.max, selected + 5));
  variants.add(Math.max(tenureBounds.min, selected - 10));
  variants.add(Math.min(tenureBounds.max, selected + 10));
  return Array.from(variants).sort((a, b) => a - b);
};

const clampTenure = (value: number) => Math.min(tenureBounds.max, Math.max(tenureBounds.min, Math.round(value)));
const clampDownPayment = (value: number) => Math.min(downPaymentBounds.max, Math.max(downPaymentBounds.min, Number(value.toFixed(2))));

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(DEFAULT_MONTHLY_INCOME);
  const [existingEmis, setExistingEmis] = useState(DEFAULT_EXISTING_EMIS);
  const [hasCoApplicant, setHasCoApplicant] = useState(false);
  const [coApplicantIncome, setCoApplicantIncome] = useState(DEFAULT_CO_INCOME);
  const [coApplicantAge, setCoApplicantAge] = useState(DEFAULT_CO_AGE);
  const [tenureYears, setTenureYears] = useState(DEFAULT_TENURE);
  const [downPaymentPercent, setDownPaymentPercent] = useState(DEFAULT_DOWN_PAYMENT);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setFormError(null);
    setFormSuccess(null);
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setMonthlyIncome(DEFAULT_MONTHLY_INCOME);
    setExistingEmis(DEFAULT_EXISTING_EMIS);
    setHasCoApplicant(false);
    setCoApplicantIncome(DEFAULT_CO_INCOME);
    setCoApplicantAge(DEFAULT_CO_AGE);
    setTenureYears(DEFAULT_TENURE);
    setDownPaymentPercent(DEFAULT_DOWN_PAYMENT);
    setInterestRate(DEFAULT_INTEREST);
  };

  const affordabilityInput = useMemo(
    () => ({
      primaryIncome: monthlyIncome,
      coApplicantIncome: hasCoApplicant ? coApplicantIncome : 0,
      existingEmis,
      employmentType: DEFAULT_EMPLOYMENT_TYPE,
      hasYoungCoApplicant: hasCoApplicant && coApplicantAge <= 35,
      tenureYears,
      downPaymentPercent,
      interestRate,
    }),
    [monthlyIncome, hasCoApplicant, coApplicantIncome, existingEmis, coApplicantAge, tenureYears, downPaymentPercent, interestRate],
  );

  const summary = useMemo(() => calculateAffordability(affordabilityInput), [affordabilityInput]);

  const emiRows = useMemo(
    () => buildEmiTable(summary.eligibleLoanAmount, interestRate, tenureVariants(tenureYears)),
    [summary.eligibleLoanAmount, interestRate, tenureYears],
  );

  const analysisBullets = useMemo(() => {
    const downPaymentPct = Math.round(downPaymentPercent * 100);
    const bullets: string[] = [
      `Combined monthly income of ${formatCurrency(summary.totalIncome)} supports EMIs up to ${formatCurrency(summary.maxEligibleEmi)} with a ${(summary.foirApplied * 100).toFixed(0)}% FOIR.`,
      `At ${interestRate.toFixed(1)}% for ${tenureYears} years you can borrow approximately ${formatCurrency(summary.eligibleLoanAmount)}.`,
      `Plan for a ${downPaymentPct}% down payment (~${formatCurrency(summary.downPaymentAmount)}) to target a purchase budget of ${formatCurrency(summary.affordablePrice)}.`,
    ];
    if (hasCoApplicant) {
      bullets.splice(1, 0, `Co-applicant income of ${formatCurrency(coApplicantIncome)} at age ${coApplicantAge} keeps the FOIR boost active.`);
    } else {
      bullets.splice(1, 0, "Add a co-applicant under 35 to unlock an additional FOIR boost if needed.");
    }
    return bullets;
  }, [
    summary.totalIncome,
    summary.maxEligibleEmi,
    summary.foirApplied,
    interestRate,
    tenureYears,
    summary.eligibleLoanAmount,
    downPaymentPercent,
    summary.downPaymentAmount,
    summary.affordablePrice,
    hasCoApplicant,
    coApplicantIncome,
    coApplicantAge,
  ]);

  const handleExit = async () => {
    if (isSubmitting) return;

    clearMessages();

    const name = fullName.trim();
    const emailAddress = email.trim();
    const phone = phoneNumber.trim();

    if (!name || !emailAddress || !phone) {
      setFormError("Please share your name, email, and phone number before exiting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead: { name, email: emailAddress, phone },
          summary,
          loan: {
            tenureYears,
            downPaymentPercent,
            interestRate,
          },
        }),
      });

      if (!response.ok) {
        let errorMessage = "Unable to save your details right now. Please try again.";
        try {
          const data = await response.json();
          if (data?.error) {
            errorMessage = String(data.error);
          }
        } catch {
          // ignore JSON parsing issues so we can surface a generic error
        }
        throw new Error(errorMessage);
      }

      setFormSuccess("Thanks! We saved your details and will reach out soon.");
      resetForm();
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error while saving lead.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 pb-32 pt-12 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-surface px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-gray-700">
            Harihara Constructions
          </span>
          <h1 className="text-3xl font-bold text-black sm:text-5xl">
            Instant Affordability Snapshot
          </h1>
          <p className="max-w-3xl text-base text-gray-600">
            Enter your monthly gross salary and optional adjustments. We will estimate your maximum home loan eligibility and show EMI scenarios across popular tenures.
          </p>
        </header>

        <section className={panelClass}>
          <div className="flex flex-col gap-10 px-6 py-10 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-800">Tell us about your income</h2>
                  <p className="text-sm text-gray-600">
                    The more accurate the salary and existing commitments, the sharper the eligibility calculation. Start with your gross monthly salary and tweak the rest only if needed.
                  </p>
                </div>

                {(formError || formSuccess) && (
                  <div aria-live="polite" className="space-y-3">
                    {formError && (
                      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {formError}
                      </div>
                    )}
                    {formSuccess && (
                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {formSuccess}
                      </div>
                    )}
                  </div>
                )}

                <div className={`${cardClass} p-6`}>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Contact details</h3>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="fullName">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className={inputBaseClass}
                        value={fullName}
                        onChange={(event) => {
                          clearMessages();
                          setFullName(event.target.value);
                        }}
                        placeholder="Aditya Sharma"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={inputBaseClass}
                        value={email}
                        onChange={(event) => {
                          clearMessages();
                          setEmail(event.target.value);
                        }}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="phone">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className={inputBaseClass}
                        value={phoneNumber}
                        onChange={(event) => {
                          clearMessages();
                          setPhoneNumber(event.target.value);
                        }}
                        placeholder="98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className={`${cardClass} p-6`}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="monthlyIncome">
                        Monthly gross salary (₹)
                      </label>
                      <input
                        id="monthlyIncome"
                        type="number"
                        min={0}
                        className={inputBaseClass}
                        value={monthlyIncome}
                        onChange={(event) => {
                          clearMessages();
                          setMonthlyIncome(Number(event.target.value));
                        }}
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="existingEmis">
                        Existing EMIs (₹)
                      </label>
                      <input
                        id="existingEmis"
                        type="number"
                        min={0}
                        className={inputBaseClass}
                        value={existingEmis}
                        onChange={(event) => {
                          clearMessages();
                          setExistingEmis(Math.max(0, Number(event.target.value)));
                        }}
                      />
                      <p className={helperTextClass}>Leave this as 0 if you have no active loans.</p>
                    </div>
                  </div>
                </div>

                <div className={`${cardClass} p-6 space-y-4`}>
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={hasCoApplicant}
                      onChange={(event) => {
                        clearMessages();
                        setHasCoApplicant(event.target.checked);
                      }}
                      className={checkboxClass}
                    />
                    Include a co-applicant (optional)
                  </label>

                  {hasCoApplicant && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass} htmlFor="coIncome">
                          Co-applicant income (₹)
                        </label>
                        <input
                          id="coIncome"
                          type="number"
                          min={0}
                          className={inputBaseClass}
                          value={coApplicantIncome}
                          onChange={(event) => {
                            clearMessages();
                            setCoApplicantIncome(Math.max(0, Number(event.target.value)));
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="coAge">
                          Co-applicant age
                        </label>
                        <input
                          id="coAge"
                          type="number"
                          min={21}
                          max={60}
                          className={inputBaseClass}
                          value={coApplicantAge}
                          onChange={(event) => {
                            clearMessages();
                            setCoApplicantAge(Math.max(21, Math.min(60, Number(event.target.value))));
                          }}
                        />
                        <p className={helperTextClass}>≤ 35 years unlocks a FOIR bonus.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`${cardClass} p-6 space-y-6`}>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Loan assumptions</h3>
                    <p className="text-sm text-slate-400">
                      Adjust the knobs if you want to test different tenures, interest rates or down payment plans.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelClass} htmlFor="tenure">
                        Tenure ({tenureYears} years)
                      </label>
                      <input
                        id="tenure"
                        type="range"
                        min={tenureBounds.min}
                        max={tenureBounds.max}
                        step={1}
                        value={tenureYears}
                        onChange={(event) => {
                          clearMessages();
                          setTenureYears(clampTenure(Number(event.target.value)));
                        }}
                        className="mt-2 w-full accent-[#5d8bff]"
                      />
                      <div className="mt-2 flex justify-between text-xs uppercase tracking-wide text-slate-500">
                        <span>{tenureBounds.min} yrs</span>
                        <span>{tenureBounds.max} yrs</span>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="downPayment">
                        Down payment ({Math.round(downPaymentPercent * 100)}%)
                      </label>
                      <input
                        id="downPayment"
                        type="range"
                        min={downPaymentBounds.min}
                        max={downPaymentBounds.max}
                        step={0.05}
                        value={downPaymentPercent}
                        onChange={(event) => {
                          clearMessages();
                          setDownPaymentPercent(clampDownPayment(Number(event.target.value)));
                        }}
                        className="mt-2 w-full accent-[#5d8bff]"
                      />
                      <div className="mt-2 flex justify-between text-xs uppercase tracking-wide text-slate-500">
                        <span>20%</span>
                        <span>50%</span>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="interestRate">
                        Expected interest rate (p.a)
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          id="interestRate"
                          type="number"
                          min={5}
                          max={15}
                          step={0.1}
                          className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                          value={interestRate}
                          onChange={(event) => {
                            clearMessages();
                            setInterestRate(Number(event.target.value));
                          }}
                        />
                        <p className="text-sm text-gray-600">Most banks quote ~8.4% to 9.1% today.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`${cardClass} p-6 shadow-md`}>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Eligibility at a glance</h2>
                  <div className="mt-5 grid gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Maximum loan eligibility</p>
                      <p className="mt-2 text-2xl font-semibold text-sky-700">{formatCurrency(summary.eligibleLoanAmount)}</p>
                      <p className={helperTextClass}>Assuming {tenureYears}-year tenure at {interestRate.toFixed(1)}%.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Target property budget</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(summary.affordablePrice)}</p>
                        <p className={helperTextClass}>Includes down payment of {formatCurrency(summary.downPaymentAmount)}.</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Indicative EMI capacity</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(summary.maxEligibleEmi)}</p>
                        <p className={helperTextClass}>FOIR applied: {(summary.foirApplied * 100).toFixed(0)}%.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${cardClass} p-6`}> 
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">EMI (selected tenure)</h3>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="rounded-lg border border-gray-100 bg-surface p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 uppercase">Tenure</div>
                          <div className="text-lg font-semibold text-gray-900">{tenureYears} years</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 uppercase">Down payment</div>
                          <div className="text-lg font-semibold text-gray-900">{Math.round(downPaymentPercent * 100)}%</div>
                        </div>
                      </div>
                      <div className="mt-3 border-t pt-3">
                        <div className="text-xs text-gray-500 uppercase">Indicative EMI at {interestRate.toFixed(2)}%</div>
                        <div className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(emiFromLoan(summary.eligibleLoanAmount, interestRate, tenureYears))}</div>
                        <p className={`${helperTextClass} mt-2`}>This estimate assumes you borrow {formatCurrency(summary.eligibleLoanAmount)} over {tenureYears} years.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${cardClass} p-6`}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Analysis</h3>
                  <div className="mt-4 grid gap-4">
                    {/* Simple visual metrics */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">Eligible loan amount</div>
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(summary.eligibleLoanAmount)}</div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-3 bg-sky-600"
                          style={{ width: `${Math.min(100, (summary.eligibleLoanAmount / Math.max(1, summary.affordablePrice)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">Indicative EMI capacity</div>
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(summary.maxEligibleEmi)}</div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-3 bg-emerald-500"
                          style={{ width: `${Math.min(100, (summary.maxEligibleEmi / Math.max(1, summary.totalIncome)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">Down payment</div>
                        <div className="text-sm font-semibold text-gray-900">{Math.round(downPaymentPercent * 100)}%</div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-3 bg-indigo-500" style={{ width: `${Math.round(downPaymentPercent * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleExit}
                    disabled={isSubmitting}
                    className={`rounded-full border border-gray-300 bg-white px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm transition ${isSubmitting ? "cursor-not-allowed opacity-60" : "hover:bg-gray-100"}`}
                  >
                    {isSubmitting ? "Saving..." : "Save & Exit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
