import {
  ANNUAL_INTEREST_RATE,
  HIGH_INCOME_THRESHOLD,
  LTV_LIMIT,
  MAX_FOIR,
  MIN_CO_APPLICANT_INCOME,
  YOUNG_CO_APPLICANT_AGE,
} from "@/lib/constants";
import type { AffordabilityResult, FormState, EmiScenario } from "@/types";

const scenarioRatios = [
  { label: "Comfort buy (70%)", ratio: 0.7 },
  { label: "Sweet spot (85%)", ratio: 0.85 },
  { label: "Max stretch (100%)", ratio: 1 },
];

export function calculateAffordability(form: FormState): AffordabilityResult {
  const coIncome = form.income.includeCoApplicant ? form.income.coApplicantIncome : 0;
  const totalIncome = form.income.monthlyIncome + coIncome;
  const surplus = totalIncome - form.income.existingEmis;

  let foir = form.income.employmentType === "Salaried" ? 0.5 : 0.45;
  if (
    form.income.includeCoApplicant &&
    form.income.coApplicantAge <= YOUNG_CO_APPLICANT_AGE &&
    form.income.coApplicantIncome >= MIN_CO_APPLICANT_INCOME
  ) {
    foir += 0.1;
  }
  if (totalIncome >= HIGH_INCOME_THRESHOLD) {
    foir += 0.05;
  }
  foir = Math.min(foir, MAX_FOIR);

  const eligibleEmi = Math.max(0, surplus * foir);
  const monthlyRate = ANNUAL_INTEREST_RATE / 12;
  const tenureMonths = form.loan.tenureYears * 12;
  const loanAmount = eligibleEmi > 0 ? calculateLoanFromEmi(eligibleEmi, monthlyRate, tenureMonths) : 0;

  const priceByLtv = loanAmount / LTV_LIMIT;
  const priceByDownPayment = loanAmount / (1 - form.loan.downPaymentPercent);
  const affordablePrice = Number.isFinite(Math.min(priceByLtv, priceByDownPayment))
    ? Math.min(priceByLtv, priceByDownPayment)
    : 0;

  const emiScenarios = buildEmiScenarios(
    affordablePrice,
    form.loan.downPaymentPercent,
    monthlyRate,
    tenureMonths,
  );

  const warnings: string[] = [];
  if (surplus <= 0) {
    warnings.push("Existing obligations exceed household income.");
  }
  if (eligibleEmi === 0) {
    warnings.push("Eligible EMI is ₹0 with the current inputs.");
  }
  if (totalIncome > 0 && form.income.existingEmis + eligibleEmi > totalIncome * 0.8) {
    warnings.push("Total EMIs breach the 80% income guardrail.");
  }

  return {
    foir,
    surplus,
    eligibleEmi,
    loanAmount,
    priceByLtv,
    priceByDownPayment,
    affordablePrice,
    emiScenarios,
    warnings,
  };
}

export function calculateLoanFromEmi(emi: number, rate: number, tenureMonths: number): number {
  if (rate === 0) {
    return emi * tenureMonths;
  }
  return emi * ((1 - Math.pow(1 + rate, -tenureMonths)) / rate);
}

export function calculateMonthlyEmi(loanAmount: number, rate: number, tenureMonths: number): number {
  if (loanAmount <= 0) {
    return 0;
  }
  if (rate === 0) {
    return loanAmount / tenureMonths;
  }
  return (loanAmount * rate) / (1 - Math.pow(1 + rate, -tenureMonths));
}

function buildEmiScenarios(
  affordablePrice: number,
  downPaymentPercent: number,
  monthlyRate: number,
  tenureMonths: number,
): EmiScenario[] {
  if (!Number.isFinite(affordablePrice) || affordablePrice <= 0) {
    return scenarioRatios.map((scenario) => ({
      label: scenario.label,
      propertyPrice: 0,
      loanAmount: 0,
      downPaymentAmount: 0,
      monthlyEmi: 0,
    }));
  }

  return scenarioRatios.map((scenario) => {
    const propertyPrice = affordablePrice * scenario.ratio;
    const downPaymentAmount = propertyPrice * downPaymentPercent;
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyEmi = calculateMonthlyEmi(loanAmount, monthlyRate, tenureMonths);

    return {
      label: scenario.label,
      propertyPrice,
      downPaymentAmount,
      loanAmount,
      monthlyEmi,
    };
  });
}
