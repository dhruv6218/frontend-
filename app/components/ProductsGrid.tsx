"use client";

import Link from "next/link";

export type ProductItem = { name: string; price: string; description: string; image?: string; href: string };

export default function ProductsGrid({ items, title }: { items: ProductItem[]; title?: string }) {
  return (
    <section id="products" aria-label="Products" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      {title && (
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{title}</span></h3>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <article key={p.name} className="rounded-2xl border border-neutral-200/70 bg-white/70 backdrop-blur p-3">
            <div className="h-28 rounded-xl bg-gradient-to-br from-orange-200 via-white to-blue-200" aria-label="Decorative image" />
            <h4 className="text-sm mt-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{p.name}</span></h4>
            <p className="text-xs text-[#64748B] mt-1"><span>{p.description}</span></p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-[#0F172A]"><span>{p.price}</span></p>
              <Link href={p.href} className="text-xs underline text-[#1E3A8A]"><span>Open</span></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
