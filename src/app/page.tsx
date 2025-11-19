"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { properties as fallbackProperties } from "@/data/properties";
import type { Property } from "@/data/properties";
import {
  AffordabilityBreakdown,
  calculateAffordability,
  buildEmiTable,
  formatCurrency,
  matchProperties,
} from "@/lib/calculations";
import type { PropertyMatch } from "@/lib/calculations";

const whatsappNumber = "917676767676";
const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tenureBounds = { min: 15, max: 30 };
const downPaymentBounds = { min: 0.2, max: 0.5 };

const stepLabels = ["Lead details", "Income profile", "Loan structure", "Results"] as const;
type Step = 0 | 1 | 2 | 3;

interface LeadDetails {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

interface IncomeDetails {
  employmentType: "salaried" | "self-employed";
  monthlyIncome: number;
  existingEmis: number;
  age: number;
  hasCoApplicant: boolean;
  coApplicantIncome: number;
  coApplicantAge: number;
}

interface LoanPreferences {
  tenureYears: number;
  downPaymentPercent: number;
  interestRate: number;
}

const createInitialLead = (): LeadDetails => ({
  name: "",
  phone: "",
  email: "",
  consent: false,
});

const createInitialIncome = (): IncomeDetails => ({
  employmentType: "salaried",
  monthlyIncome: 85000,
  existingEmis: 0,
  age: 30,
  hasCoApplicant: false,
  coApplicantIncome: 0,
  coApplicantAge: 28,
});

const createInitialLoan = (): LoanPreferences => ({
  tenureYears: 20,
  downPaymentPercent: 0.25,
  interestRate: 8.5,
});

const clampTenure = (value: number) => Math.min(tenureBounds.max, Math.max(tenureBounds.min, Math.round(value)));
const clampDownPayment = (value: number) => {
  const clamped = Math.min(downPaymentBounds.max, Math.max(downPaymentBounds.min, value));
  return Number(clamped.toFixed(2));
};

const tenureVariants = (selected: number) => {
  const variants = new Set([15, 20, 25, 30, selected]);
  return Array.from(variants).sort((a, b) => a - b);
};

const getWhatsappLink = (
  lead: LeadDetails,
  summary: AffordabilityBreakdown,
  spotlightProperty?: PropertyMatch<Property>,
) => {
  const intro = lead.name ? `Hi, I'm ${lead.name}` : "Hi";
  const propertyLine = spotlightProperty
    ? ` I'm particularly interested in ${spotlightProperty.property.name} at ${formatCurrency(spotlightProperty.property.price)}.`
    : "";
  const message = `${intro}. I just completed the Harihara affordability check. Eligible loan ${formatCurrency(
    summary.eligibleLoanAmount,
  )} and target budget ${formatCurrency(summary.affordablePrice)}.${propertyLine} Could we schedule a site visit?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const mapDocumentToProperty = (doc: unknown): Property | null => {
  if (!doc || typeof doc !== "object") return null;
  const record = doc as Record<string, unknown> & { $id?: string; id?: string };
  if (typeof record.name !== "string" || typeof record.location !== "string") return null;
  if (typeof record.price !== "number") return null;

  const highlights = Array.isArray(record.highlights)
    ? (record.highlights as unknown[]).filter((item): item is string => typeof item === "string")
    : [];

  const generatedId = (() => {
    if (typeof record.$id === "string") return record.$id;
    if (typeof record.id === "string") return record.id;
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  })();

  return {
    id: generatedId,
    name: record.name,
    location: record.location,
    configuration: typeof record.configuration === "string" ? record.configuration : "",
    price: record.price,
    carpetArea: typeof record.carpetArea === "string" ? record.carpetArea : "",
    possession: typeof record.possession === "string" ? record.possession : "",
    highlights: highlights.length > 0 ? highlights : [],
    imageUrl: typeof record.imageUrl === "string" ? record.imageUrl : "",
    whatsappNumber: typeof record.whatsappNumber === "string" ? record.whatsappNumber : whatsappNumber,
    detailsUrl: typeof record.detailsUrl === "string" ? record.detailsUrl : "",
  };
};

interface ValidationResult {
  summary: string[];
  fields: Partial<Record<string, string>>;
}

const emptyValidation: ValidationResult = { summary: [], fields: {} };

const makeErrorList = (
  step: Step,
  lead: LeadDetails,
  income: IncomeDetails,
  loan: LoanPreferences,
): ValidationResult => {
  const summary: string[] = [];
  const fields: ValidationResult["fields"] = {};
  const totalIncome = income.monthlyIncome + (income.hasCoApplicant ? income.coApplicantIncome : 0);

  if (step === 0) {
    if (!lead.name.trim()) {
      const message = "Please enter the buyer name.";
      summary.push(message);
      fields.name = message;
    }
    if (!phoneRegex.test(lead.phone)) {
      const message = "Enter a 10 digit Indian phone number starting with 6-9.";
      summary.push(message);
      fields.phone = message;
    }
    if (!emailRegex.test(lead.email)) {
      const message = "Enter a valid email address.";
      summary.push(message);
      fields.email = message;
    }
    if (!lead.consent) {
      const message = "Consent is required to proceed.";
      summary.push(message);
      fields.consent = message;
    }
  }

  if (step === 1) {
    if (income.monthlyIncome < 15000) {
      const message = "Monthly income must be at least ₹15,000.";
      summary.push(message);
      fields.monthlyIncome = message;
    }
    if (income.existingEmis < 0) {
      const message = "Existing EMIs cannot be negative.";
      summary.push(message);
      fields.existingEmis = message;
    }
    if (income.age < 23 || income.age > 60) {
      const message = "Primary applicant age must be between 23 and 60.";
      summary.push(message);
      fields.age = message;
    }
    if (income.existingEmis > totalIncome * 0.8) {
      const message = "Existing EMIs should not exceed 80% of combined income.";
      summary.push(message);
      fields.existingEmis = message;
    }
    if (income.hasCoApplicant) {
      if (income.coApplicantIncome <= 0) {
        const message = "Add co-applicant income or remove the co-applicant.";
        summary.push(message);
        fields.coApplicantIncome = message;
      }
      if (income.coApplicantAge < 21 || income.coApplicantAge > 60) {
        const message = "Co-applicant age must be between 21 and 60.";
        summary.push(message);
        fields.coApplicantAge = message;
      }
    }
  }

  if (step === 2) {
    if (loan.tenureYears + income.age > 70) {
      const message = "Age plus tenure should not exceed 70 years.";
      summary.push(message);
      fields.tenureYears = message;
    }
    if (loan.interestRate <= 0 || loan.interestRate > 15) {
      const message = "Set a realistic annual interest rate (0.1% - 15%).";
      summary.push(message);
      fields.interestRate = message;
    }
  }

  return { summary, fields };
};

export default function Home() {
  const [step, setStep] = useState<Step>(0);
  const [lead, setLead] = useState<LeadDetails>(() => createInitialLead());
  const [income, setIncome] = useState<IncomeDetails>(() => createInitialIncome());
  const [loan, setLoan] = useState<LoanPreferences>(() => createInitialLoan());
  const [errors, setErrors] = useState<ValidationResult>(emptyValidation);
  const [propertyList, setPropertyList] = useState<Property[]>(fallbackProperties);
  const [leadSynced, setLeadSynced] = useState(false);
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadSyncError, setLeadSyncError] = useState<string | null>(null);

  const prefersReducedMotion = useReducedMotion();

  const resetFlow = () => {
    setLead(createInitialLead());
    setIncome(createInitialIncome());
    setLoan(createInitialLoan());
    setErrors(emptyValidation);
    setLeadSynced(false);
    setLeadSaving(false);
    setLeadSyncError(null);
    setStep(0);
  };

  const markLeadDirty = () => {
    if (leadSynced) {
      setLeadSynced(false);
    }
    if (leadSyncError) {
      setLeadSyncError(null);
    }
  };

  const calcInput = useMemo(() => ({
    primaryIncome: income.monthlyIncome,
    coApplicantIncome: income.hasCoApplicant ? income.coApplicantIncome : 0,
    existingEmis: income.existingEmis,
    employmentType: income.employmentType,
    hasYoungCoApplicant: income.hasCoApplicant && income.coApplicantAge <= 35,
    tenureYears: loan.tenureYears,
    downPaymentPercent: loan.downPaymentPercent,
    interestRate: loan.interestRate,
  }), [income, loan]);

  const summary = useMemo<AffordabilityBreakdown>(() => calculateAffordability(calcInput), [calcInput]);
  const propertyMatches = useMemo(
    () => matchProperties(propertyList, summary.affordablePrice, 9),
    [propertyList, summary.affordablePrice],
  );

  const spotlightProperty = propertyMatches[0];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }
        const payload = await response.json();
        if (Array.isArray(payload.properties)) {
          const mapped = payload.properties
            .map(mapDocumentToProperty)
            .filter((property: Property | null): property is Property => property !== null);
          if (mapped.length > 0) {
            setPropertyList(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to load properties from Appwrite", error);
      }
    };

    fetchProperties().catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (step !== 3 || leadSynced || leadSaving) {
      return;
    }

    let cancelled = false;

    const syncLead = async () => {
      try {
        setLeadSaving(true);
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lead: {
              name: lead.name.trim(),
              phone: lead.phone,
              email: lead.email,
              consent: lead.consent,
            },
            summary: {
              eligibleLoanAmount: summary.eligibleLoanAmount,
              affordablePrice: summary.affordablePrice,
              maxEligibleEmi: summary.maxEligibleEmi,
              foirApplied: summary.foirApplied,
            },
            loan: {
              tenureYears: loan.tenureYears,
              downPaymentPercent: loan.downPaymentPercent,
              interestRate: loan.interestRate,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Lead sync failed with status ${response.status}`);
        }

        if (!cancelled) {
          setLeadSynced(true);
          setLeadSyncError(null);
        }
      } catch (error) {
        console.error("Lead sync failed", error);
        if (!cancelled) {
          setLeadSyncError("Could not sync lead to CRM. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLeadSaving(false);
        }
      }
    };

    syncLead().catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [
    step,
    leadSynced,
    leadSaving,
    lead.name,
    lead.phone,
    lead.email,
    lead.consent,
    loan.tenureYears,
    loan.downPaymentPercent,
    loan.interestRate,
    summary.eligibleLoanAmount,
    summary.affordablePrice,
    summary.maxEligibleEmi,
    summary.foirApplied,
  ]);

  const emiRows = useMemo(
    () => buildEmiTable(summary.eligibleLoanAmount, loan.interestRate, tenureVariants(loan.tenureYears)),
    [summary.eligibleLoanAmount, loan.interestRate, loan.tenureYears],
  );

  const handleNext = () => {
    const stepErrors = makeErrorList(step, lead, income, loan);
    setErrors(stepErrors);
    if (stepErrors.summary.length === 0 && step < 3) {
      setStep((prev) => {
        const nextStep = (prev + 1) as Step;
        if (nextStep >= 3) {
          setLeadSynced(false);
        }
        return nextStep;
      });
    }
  };

  const handleBack = () => {
    setErrors(emptyValidation);
    setStep((prev) => {
      const nextStep = Math.max(0, prev - 1) as Step;
      if (nextStep < 3) {
        setLeadSynced(false);
      }
      return nextStep;
    });
  };

  const handleExit = () => {
    resetFlow();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/3">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 pb-24 pt-10 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Harihara Constructions</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Home Affordability Calculator</h1>
          <p className="max-w-3xl text-base text-slate-600">
            Complete the guided four-step journey to receive a bank-aligned purchase budget and instantly view curated Harihara properties that fit your eligibility. The flow is optimized to finish in under a minute.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <ol className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
              {stepLabels.map((label, index) => {
                const isActive = index === step;
                const isCompleted = index < step;
                return (
                  <li key={label} className={`flex items-center gap-2 ${isActive ? "text-blue-700" : isCompleted ? "text-emerald-600" : "text-slate-400"}`}>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${isActive ? "border-blue-700 bg-blue-50" : isCompleted ? "border-emerald-600 bg-emerald-50" : "border-slate-300 bg-white"}`}>
                      {index + 1}
                    </span>
                    {label}
                    {index < stepLabels.length - 1 && (
                      <span className="hidden sm:inline" aria-hidden>
                        {">"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="px-6 py-8">
            {errors.summary.length > 0 && (
              <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Please review and update:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {errors.summary.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -16 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
              >
                {step === 0 && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="name">Primary applicant name</label>
                      <input
                        id="name"
                        type="text"
                        aria-invalid={Boolean(errors.fields.name)}
                        aria-describedby={errors.fields.name ? "error-name" : undefined}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.fields.name ? "border-rose-400" : "border-slate-200"}`}
                        value={lead.name}
                        onChange={(event) => {
                          markLeadDirty();
                          setLead((prev) => ({ ...prev, name: event.target.value }));
                        }}
                        placeholder="e.g. Harihara Kumar"
                      />
                      {errors.fields.name && (
                        <p id="error-name" className="mt-1 text-xs text-rose-600">
                          {errors.fields.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="phone">Mobile number</label>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        aria-invalid={Boolean(errors.fields.phone)}
                        aria-describedby={errors.fields.phone ? "error-phone" : undefined}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.fields.phone ? "border-rose-400" : "border-slate-200"}`}
                        value={lead.phone}
                        onChange={(event) => {
                          markLeadDirty();
                          setLead((prev) => ({ ...prev, phone: event.target.value.replace(/[^0-9]/g, "") }));
                        }}
                        placeholder="9876543210"
                      />
                      {errors.fields.phone && (
                        <p id="error-phone" className="mt-1 text-xs text-rose-600">
                          {errors.fields.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="email">Work email</label>
                      <input
                        id="email"
                        type="email"
                        aria-invalid={Boolean(errors.fields.email)}
                        aria-describedby={errors.fields.email ? "error-email" : undefined}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.fields.email ? "border-rose-400" : "border-slate-200"}`}
                        value={lead.email}
                        onChange={(event) => {
                          markLeadDirty();
                          setLead((prev) => ({ ...prev, email: event.target.value }));
                        }}
                        placeholder="you@company.com"
                      />
                      {errors.fields.email && (
                        <p id="error-email" className="mt-1 text-xs text-rose-600">
                          {errors.fields.email}
                        </p>
                      )}
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="mb-2 font-semibold text-slate-700">60-second experience</p>
                      <p>We use your details to assign a relationship manager and send the affordability snapshot.</p>
                    </div>
                    <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={lead.consent}
                        onChange={(event) => {
                          markLeadDirty();
                          setLead((prev) => ({ ...prev, consent: event.target.checked }));
                        }}
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>I consent to Harihara Constructions contacting me via phone, email, or WhatsApp for project information.</span>
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Employment type</label>
                      <div className="flex gap-3">
                        {["salaried", "self-employed"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${income.employmentType === type ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                            onClick={() => {
                              markLeadDirty();
                              setIncome((prev) => ({ ...prev, employmentType: type as IncomeDetails["employmentType"] }));
                            }}
                          >
                            {type.replace("-", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="monthlyIncome">Monthly take-home (₹)</label>
                      <input
                        id="monthlyIncome"
                        type="number"
                        min={0}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={income.monthlyIncome}
                        onChange={(event) => {
                          markLeadDirty();
                          setIncome((prev) => ({ ...prev, monthlyIncome: Number(event.target.value) }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="existingEmis">Existing monthly EMIs (₹)</label>
                      <input
                        id="existingEmis"
                        type="number"
                        min={0}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={income.existingEmis}
                        onChange={(event) => {
                          markLeadDirty();
                          setIncome((prev) => ({ ...prev, existingEmis: Number(event.target.value) }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="age">Applicant age</label>
                      <input
                        id="age"
                        type="number"
                        min={18}
                        max={65}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={income.age}
                        onChange={(event) => {
                          markLeadDirty();
                          setIncome((prev) => ({ ...prev, age: Number(event.target.value) }));
                        }}
                      />
                    </div>

                    <label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={income.hasCoApplicant}
                        onChange={(event) => {
                          markLeadDirty();
                          setIncome((prev) => ({
                            ...prev,
                            hasCoApplicant: event.target.checked,
                            coApplicantIncome: event.target.checked ? prev.coApplicantIncome || 60000 : 0,
                          }));
                        }}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Add a co-applicant (boosts FOIR if under 35)
                    </label>

                    {income.hasCoApplicant && (
                      <div className="sm:col-span-2 grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-slate-700" htmlFor="coIncome">Co-applicant monthly income (₹)</label>
                          <input
                            id="coIncome"
                            type="number"
                            min={0}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={income.coApplicantIncome}
                            onChange={(event) => {
                              markLeadDirty();
                              setIncome((prev) => ({ ...prev, coApplicantIncome: Number(event.target.value) }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700" htmlFor="coAge">Co-applicant age</label>
                          <input
                            id="coAge"
                            type="number"
                            min={21}
                            max={60}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={income.coApplicantAge}
                            onChange={(event) => {
                              markLeadDirty();
                              setIncome((prev) => ({ ...prev, coApplicantAge: Number(event.target.value) }));
                            }}
                          />
                          <p className="mt-1 text-xs text-slate-500">Young co-applicants (≤ 35 years) unlock a FOIR boost.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="tenure">Desired tenure (years)</label>
                      <input
                        id="tenure"
                        type="range"
                        min={tenureBounds.min}
                        max={tenureBounds.max}
                        step={1}
                        value={loan.tenureYears}
                        onChange={(event) => {
                          markLeadDirty();
                          setLoan((prev) => ({ ...prev, tenureYears: clampTenure(Number(event.target.value)) }));
                        }}
                        className="mt-2 w-full"
                      />
                      <div className="mt-2 flex justify-between text-xs uppercase tracking-wide text-slate-500">
                        <span>{tenureBounds.min} yrs</span>
                        <span className="text-sm font-semibold text-blue-600">{loan.tenureYears} yrs</span>
                        <span>{tenureBounds.max} yrs</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700" htmlFor="downPayment">Down payment</label>
                      <input
                        id="downPayment"
                        type="range"
                        min={downPaymentBounds.min}
                        max={downPaymentBounds.max}
                        step={0.05}
                        value={loan.downPaymentPercent}
                        onChange={(event) => {
                          markLeadDirty();
                          setLoan((prev) => ({ ...prev, downPaymentPercent: clampDownPayment(Number(event.target.value)) }));
                        }}
                        className="mt-2 w-full"
                      />
                      <div className="mt-2 flex justify-between text-xs uppercase tracking-wide text-slate-500">
                        <span>20%</span>
                        <span className="text-sm font-semibold text-blue-600">{Math.round(loan.downPaymentPercent * 100)}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="interestRate">Expected interest rate (p.a)</label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          id="interestRate"
                          type="number"
                          min={5}
                          max={15}
                          step={0.1}
                          className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={loan.interestRate}
                          onChange={(event) => {
                            markLeadDirty();
                            setLoan((prev) => ({ ...prev, interestRate: Number(event.target.value) }));
                          }}
                        />
                        <p className="text-sm text-slate-500">Most banks currently quote 8.4% - 9.1%.</p>
                      </div>
                    </div>
                    <div className="sm:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                      <p className="font-semibold">FOIR primer</p>
                      <p className="mt-1">Fixed Obligation to Income Ratio determines the portion of surplus income that can be used for EMIs. Harihara aligns with partner banks for accurate pre-qualification.</p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    {(leadSaving || leadSyncError) && (
                      <div className={`rounded-xl border p-4 text-sm ${leadSyncError ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                        {leadSyncError ?? "Syncing your affordability snapshot with the Harihara CRM..."}
                      </div>
                    )}

                    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
                      <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Affordability summary</h2>
                        <div className="mt-4 space-y-3 text-sm">
                          <p className="flex justify-between">
                            <span>Total monthly income</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(summary.totalIncome)}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Eligible FOIR</span>
                            <span className="font-semibold text-slate-900">{(summary.foirApplied * 100).toFixed(0)}%</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Max EMI capacity</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(summary.maxEligibleEmi)}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Loan eligibility (@ {loan.interestRate.toFixed(2)}%)</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(summary.eligibleLoanAmount)}</span>
                          </p>
                          <p className="flex justify-between text-base font-semibold text-blue-700">
                            <span>Target purchase budget</span>
                            <span>{formatCurrency(summary.affordablePrice)}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Indicative down payment</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(summary.downPaymentAmount)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/60 bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">EMI scenarios</h3>
                        <div className="mt-3 max-h-64 overflow-y-auto">
                          <table className="min-w-full text-left text-xs text-slate-600">
                            <thead className="sticky top-0 bg-white text-slate-500">
                              <tr>
                                <th className="px-2 py-1">Tenure</th>
                                <th className="px-2 py-1">Rate</th>
                                <th className="px-2 py-1">Monthly EMI</th>
                              </tr>
                            </thead>
                            <tbody>
                              {emiRows.map((row) => (
                                <tr key={`${row.tenureYears}-${row.rate}`} className="odd:bg-slate-50">
                                  <td className="px-2 py-1 font-medium text-slate-800">{row.tenureYears} yrs</td>
                                  <td className="px-2 py-1">{row.rate.toFixed(2)}%</td>
                                  <td className="px-2 py-1 font-semibold text-slate-900">{formatCurrency(row.emi)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Fine-tune rate and tenure in Step 3 to re-run the scenarios.</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Recommended properties</h2>
                        <span className="text-sm text-slate-500">{propertyMatches.length} matches</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">Projects within the affordability envelope based on current assumptions. Save or request a virtual walkthrough instantly.</p>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {propertyMatches.map(({ property, fitLabel, ctaMessage }) => {
                          const badgeClass =
                            fitLabel === "Fits budget"
                              ? "bg-emerald-100 text-emerald-700"
                              : fitLabel === "Stretch"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-200 text-slate-700";
                          const isSpotlight = spotlightProperty?.property.id === property.id;
                          return (
                            <article
                              key={property.id}
                              className={`flex h-full flex-col rounded-2xl border bg-white shadow-sm transition ${isSpotlight ? "border-blue-400 shadow-lg shadow-blue-100" : "border-slate-200"}`}
                            >
                              <div className="h-32 w-full overflow-hidden rounded-t-2xl bg-gradient-to-tr from-blue-200 to-blue-50" aria-hidden />
                              <div className="flex flex-1 flex-col gap-3 p-4 text-sm text-slate-600">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="text-base font-semibold text-slate-900">{property.name}</h3>
                                    <p>{property.location}</p>
                                  </div>
                                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                                    {fitLabel}
                                  </span>
                                </div>
                                <p className="font-semibold text-slate-900">{formatCurrency(property.price)}</p>
                                <p>{property.configuration} • {property.carpetArea}</p>
                                <p className="text-xs uppercase tracking-wide text-slate-400">Key highlights</p>
                                <ul className="space-y-1 text-xs">
                                  {property.highlights.slice(0, 3).map((highlight: string) => (
                                    <li key={highlight}>• {highlight}</li>
                                  ))}
                                </ul>
                                <div className="mt-auto flex flex-wrap gap-2 text-xs">
                                  <Link
                                    href={property.detailsUrl}
                                    target="_blank"
                                    className="inline-flex items-center rounded-full border border-blue-200 px-3 py-1 font-medium text-blue-700 hover:bg-blue-50"
                                  >
                                    View details
                                  </Link>
                                  <a
                                    href={`https://wa.me/${property.whatsappNumber}?text=${encodeURIComponent(ctaMessage)}`}
                                    target="_blank"
                                    className="inline-flex items-center rounded-full border border-emerald-200 px-3 py-1 font-medium text-emerald-700 hover:bg-emerald-50"
                                  >
                                    WhatsApp RM
                                  </a>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                Step {step + 1} of {stepLabels.length}
              </div>
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-end">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={step === 3 ? handleExit : handleBack}
                    className="rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
                  >
                    {step === 3 ? "Exit" : "Back"}
                  </button>
                )}
                {step < 3 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Ready for a guided walkthrough?</span> Share your snapshot with our WhatsApp concierge.
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={getWhatsappLink(lead, summary, spotlightProperty)}
              target="_blank"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Send WhatsApp summary
            </a>
            <button
              type="button"
              onClick={() => {
                if (step < 3) {
                  const stepErrors = makeErrorList(step, lead, income, loan);
                  setErrors(stepErrors);
                  if (stepErrors.summary.length === 0) {
                    setLeadSynced(false);
                    setStep(3);
                  }
                }
              }}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300"
            >
              Jump to results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
