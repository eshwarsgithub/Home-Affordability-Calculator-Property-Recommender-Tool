"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/primitives";

interface ScheduleModalProps {
  propertyName?: string;
  onClose: () => void;
}

export const ScheduleModal = ({ propertyName, onClose }: ScheduleModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => onClose(), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#060a18] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Private Viewing</p>
            <h3 className="mt-2 font-serif text-3xl">Schedule a confidential tour</h3>
            {propertyName ? <p className="text-sm text-white/70">Focused on {propertyName}</p> : null}
          </div>
          <button className="text-white/50 hover:text-white" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        {!submitted ? (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm text-white/70">
              Full name
              <input
                required
                type="text"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-white/70">
                Email
                <input
                  type="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                />
              </label>
              <label className="text-sm text-white/70">
                WhatsApp Number
                <input
                  type="tel"
                pattern="[0-9+\\-\\s()]+"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-white/70">
                Preferred date
                <input
                  type="date"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                />
              </label>
              <label className="text-sm text-white/70">
                Time zone
                <select className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white">
                  <option value="IST">IST (UTC+05:30)</option>
                  <option value="GST">GST (UTC+04:00)</option>
                  <option value="BST">BST (UTC+01:00)</option>
                  <option value="EST">EST (UTC-05:00)</option>
                </select>
              </label>
            </div>
            <label className="block text-sm text-white/70">
              Notes
              <textarea
                rows={3}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                placeholder="Security needs, entourage size, aircraft coordination, etc."
              />
            </label>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <input type="checkbox" id="nda" required className="h-5 w-5 rounded border-white/30 bg-white/5" />
              <label htmlFor="nda">I agree to the NDA and confidential handling of materials.</label>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button type="submit" size="lg">
                Confirm Visit
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-10 space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Scheduled</p>
            <p className="font-serif text-3xl">Concierge alerted</p>
            <p className="text-white/70">
              Your private advisor will confirm logistics within the next 15 minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
