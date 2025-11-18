import { DOWN_PAYMENT_RANGE, TENURE_RANGE, PHONE_REGEX } from "@/lib/constants";
import type {
  IncomeDetails,
  LeadDetails,
  LoanPreferences,
  ValidationErrors,
} from "@/types";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;

export function validateLead(lead: LeadDetails): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!lead.name.trim()) {
    errors["lead.name"] = "Name is required";
  } else if (lead.name.trim().length < 3) {
    errors["lead.name"] = "Enter full name";
  }

  if (!lead.email.trim()) {
    errors["lead.email"] = "Email is required";
  } else if (!emailRegex.test(lead.email)) {
    errors["lead.email"] = "Enter a valid email";
  }

  if (!lead.phone.trim()) {
    errors["lead.phone"] = "Phone is required";
  } else if (!PHONE_REGEX.test(lead.phone.trim())) {
    errors["lead.phone"] = "Enter a valid 10-digit Indian number";
  }

  if (!lead.consent) {
    errors["lead.consent"] = "Marketing consent is required";
  }

  return errors;
}

export function validateIncome(income: IncomeDetails): ValidationErrors {
  const errors: ValidationErrors = {};

  if (income.monthlyIncome <= 0) {
    errors["income.monthlyIncome"] = "Monthly income must be positive";
  }

  if (income.existingEmis < 0) {
    errors["income.existingEmis"] = "Existing EMIs cannot be negative";
  }

  if (income.age < 21 || income.age > 65) {
    errors["income.age"] = "Age must be between 21 and 65";
  }

  const totalIncome = income.monthlyIncome + (income.includeCoApplicant ? income.coApplicantIncome : 0);
  if (income.existingEmis > totalIncome * 0.8) {
    errors["income.existingEmis"] = "EMIs cannot exceed 80% of household income";
  }

  if (income.includeCoApplicant) {
    if (income.coApplicantIncome <= 0) {
      errors["income.coApplicantIncome"] = "Co-applicant income is required";
    }

    if (income.coApplicantAge < 21 || income.coApplicantAge > 65) {
      errors["income.coApplicantAge"] = "Co-applicant age must be 21-65";
    }
  }

  return errors;
}

export function validateLoan(
  loan: LoanPreferences,
  borrowerAge: number,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (loan.tenureYears < TENURE_RANGE.min || loan.tenureYears > TENURE_RANGE.max) {
    errors["loan.tenureYears"] = `Tenure must be between ${TENURE_RANGE.min}-${TENURE_RANGE.max} years`;
  }

  if (
    loan.downPaymentPercent < DOWN_PAYMENT_RANGE.min ||
    loan.downPaymentPercent > DOWN_PAYMENT_RANGE.max
  ) {
    errors["loan.downPaymentPercent"] = "Down payment must stay within 20%-50%";
  }

  if (borrowerAge + loan.tenureYears > 70) {
    errors["loan.tenureYears"] = "Age + tenure cannot exceed 70";
  }

  return errors;
}
