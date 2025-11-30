"use client";

import Link from "next/link";

export type Plan = {
  name: string;
  priceMonthly: string;
  features: string[];
  popular?: boolean;
  cta: { label: string; href: string };
};

export default function PricingTable({ plans }: { plans: Plan[] }) {
  return (
    <section id="pricing" aria-label="Pricing" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-2xl border border-neutral-200/70 bg-white/70 backdrop-blur p-5 ${plan.popular ? 'ring-2 ring-orange-300' : ''}`}
          >
            {plan.popular && (
              <p className="text-[10px] inline-block px-2 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 mb-2"><span>Most Popular</span></p>
            )}
            <h4 className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{plan.name}</span></h4>
            <p className="text-2xl mt-1" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{plan.priceMonthly}</span></p>
            <ul className="mt-3 space-y-2 text-xs text-[#475569]">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />{f}</li>
              ))}
            </ul>
            <Link href={plan.cta.href} className="mt-4 inline-block text-sm px-4 py-2 rounded-full text-white" style={{ background: "linear-gradient(135deg, #F97316, #1E3A8A)" }}>
              <span>{plan.cta.label}</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
