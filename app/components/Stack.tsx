'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardData { id: number; img: string }

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number; // max rotation degrees
  sendToBackOnClick?: boolean;
  cardDimensions?: { width: number; height: number };
  cardsData: CardData[];
}

export default function Stack({ randomRotation = true, sensitivity = 180, sendToBackOnClick = false, cardDimensions = { width: 200, height: 200 }, cardsData }: StackProps) {
  const [order, setOrder] = React.useState(cardsData.map((c) => c.id));

  const handleClick = (id: number) => {
    if (!sendToBackOnClick) return;
    setOrder((prev) => [...prev.filter((x) => x !== id), id]);
  };

  return (
    <div className="relative" style={{ width: cardDimensions.width * 2.5, height: cardDimensions.height * 1.6 }}>
      {order.map((id, idx) => {
        const item = cardsData.find((c) => c.id === id)!;
        const amp = Math.min(14, Math.max(4, sensitivity / 24));
        const rot = randomRotation ? ((idx % 2 === 0 ? 1 : -1) * (4 + ((idx * 3) % amp))) : 0;
        return (
          <motion.div
            key={id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden border border-neutral-200/70 bg-white/60 backdrop-blur"
            style={{ width: cardDimensions.width, height: cardDimensions.height, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
            initial={{ rotate: rot, y: 0, x: 0 }}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={() => handleClick(id)}
          >
            <img src={item.img} alt={`Stack image ${id}`} className="h-full w-full object-cover" />
          </motion.div>
        );
      })}
    </div>
  );
}
