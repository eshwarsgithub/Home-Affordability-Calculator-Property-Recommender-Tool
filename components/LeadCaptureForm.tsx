"use client";

import type { LeadDetails, ValidationErrors } from "@/types";

interface LeadCaptureFormProps {
  data: LeadDetails;
  errors: ValidationErrors;
  onChange: (field: keyof LeadDetails, value: string | boolean) => void;
}

export function LeadCaptureForm({ data, errors, onChange }: LeadCaptureFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="field-label" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="E.g. Arjun Menon"
          className="field-input"
        />
        {errors["lead.name"] && <p className="field-error">{errors["lead.name"]}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="you@email.com"
          className="field-input"
        />
        {errors["lead.email"] && <p className="field-error">{errors["lead.email"]}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="phone">
          WhatsApp number
        </label>
        <input
          id="phone"
          name="phone"
          inputMode="numeric"
          maxLength={10}
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value.replace(/[^\d]/g, ""))}
          placeholder="10-digit mobile"
          className="field-input"
        />
        {errors["lead.phone"] && <p className="field-error">{errors["lead.phone"]}</p>}
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => onChange("consent", e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span>
          I agree to receive WhatsApp and phone communication from Harihara Constructions about offers, site visits, and loan assistance.
        </span>
      </label>
      {errors["lead.consent"] && <p className="field-error">{errors["lead.consent"]}</p>}
    </div>
  );
}
