"use client";

import React from "react";
import { Icon } from "@iconify/react";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919034950792"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ravono on WhatsApp"
      className="fixed bottom-24 right-5 z-50 group"
    >
      <span
        className="inline-flex items-center justify-center h-12 w-12 rounded-full shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5"
        style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
      >
        <Icon icon="mdi:whatsapp" width={24} color="#FFFFFF" />
      </span>
      <span className="sr-only">Open WhatsApp chat</span>
    </a>
  );
}
