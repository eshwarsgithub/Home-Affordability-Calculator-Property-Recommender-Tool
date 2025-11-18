export const STEPS = [
  { id: "lead", label: "Lead Capture" },
  { id: "income", label: "Income Details" },
  { id: "loan", label: "Loan Preferences" },
  { id: "results", label: "Results" },
] as const;

export const DOWN_PAYMENT_RANGE = { min: 0.2, max: 0.5 } as const;
export const TENURE_RANGE = { min: 15, max: 30 } as const;
export const ANNUAL_INTEREST_RATE = 0.085;
export const LTV_LIMIT = 0.8;
export const HIGH_INCOME_THRESHOLD = 250_000;
export const YOUNG_CO_APPLICANT_AGE = 32;
export const MIN_CO_APPLICANT_INCOME = 25_000;
export const MAX_FOIR = 0.6;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const SALES_WHATSAPP_NUMBER = "917338889900";
