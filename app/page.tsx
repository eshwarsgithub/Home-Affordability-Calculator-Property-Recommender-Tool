"use client";

import { useMemo, useState } from "react";
import { AffordabilitySummary } from "@/components/AffordabilitySummary";
import { IncomeDetailsForm } from "@/components/IncomeDetailsForm";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { LoanPreferencesForm } from "@/components/LoanPreferencesForm";
import { PropertyMatches } from "@/components/PropertyMatches";
import { StepIndicator } from "@/components/StepIndicator";
import { StickyWhatsappCTA } from "@/components/StickyWhatsappCTA";
import { calculateAffordability } from "@/lib/calculations";
import { STEPS } from "@/lib/constants";
import { getPropertyMatches } from "@/lib/property-match";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { validateIncome, validateLead, validateLoan } from "@/lib/validators";
import type {
  AffordabilityResult,
  FormState,
  PropertyMatch,
  ValidationErrors,
} from "@/types";
import { EmiTable } from "@/components/EmiTable";

const initialForm: FormState = {
  lead: {
    name: "",
    email: "",
    phone: "",
    consent: false,
  },
  income: {
    employmentType: "Salaried",
    monthlyIncome: 0,
    existingEmis: 0,
    age: 30,
    includeCoApplicant: false,
    coApplicantIncome: 0,
    coApplicantAge: 30,
  },
  loan: {
    tenureYears: 20,
    downPaymentPercent: 0.25,
  },
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const stepTitle = useMemo(() => {
    switch (currentStep) {
      case 0:
        return "Let\u2019s get to know you";
      case 1:
        return "Tell us about your income";
      case 2:
        return "Tune your loan preferences";
      default:
        return "Your affordability snapshot";
    }
  }, [currentStep]);

  const nextLabel = useMemo(() => {
    if (currentStep < 2) {
      return "Next";
    }
    if (currentStep === 2) {
      return isCalculating ? "Crunching numbers..." : "See my results";
    }
    return "Restart";
  }, [currentStep, isCalculating]);

  const isBusy = currentStep === 0 ? isSubmittingLead : currentStep === 2 ? isCalculating : false;

  const updateSection = <T extends keyof FormState>(
    section: T,
    field: keyof FormState[T],
    value: FormState[T][keyof FormState[T]],
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const resetFlow = () => {
    setForm(initialForm);
    setCurrentStep(0);
    setErrors({});
    setResult(null);
    setMatches([]);
    setLeadSubmitted(false);
    setStatusMessage(null);
  };

  const handleNext = async () => {
    if (currentStep >= STEPS.length - 1) {
      resetFlow();
      return;
    }

    const stepErrors = runValidation(currentStep);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    if (currentStep === 0 && !leadSubmitted) {
      setIsSubmittingLead(true);
      setStatusMessage("Saving lead securely...");
      try {
        await submitLead();
        setLeadSubmitted(true);
        setStatusMessage("Lead captured. Continue the flow.");
      } catch (error) {
        console.error("lead_error", error);
        setStatusMessage("Could not save details. Check your network and retry.");
        setIsSubmittingLead(false);
        return;
      }
      setIsSubmittingLead(false);
    }

    if (currentStep === 2) {
      setIsCalculating(true);
      setStatusMessage("Applying FOIR logic & matching homes...");
      const affordability = calculateAffordability(form);
      const matched = getPropertyMatches(
        affordability.affordablePrice,
        form.loan.downPaymentPercent,
        form.loan.tenureYears,
      );
      setResult(affordability);
      setMatches(matched);
      setIsCalculating(false);
      setStatusMessage("Done. Scroll to review your summary.");
    }

    setCurrentStep((prev) => prev + 1);
  };

  const submitLead = async () => {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form.lead,
        step: "harihara-tool",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("lead_submission_failed");
    }
  };

  const handleBack = () => {
    setErrors({});
    setStatusMessage(null);
    if (currentStep === STEPS.length - 1) {
      setResult(null);
      setMatches([]);
    }
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const runValidation = (step: number): ValidationErrors => {
    if (step === 0) {
      return validateLead(form.lead);
    }
    if (step === 1) {
      return validateIncome(form.income);
    }
    if (step === 2) {
      return validateLoan(form.loan, form.income.age);
    }
    return {};
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <LeadCaptureForm
          data={form.lead}
          errors={errors}
          onChange={(field, value) => updateSection("lead", field, value)}
        />
      );
    }

    if (currentStep === 1) {
      return (
        <IncomeDetailsForm
          data={form.income}
          errors={errors}
          onChange={(field, value) => updateSection("income", field, value)}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <LoanPreferencesForm
          data={form.loan}
          errors={errors}
          onChange={(field, value) => updateSection("loan", field, value)}
        />
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-lg font-semibold text-slate-800">You\u2019re all set!</p>
        <p className="text-sm text-slate-600">
          Complete every step to calculate your FOIR-backed budget and unlock curated Harihara homes.
        </p>
      </div>
    );
  };

  const whatsappLink = result
    ? buildWhatsappLink({ leadName: form.lead.name, result, topPick: matches[0] })
    : null;

  return (
    <div className="relative bg-slate-50 pb-32">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
        <header className="space-y-3 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Harihara Constructions
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Home Affordability Calculator & Property Match Engine
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Bank-grade FOIR logic + curated projects. Finish the 3-step flow and get personalised matches on WhatsApp in under a minute.
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
            <div className="space-y-8">
              <StepIndicator steps={STEPS} currentStep={currentStep} />

              <div className="space-y-3">
                <p className="text-xl font-semibold text-slate-900">{stepTitle}</p>
                <p className="text-sm text-slate-600">
                  {currentStep <= 2
                    ? "We only ask for what\u2019s required by partner banks. Your data is encrypted."
                    : "You\u2019re moments away from your property shortlist."}
                </p>
              </div>

              <div className="space-y-6">{renderStep()}</div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isBusy}
                  className="btn-primary"
                >
                  {nextLabel}
                </button>
              </div>
              {statusMessage && (
                <p className="text-sm text-slate-500">{statusMessage}</p>
              )}
            </div>
          </section>

          <aside className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Result Preview</p>
            {result ? (
              <div className="mt-4 space-y-3">
                <p className="text-3xl font-semibold text-slate-900">
                  ₹{(result.affordablePrice / 100000).toFixed(1)} Lakh budget
                </p>
                <p className="text-sm text-slate-600">
                  Max EMI ₹{result.eligibleEmi.toLocaleString("en-IN")}
                </p>
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    Share on WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-lg font-semibold text-slate-900">Awaiting inputs</p>
                <p className="text-sm text-slate-600">
                  Finish all steps to unlock FOIR-driven affordability numbers, EMI table, and personalised property matches.
                </p>
              </div>
            )}
          </aside>
        </div>

        {result && (
          <div className="mt-10 space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <AffordabilitySummary result={result} />
              <EmiTable scenarios={result.emiScenarios} />
            </div>
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Property Matches
                  </p>
                  <h3 className="text-2xl font-semibold text-slate-900">Handpicked Harihara units</h3>
                </div>
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700"
                  >
                    Send shortlist on WhatsApp
                  </a>
                )}
              </div>
              <div className="mt-6">
                <PropertyMatches properties={matches} />
              </div>
            </section>
          </div>
        )}
      </div>
      <StickyWhatsappCTA result={result} leadName={form.lead.name} matches={matches} />
    </div>
  );
}
