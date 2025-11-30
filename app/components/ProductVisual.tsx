"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ORANGE = "#F97316";

export default function ProductVisual() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 2)), 60);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="rounded-3xl border border-neutral-200/70 bg-white/60 backdrop-blur p-5 md:p-8" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Batch verifications</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#475569]">Demo</span>
            <img
              src="https://storage.googleapis.com/cosmic-project-image-assets/images/8426010c-1c72-441b-bf23-ae13286849ff/WhatsApp_Image_2025-07-25_at_14.54.52_6feab416.jpg"
              alt="Ravono brand banner"
              className="h-6 w-auto rounded object-contain"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {["GST", "PAN", "Aadhaar", "MCA", "Bank"].map((t, i) => (
            <div key={t} className="rounded-xl border border-neutral-200/70 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs">{t} checks</span>
                <span className="text-[11px] text-[#475569]">{Math.min(100, Math.max(0, progress - i * 8))}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200/60 overflow-hidden">
                <motion.div className="h-full" style={{ background: ORANGE }} animate={{ width: `${Math.min(100, Math.max(0, progress - i * 8))}%` }} transition={{ ease: "linear" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-[#475569]">Report file</div>
          <div className="relative h-8 w-36 rounded-full border border-neutral-200/70 bg-white overflow-hidden">
            <motion.div className="absolute inset-0" animate={{ backgroundPositionX: [0, 100, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} style={{ backgroundImage: "linear-gradient(90deg, transparent, rgba(249,115,22,0.18), transparent)", backgroundSize: "200% 100%" }} />
            <div className="relative z-10 h-full w-full flex items-center justify-center text-[12px]">PDF ready</div>
          </div>
        </div>
      </div>
    </section>
  );
}
