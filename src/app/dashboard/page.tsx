"use client";

import { useState } from "react";
import { metrics, timeline, holdings } from "@/data/dashboard";
import { SectionHeading, Badge, Button } from "@/components/ui/primitives";

export default function DashboardPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredHoldings = selectedStatus ? holdings.filter((holding) => holding.status === selectedStatus) : holdings;

  return (
    <section className="page-shell mt-16 space-y-10">
      <SectionHeading
        eyebrow="Dashboard"
        title="Owner cockpit with liquidity, IRR, and timeline clarity"
        description="Micro-animations highlight data changes while GPU transforms keep performance snappy."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">{metric.label}</p>
            <p className="mt-2 text-4xl font-semibold">{metric.value}</p>
            <div className="mt-4 h-24 rounded-2xl border border-white/10 bg-black/40">
              <div
                className="h-full rounded-2xl bg-[var(--color-royal)]/40"
                style={{ width: `${metric.trend[metric.trend.length - 1] * 3}%` }}
              />
            </div>
            <p className={`mt-2 text-sm ${metric.delta >= 0 ? "text-[#61ffc8]" : "text-[#ff9c7b]"}`}>
              {metric.delta >= 0 ? "▲" : "▼"} {Math.abs(metric.delta)}% vs last 30d
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="glass-panel p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Timeline</p>
          <ul className="mt-6 space-y-4">
            {timeline.map((event) => (
              <li
                key={event.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-serif text-2xl">{event.title}</p>
                  <Badge tone={event.status === "completed" ? "success" : event.status === "in-progress" ? "info" : "neutral"}>
                    {event.status}
                  </Badge>
                </div>
                <p className="text-sm text-white/60">{event.date}</p>
                <p className="mt-2 text-sm text-white/80">{event.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-panel p-8 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Holdings</p>
            <div className="flex flex-wrap gap-2">
              {[null, "Stabilized", "Growth", "Exit"].map((status) => (
                <button
                  key={status ?? "all"}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full border px-4 py-1 text-xs uppercase tracking-[0.3em] ${
                    selectedStatus === status ? "border-[var(--color-royal)] bg-[var(--color-royal)]/20" : "border-white/10"
                  }`}
                >
                  {status ?? "All"}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-auto rounded-3xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="px-4 py-3 text-left">Asset</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Value</th>
                  <th className="px-4 py-3 text-left">IRR</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.map((holding) => (
                  <tr key={holding.id} className="border-t border-white/5">
                    <td className="px-4 py-3">{holding.asset}</td>
                    <td className="px-4 py-3">{holding.location}</td>
                    <td className="px-4 py-3">{holding.value}</td>
                    <td className="px-4 py-3">{holding.irr}</td>
                    <td className="px-4 py-3">
                      <Badge tone="neutral">{holding.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Progress indicator</p>
            <p className="mt-2">Heavy analytics show skeleton + progress bar before charts render.</p>
            <div className="mt-4 h-3 w-full rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[var(--color-royal)]" style={{ width: "74%" }} />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Next actions</p>
        <p className="mt-3 font-serif text-4xl">Export data room, share with LPs, run axe scan.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button variant="secondary" size="lg">
            Export dashboard JSON
          </Button>
          <Button asChild size="lg">
            <a href="/contact">Invite analysts</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
