import { SALES_WHATSAPP_NUMBER } from "@/lib/constants";
import type { AffordabilityResult, PropertyMatch } from "@/types";

interface WhatsappPayload {
  leadName: string;
  result: AffordabilityResult;
  topPick?: PropertyMatch;
}

export function buildWhatsappLink({ leadName, result, topPick }: WhatsappPayload): string {
  const summary = Math.round(result.affordablePrice / 100000);
  const propertyName = topPick ? topPick.name : "a property";
  const text = `Hi Harihara team, this is ${leadName || "a buyer"}. My FOIR-backed budget is ${summary} lakh. Please help me with ${propertyName} options.`;
  return `https://wa.me/${SALES_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
