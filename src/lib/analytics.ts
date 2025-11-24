type AnalyticsEventName =
  | "step_started"
  | "step_completed"
  | "lead_submitted"
  | "affordability_viewed"
  | "property_clicked"
  | "whatsapp_cta_clicked"
  | "flow_completed"
  | "flow_abandoned";

export type AnalyticsPayload = Record<string, unknown>;

const isBrowser = typeof window !== "undefined";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const trackEvent = (event: AnalyticsEventName, payload: AnalyticsPayload = {}) => {
  if (!isBrowser) return;

  const entry = {
    event,
    timestamp: Date.now(),
    ...payload,
  };

  if (typeof window.dataLayer === "undefined") {
    window.dataLayer = [];
  }

  window.dataLayer.push(entry);

  if (process.env.NODE_ENV !== "production") {
    console.debug("analytics", entry);
  }
};
