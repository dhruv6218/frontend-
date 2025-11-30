"use client";

import React from "react";

export default function Skeleton({ className = "h-5 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-neutral-200 ${className}`} />;
}
