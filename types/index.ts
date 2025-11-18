export type EmploymentType = "Salaried" | "Self-Employed";

export interface LeadDetails {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export interface IncomeDetails {
  employmentType: EmploymentType;
  monthlyIncome: number;
  existingEmis: number;
  age: number;
  includeCoApplicant: boolean;
  coApplicantIncome: number;
  coApplicantAge: number;
}

export interface LoanPreferences {
  tenureYears: number;
  downPaymentPercent: number; // stored as 0-1
}

export interface FormState {
  lead: LeadDetails;
  income: IncomeDetails;
  loan: LoanPreferences;
}

export interface ValidationErrors {
  [path: string]: string | undefined;
}

export interface EmiScenario {
  label: string;
  propertyPrice: number;
  loanAmount: number;
  downPaymentAmount: number;
  monthlyEmi: number;
}

export interface AffordabilityResult {
  foir: number;
  surplus: number;
  eligibleEmi: number;
  loanAmount: number;
  priceByLtv: number;
  priceByDownPayment: number;
  affordablePrice: number;
  emiScenarios: EmiScenario[];
  warnings: string[];
}

export interface Property {
  id: string;
  name: string;
  location: string;
  configuration: string;
  carpetArea: number; // in sq.ft
  price: number; // total price in INR
  status: "Ready" | "Under Construction";
  delivery: string;
  image: string;
  tags: string[];
  whatsappNumber?: string;
}

export interface PropertyMatch extends Property {
  fit: "Ideal" | "Stretch";
  monthlyEmi: number;
  downPaymentAmount: number;
}
