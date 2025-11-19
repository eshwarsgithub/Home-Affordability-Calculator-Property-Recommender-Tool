import { SectionHeading } from "@/components/ui/primitives";

const colors = [
  { name: "Charcoal", value: "#050b16" },
  { name: "Slate", value: "#1f2633" },
  { name: "Mist", value: "#f5f6f8" },
  { name: "Royal", value: "#0a5dff" },
  { name: "Gold", value: "#c89b3c" },
];

const typography = [
  { token: "Display", font: "Cormorant Garamond", size: "72/1.1" },
  { token: "Heading", font: "Cormorant Garamond", size: "48/1.2" },
  { token: "Body", font: "Inter", size: "16/1.6" },
  { token: "Microcopy", font: "Inter", size: "12/1.4" },
];

const breakpoints = [
  { label: "Mobile", value: "360 / 412" },
  { label: "Tablet", value: "768" },
  { label: "Laptop", value: "1024" },
  { label: "Desktop", value: "1280+" },
];

export default function StyleGuidePage() {
  return (
    <section className="page-shell mt-16 space-y-10">
      <SectionHeading
        eyebrow="Style guide"
        title="Brand tokens, accessibility, and performance guardrails"
        description="Use this as the PDF source; export to A4 for offline sharing."
      />
      <div className="glass-panel p-8 space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Colors</p>
        <div className="grid gap-4 md:grid-cols-5">
          {colors.map((color) => (
            <div key={color.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="h-24 rounded-2xl" style={{ backgroundColor: color.value }} />
              <p className="mt-2 text-sm">{color.name}</p>
              <p className="text-xs text-white/60">{color.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel p-8 space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Typography</p>
        <div className="grid gap-4 md:grid-cols-4">
          {typography.map((item) => (
            <div key={item.token} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60">{item.token}</p>
              <p className="text-2xl">{item.font}</p>
              <p className="text-xs text-white/60">{item.size}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel p-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Spacing & breakpoints</p>
        <ul className="grid gap-4 md:grid-cols-4">
          {breakpoints.map((bp) => (
            <li key={bp.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60">{bp.label}</p>
              <p className="text-2xl">{bp.value}px</p>
              <p className="text-xs text-white/60">Min width targets</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="glass-panel p-8 space-y-4 text-sm text-white/70">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Accessibility & SEO</p>
        <ul className="space-y-2">
          <li>• Contrast ≥ 4.5:1, focus halo 2px Royal Blue, keyboard trap for modals.</li>
          <li>• aria-live on async content, aria-label for map pins & CTA buttons.</li>
          <li>• Structured data schema.org/RealEstateListing + breadcrumbs.</li>
          <li>• All imagery with descriptive alt text (Property + type + city + key stat).</li>
        </ul>
      </div>
      <div className="glass-panel p-8 space-y-4 text-sm text-white/70">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Performance & responsiveness</p>
        <ul className="space-y-2">
          <li>• Lighthouse mobile ≥90, FCP &lt; 1.5s on 3G, CLS &lt; 0.1, TBT &lt; 200ms.</li>
          <li>• Inline critical CSS, lazy-load media w/ IntersectionObserver, GPU-only animations.</li>
          <li>• Responsive images (WebP/AVIF) with srcset + sizes.</li>
          <li>• Code-splitting per route; Next.js RSC + caching via edge CDN.</li>
        </ul>
      </div>
    </section>
  );
}
