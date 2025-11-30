"use client";

import React, { useState } from "react";
import { mockService } from "@/lib/mock/service";

export default function ContactForm({ title = "Contact Us", subtext = "Questions? We’re here to help." }: { title?: string; subtext?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!fullName || !email || !message) {
      setError("Please fill in name, email and message.");
      setLoading(false);
      return;
    }

    try {
      await mockService.contact.submit({ fullName, email, company, phone, message });
      setSuccess("Thanks! We will get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" aria-label="Contact" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <div className="max-w-xl">
        <h3 className="text-xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{title}</span></h3>
        <p className="text-sm text-[#64748B] mt-1"><span>{subtext}</span></p>
      </div>
      <form onSubmit={onSubmit} className="mt-4 max-w-xl space-y-3" noValidate>
        <div>
          <label htmlFor="fullName" className="block text-xs text-[#475569]">Full name</label>
          <input id="fullName" name="fullName" type="text" required className="mt-1 w-full rounded-lg border border-neutral-200/70 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-[#475569]">Email</label>
          <input id="email" name="email" type="email" required className="mt-1 w-full rounded-lg border border-neutral-200/70 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="company" className="block text-xs text-[#475569]">Company</label>
          <input id="company" name="company" type="text" className="mt-1 w-full rounded-lg border border-neutral-200/70 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs text-[#475569]">Phone</label>
          <input id="phone" name="phone" type="tel" className="mt-1 w-full rounded-lg border border-neutral-200/70 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="message" className="block text-xs text-[#475569]">Message</label>
          <textarea id="message" name="message" required rows={4} className="mt-1 w-full rounded-lg border border-neutral-200/70 px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <button disabled={loading} className="text-sm px-4 py-2 rounded-full text-white disabled:opacity-70" style={{ background: "linear-gradient(135deg, #F97316, #1E3A8A)" }}>
            <span>{loading ? 'Sending…' : 'Send Message'}</span>
          </button>
          {success && <p className="text-xs text-emerald-700"><span>{success}</span></p>}
          {error && <p className="text-xs text-red-600"><span>{error}</span></p>}
        </div>
      </form>
    </section>
  );
}
