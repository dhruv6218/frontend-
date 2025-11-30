'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface NavItem { label: string; href: string }

interface PillNavProps {
  logo?: string; // url for <img>
  logoAlt?: string;
  items: NavItem[];
  activeHref?: string;
  className?: string;
  ease?: string; // not used directly; kept for API compatibility
  baseColor?: string; // text color when not hovered
  pillColor?: string; // background color of pill
  hoveredPillTextColor?: string; // text color when hovered
  pillTextColor?: string; // text color inside the pill
}

export default function PillNav({
  logo,
  logoAlt = 'Brand logo',
  items,
  activeHref,
  className,
  baseColor = '#0F172A',
  pillColor = 'rgba(249, 115, 22, 0.14)', // brand orange #F97316 @ low alpha
  hoveredPillTextColor = '#0F172A',
}: PillNavProps) {
  const pathname = usePathname();
  const current = activeHref ?? pathname ?? '/';
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const idxActive = useMemo(() => items.findIndex((i) => current === i.href), [current, items]);

  return (
    <div className={[
      'flex items-center gap-4 md:gap-6',
      className ?? ''
    ].join(' ')}>
      {logo ? (
        <div className="flex items-center gap-2">
          <img src={logo} alt={logoAlt} className="h-7 w-7 rounded-md object-contain" />
        </div>
      ) : null}

      <div className="relative hidden md:flex items-center gap-2 px-1 py-1 rounded-full border border-neutral-200/70 bg-white/60 backdrop-blur">
        {/* Animated pill */}
        <div className="absolute inset-0 pointer-events-none">
          {(hoverIdx !== null || idxActive >= 0) && (
            <motion.div
              layout
              layoutId="pill"
              className="absolute h-8 rounded-full"
              style={{ background: pillColor }}
              initial={false}
              animate={{
                x: `${((hoverIdx ?? idxActive) * 100)}%`,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </div>

        {items.map((it, i) => {
          const isActive = current === it.href;
          const isHovered = hoverIdx === i;
          const color = isActive || isHovered ? hoveredPillTextColor : baseColor;
          return (
            <Link
              key={it.href}
              href={it.href}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="relative z-[1] px-3 py-1.5 rounded-full text-xs md:text-sm transition-colors"
              style={{ color }}
            >
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
