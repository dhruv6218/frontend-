"use client";

import React from "react";
import { Icon } from "@iconify/react";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function FloatingEmail() {
  return (
    <a
      href="mailto:ravonoagency@gmail.com"
      aria-label="Email Ravono"
      className="fixed bottom-40 right-5 z-50 group"
    >
      <span
        className="inline-flex items-center justify-center h-12 w-12 rounded-full shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5"
        style={{ background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})` }}
      >
        <Icon icon="mdi:email-outline" width={22} color="#FFFFFF" />
      </span>
      <span className="sr-only">Send email</span>
    </a>
  );
}
