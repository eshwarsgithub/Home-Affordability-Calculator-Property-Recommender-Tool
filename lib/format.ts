export function formatCurrency(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "₹0";
  }

  if (value >= 1e7) {
    return `₹${(value / 1e7).toFixed(2)} Cr`;
  }

  if (value >= 1e5) {
    return `₹${(value / 1e5).toFixed(1)} Lakh`;
  }

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }
  return Math.round(value).toLocaleString("en-IN");
}
