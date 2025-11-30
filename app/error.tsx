"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-2xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>Something went wrong</span></h1>
          <p className="text-sm text-neutral-600 mt-1"><span>{error.message || "Unexpected error"}</span></p>
          <button onClick={() => reset()} className="mt-4 inline-block px-3 py-2 text-sm rounded-md border border-neutral-200/70"><span>Try again</span></button>
        </div>
      </body>
    </html>
  );
}
