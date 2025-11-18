import { properties } from "@/data/properties";
import { ANNUAL_INTEREST_RATE } from "@/lib/constants";
import { calculateMonthlyEmi } from "@/lib/calculations";
import type { PropertyMatch } from "@/types";

const BUFFER_FACTOR = 1.05;

export function getPropertyMatches(
  affordablePrice: number,
  downPaymentPercent: number,
  tenureYears: number,
): PropertyMatch[] {
  const sorted = [...properties].sort((a, b) => a.price - b.price);
  const ideal: PropertyMatch[] = [];
  const buffer: PropertyMatch[] = [];
  const stretch: PropertyMatch[] = [];

  const monthlyRate = ANNUAL_INTEREST_RATE / 12;
  const tenureMonths = tenureYears * 12;

  sorted.forEach((property) => {
    const downPaymentAmount = property.price * downPaymentPercent;
    const loanComponent = property.price - downPaymentAmount;
    const monthlyEmi = calculateMonthlyEmi(loanComponent, monthlyRate, tenureMonths);
    const fit: PropertyMatch["fit"] = property.price <= affordablePrice ? "Ideal" : "Stretch";
    const match: PropertyMatch = {
      ...property,
      fit,
      monthlyEmi,
      downPaymentAmount,
    };

    if (property.price <= affordablePrice) {
      ideal.push(match);
    } else if (property.price <= affordablePrice * BUFFER_FACTOR) {
      buffer.push({ ...match, fit: "Stretch" });
    } else {
      stretch.push({ ...match, fit: "Stretch" });
    }
  });

  let combined = [...ideal, ...buffer];
  if (combined.length < 3) {
    combined = [...combined, ...stretch.slice(0, 3 - combined.length)];
  }

  return combined.slice(0, 12);
}
