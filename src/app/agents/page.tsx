"use client";

import Image from "next/image";
import { useState } from "react";
import { agents } from "@/data/agents";
import { SectionHeading, Badge, Button } from "@/components/ui/primitives";
import { ScheduleModal } from "@/components/modals/schedule-modal";

export default function AgentsPage() {
  const [selected, setSelected] = useState(agents[0]);
  const [open, setOpen] = useState(false);

  return (
    <section className="page-shell mt-16 space-y-10">
      <SectionHeading
        eyebrow="Advisors"
        title="Portfolio partners who defend every basis point"
        description="Agent and portfolio profiles surface certifications, testimonials, and CTA-ready contact forms."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-4">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelected(agent)}
              className={`flex w-full items-center gap-4 rounded-3xl border px-4 py-4 text-left transition ${
                selected.id === agent.id ? "border-[var(--color-royal)] bg-[var(--color-royal)]/10" : "border-white/10 bg-white/5"
              }`}
            >
              <Image src={agent.avatar} alt={agent.name} width={72} height={72} className="rounded-2xl object-cover" />
              <div>
                <p className="font-serif text-2xl">{agent.name}</p>
                <p className="text-sm text-white/70">{agent.title}</p>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{agent.region}</p>
              </div>
              <Badge tone="success" className="ml-auto">{agent.successRate}% close rate</Badge>
            </button>
          ))}
        </div>
        <div className="glass-panel p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Portfolio lead</p>
              <p className="font-serif text-4xl">{selected.name}</p>
              <p className="text-sm text-white/70">{selected.bio}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Portfolio value</p>
              <p className="text-2xl font-semibold">{selected.portfolioValue}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Specialties</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.specialties.map((specialty) => (
                <span key={specialty} className="rounded-full border border-white/20 px-3 py-1">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Testimonials</p>
            {selected.testimonials.map((testimonial) => (
              <blockquote key={testimonial.author}>
                “{testimonial.quote}” — {testimonial.author}, {testimonial.title}
              </blockquote>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Certifications</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.certifications.map((cert) => (
                <span key={cert} className="rounded-full border border-white/20 px-3 py-1">
                  {cert}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setOpen(true)}>
              Book with {selected.name.split(" ")[0]}
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a href="mailto:concierge@tycoonestates.com">Email dossier</a>
            </Button>
          </div>
        </div>
      </div>
      {open ? (
        <ScheduleModal propertyName={`${selected.name} — Portfolio briefing`} onClose={() => setOpen(false)} />
      ) : null}
    </section>
  );
}
