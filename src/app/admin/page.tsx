"use client";

import { useState } from "react";
import { properties } from "@/data/properties";
import { SectionHeading, Button, Badge } from "@/components/ui/primitives";

export default function AdminPage() {
  const [drafts, setDrafts] = useState(
    properties.map((property) => ({
      id: property.id,
      name: property.name,
      status: "Published",
      price: property.price,
      priority: property.roi > 8 ? "High" : "Normal",
    })),
  );

  const toggleStatus = (id: string) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === id
          ? { ...draft, status: draft.status === "Published" ? "Draft" : "Published" }
          : draft,
      ),
    );
  };

  return (
    <section className="page-shell mt-16 space-y-10">
      <SectionHeading
        eyebrow="Admin"
        title="Listing management + CMS workflow"
        description="Admins manage listing states, priority, and accessibility notes inside a fast, responsive grid."
      />
      <div className="rounded-[40px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone="info">{drafts.length} active assets</Badge>
          <div className="flex gap-3">
            <Button size="sm">Add listing</Button>
            <Button size="sm" variant="ghost">
              Run accessibility scan
            </Button>
          </div>
        </div>
        <div className="mt-6 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((draft) => (
                <tr key={draft.id} className="border-t border-white/5">
                  <td className="px-4 py-3">{draft.name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 ${draft.status === "Published" ? "bg-[var(--color-royal)]/30" : "bg-white/10"}`}>
                      {draft.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">₹{(draft.price / 1_00_00_000).toFixed(2)} Cr</td>
                  <td className="px-4 py-3">{draft.priority}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toggleStatus(draft.id)}>
                        Toggle
                      </Button>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
