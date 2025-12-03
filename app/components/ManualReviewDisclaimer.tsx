"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function ManualReviewDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3"
    >
      <Icon icon="mdi:alert-circle-outline" width={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">
        <span className="font-semibold">Important:</span> Always manually review reports before making decisions. Automated verification results are for reference only and should be validated through your internal processes.
      </p>
    </motion.div>
  );
}

