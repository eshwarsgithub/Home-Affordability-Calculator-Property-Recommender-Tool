export type EmploymentType = "salaried" | "self-employed";

export interface AffordabilityInput {
  primaryIncome: number;
  coApplicantIncome: number;
  existingEmis: number;
  employmentType: EmploymentType;
  hasYoungCoApplicant: boolean;
  tenureYears: number;
  downPaymentPercent: number; // 0.2 => 20%
  interestRate: number; // annual percentage
}

export interface AffordabilityBreakdown {
  totalIncome: number;
  surplusIncome: number;
  foirApplied: number;
  maxEligibleEmi: number;
  eligibleLoanAmount: number;
  affordablePrice: number;
  priceByDownPayment: number;
  priceByLtv: number;
  downPaymentAmount: number;
}

const BASE_FOIR: Record<EmploymentType, number> = {
  salaried: 0.5,
  "self-employed": 0.45,
};

const YOUNG_CO_APPLICANT_BONUS = 0.1;
const HIGH_INCOME_THRESHOLD = 250000; // INR per month
const HIGH_INCOME_BONUS = 0.05;
const MAX_FOIR = 0.6;
const LTV_CAP = 0.75; // conservative assumption until lender rules are known

export const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: value >= 100000 ? 0 : 2,
  }).format(Math.max(0, value));
};

export const monthlyRate = (annualRate: number): number => annualRate / 12 / 100;

export const loanFromEmi = (
  maxEmi: number,
  annualRate: number,
  tenureYears: number,
): number => {
  if (maxEmi <= 0) return 0;
  const r = monthlyRate(annualRate);
  const n = tenureYears * 12;
  if (r === 0) {
    return maxEmi * n;
  }
  const factor = (1 - Math.pow(1 + r, -n)) / r;
  return maxEmi * factor;
};

export const emiFromLoan = (
  loanAmount: number,
  annualRate: number,
  tenureYears: number,
): number => {
  if (loanAmount <= 0) return 0;
  const r = monthlyRate(annualRate);
  const n = tenureYears * 12;
  if (r === 0) {
    return loanAmount / n;
  }
  const numerator = loanAmount * r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  return numerator / denominator;
};

export const computeFoir = (
  employmentType: EmploymentType,
  hasYoungCoApplicant: boolean,
  totalIncome: number,
): number => {
  let foir = BASE_FOIR[employmentType];
  if (hasYoungCoApplicant) {
    foir += YOUNG_CO_APPLICANT_BONUS;
  }
  if (totalIncome >= HIGH_INCOME_THRESHOLD) {
    foir += HIGH_INCOME_BONUS;
  }
  return Math.min(MAX_FOIR, foir);
};

export const calculateAffordability = (
  input: AffordabilityInput,
): AffordabilityBreakdown => {
  const totalIncome = input.primaryIncome + input.coApplicantIncome;
  const surplusIncome = Math.max(0, totalIncome - input.existingEmis);
  const foirApplied = computeFoir(
    input.employmentType,
    input.hasYoungCoApplicant,
    totalIncome,
  );
  const maxEligibleEmi = surplusIncome * foirApplied;
  const eligibleLoanAmount = loanFromEmi(
    maxEligibleEmi,
    input.interestRate,
    input.tenureYears,
  );
  const priceByDownPayment = eligibleLoanAmount / (1 - input.downPaymentPercent);
  const priceByLtv = eligibleLoanAmount / LTV_CAP;
  const affordablePrice = Math.min(priceByDownPayment, priceByLtv);
  const downPaymentAmount = affordablePrice * input.downPaymentPercent;

  return {
    totalIncome,
    surplusIncome,
    foirApplied,
    maxEligibleEmi,
    eligibleLoanAmount,
    affordablePrice,
    priceByDownPayment,
    priceByLtv,
    downPaymentAmount,
  };
};

export const buildEmiTable = (
  loanAmount: number,
  baseRate: number,
  tenures: number[],
): Array<{ tenureYears: number; rate: number; emi: number }> => {
  const rateVariants = [baseRate - 0.5, baseRate, baseRate + 0.5].map((rate) =>
    Number(rate.toFixed(2)),
  );
  const rows: Array<{ tenureYears: number; rate: number; emi: number }> = [];

  for (const tenureYears of tenures) {
    for (const rate of rateVariants) {
      const emi = emiFromLoan(loanAmount, Math.max(rate, 0), tenureYears);
      rows.push({ tenureYears, rate: Math.max(rate, 0), emi });
    }
  }

  return rows;
};

type PropertyLike = {
  id: string;
  name: string;
  price: number;
  highlights?: string[];
  configuration?: string;
  possession?: string;
  location?: string;
};

export type PropertyMatch<T extends PropertyLike = PropertyLike> = {
  property: T;
  score: number;
  fitLabel: "Fits budget" | "Stretch" | "Premium";
  ctaMessage: string;
};

const clampMatchCount = (count: number) => Math.min(12, Math.max(3, count));

export const matchProperties = <T extends PropertyLike>(
  properties: T[],
  affordablePrice: number,
  preferredCount = 6,
): PropertyMatch<T>[] => {
  if (properties.length === 0) return [];

  const targetCount = clampMatchCount(preferredCount);
  const scored = properties.map((property) => {
    const priceGap = property.price - affordablePrice;
    const withinBudget = priceGap <= 0;
    const gapRatio = affordablePrice > 0 ? Math.abs(priceGap) / affordablePrice : 1;
    const distanceScore = 1 - Math.min(gapRatio, 1);
    const affordabilityScore = withinBudget ? 1 : Math.max(0, 1 - gapRatio * 1.5);
    const highlightScore = Math.min((property.highlights?.length ?? 0) / 5, 1);
    const configurationScore = property.configuration ? 0.1 : 0;
    const possessionScore = property.possession?.toLowerCase().includes("ready") ? 0.1 : 0;

    const score = Number(
      (
        distanceScore * 0.55 +
        affordabilityScore * 0.25 +
        highlightScore * 0.1 +
        configurationScore +
        possessionScore
      ).toFixed(4),
    );

    const fitLabel: PropertyMatch["fitLabel"] = withinBudget
      ? "Fits budget"
      : priceGap / (affordablePrice || 1) <= 0.2
        ? "Stretch"
        : "Premium";

    const ctaMessage = `Interested in ${property.name} around ${property.location ?? "Bengaluru"}. Listed at ₹${property.price.toLocaleString("en-IN")} and aligns with my affordability. Can we schedule a walkthrough?`;

    return { property, score, fitLabel, ctaMessage };
  });

  scored.sort((a, b) => b.score - a.score || a.property.price - b.property.price);

  const shortlisted = scored.slice(0, targetCount);
  if (shortlisted.length >= 3) {
    return shortlisted;
  }

  const remainder = scored
    .filter((item) => !shortlisted.some((existing) => existing.property.id === item.property.id))
    .slice(0, 3 - shortlisted.length);

  return [...shortlisted, ...remainder];
};
