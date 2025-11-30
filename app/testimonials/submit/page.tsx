"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ElectricBorder from "@/app/components/ElectricBorder";
import { mockService } from "@/lib/mock/service";
import { Icon } from "@iconify/react";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function TestimonialSubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function submit() {
    if (!title || !name || !message) {
      setToast("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      await mockService.testimonials.submit({ title, subject, name, company, rating, message });
      router.push("/testimonials/submit/success");
    } catch {
      setToast("There was a problem. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[#F8FAFC]">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-100/50 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-geist)" }}>
              Share Your Experience
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              Your feedback helps us improve and inspires others.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ElectricBorder color={ORANGE} speed={1.5} chaos={0.3} thickness={2} style={{ borderRadius: 24 }}>
            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[22px] shadow-xl border border-white/50">
              <form onSubmit={(e) => { e.preventDefault(); void submit(); }} className="space-y-6">

                {/* Rating Section */}
                <div className="flex flex-col items-center justify-center space-y-2 mb-6">
                  <label className="text-sm font-medium text-slate-600 uppercase tracking-wider">Rate your experience</label>
                  <StarPicker value={rating} onChange={setRating} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Your Name *" value={name} onChange={setName} placeholder="John Doe" required />
                  <Field label="Company Name" value={company} onChange={setCompany} placeholder="Acme Corp" />
                </div>

                <Field label="Headline *" value={title} onChange={setTitle} placeholder="e.g., Seamless verification process!" required />

                {/* Subject is optional, maybe hidden or less prominent? Keeping it as per original but cleaner */}
                {/* <Field label="Subject" value={subject} onChange={setSubject} placeholder="General Feedback" /> */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Review *</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                    placeholder="Tell us what you liked about Ravono..."
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-white font-medium text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
                  >
                    {loading ? (
                      <>
                        <Icon icon="line-md:loading-twotone-loop" width={24} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Review</span>
                        <Icon icon="heroicons:paper-airplane" width={20} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </ElectricBorder>
        </motion.div>
      </div>

      <AnimateToast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

function Field({ label, value, onChange, required, type, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const active = idx <= (hover ?? value);
        return (
          <button
            type="button"
            key={idx}
            onClick={() => onChange(idx)}
            onMouseEnter={() => setHover(idx)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Icon
              icon={active ? "solar:star-bold" : "solar:star-linear"}
              width={32}
              className={active ? "text-orange-500 drop-shadow-sm" : "text-slate-300"}
            />
          </button>
        );
      })}
    </div>
  );
}

function AnimateToast({ message, onDone }: { message: string | null; onDone: () => void }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 text-white shadow-2xl z-50 flex items-center gap-3"
      onAnimationComplete={() => setTimeout(onDone, 2500)}
    >
      <Icon icon="heroicons:information-circle" className="text-orange-400" width={20} />
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}
