"use client";

import React, { useState, useEffect } from "react";

export default function AIWidget() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Mock: AI is always configured in frontend-only mode
    setConfigured(true);
  }, []);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput(null);
    setError(null);
    try {
      // Mock AI response with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput(`This is a mock AI response. In production, this would provide insights about: "${prompt}"\n\nFor vendor compliance, consider checking:\n- Legal registration and documentation\n- Financial stability and credit history\n- Industry certifications and compliance\n- References and past performance\n- Insurance coverage and risk assessment`);
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ai" aria-label="AI Assistant" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <div className="rounded-2xl border border-neutral-200/70 bg-white/70 backdrop-blur p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>Ask our AI about vendor compliance</span></h3>
        </div>
        {configured === false && (
          <p className="text-xs text-[#64748B] mb-3"><span>AI is not configured. Set PERPLEXITY_API_URL and PERPLEXITY_API_KEY to enable answers.</span></p>
        )}
        <form onSubmit={handleAsk} className="flex flex-col md:flex-row gap-2">
          <label htmlFor="ai-prompt" className="sr-only">Prompt</label>
          <input
            id="ai-prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-200/70 px-3 py-2 text-sm"
            placeholder="e.g. What checks should I run before onboarding a vendor?"
            disabled={configured === false}
          />
          <button disabled={loading || configured === false} className="text-sm px-4 py-2 rounded-full text-white disabled:opacity-70" style={{ background: "linear-gradient(135deg, #F97316, #1E3A8A)" }}>
            <span>{loading ? 'Asking…' : 'Ask AI'}</span>
          </button>
        </form>
        {error && <p className="text-xs text-red-600 mt-2"><span>{error}</span></p>}
        {output && (
          <div className="mt-3 rounded-lg border border-neutral-200/70 bg-white/80 p-3">
            <p className="text-sm whitespace-pre-wrap text-[#0F172A]"><span>{output}</span></p>
          </div>
        )}
      </div>
    </section>
  );
}
