'use client';

import React, { useEffect, useRef } from 'react';

interface CircularGalleryProps {
  bend?: number; // curvature intensity
  textColor?: string;
  borderRadius?: number; // 0..1 factor
  scrollEase?: number;
}

export default function CircularGallery({ bend = 3, textColor = '#ffffff', borderRadius = 0.05, scrollEase = 0.02 }: CircularGalleryProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let rot = 0;
    const tick = () => {
      rot += scrollEase;
      el.style.transform = `rotate(${rot}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollEase]);

  const radiusPx = Math.max(120, Math.min(260, bend * 80));

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div ref={ref} className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute" style={{
            transform: `rotate(${(i * 360) / 8}deg) translate(${radiusPx}px) rotate(-${(i * 360) / 8}deg)`
          }}>
            <div className="px-3 py-1 text-[10px] md:text-xs border border-white/20 bg-white/10 backdrop-blur" style={{ color: textColor, borderRadius: `${borderRadius * 100}%` }}>
              <span>RAVONO</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
