import { buildWhatsappLink } from "@/lib/whatsapp";
import type { AffordabilityResult, PropertyMatch } from "@/types";

interface StickyWhatsappCTAProps {
  result: AffordabilityResult | null;
  leadName: string;
  matches: PropertyMatch[];
}

export function StickyWhatsappCTA({ result, leadName, matches }: StickyWhatsappCTAProps) {
  if (!result) {
    return null;
  }

  const href = buildWhatsappLink({ leadName, result, topPick: matches[0] });

  return (
    <div className="fixed bottom-4 left-0 right-0 z-20 px-4 md:hidden">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-300"
      >
        Continue on WhatsApp
      </a>
    </div>
  );
}
