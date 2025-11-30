"use client";

import { motion } from "framer-motion";
import HeroRavono from "@/app/components/home/HeroRavono";
import StatsBar from "@/app/components/home/StatsBar";
import WhyRavono from "@/app/components/home/WhyRavono";
import FeaturesSection from "@/app/components/home/FeaturesSection";
import VideoTestimonials from "@/app/components/home/VideoTestimonials";
import HowItWorks from "@/app/components/home/HowItWorks";
import CTABanner from "@/app/components/home/CTABanner";

export default function HomeClient() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <HeroRavono />
      <StatsBar />
      <WhyRavono />
      <FeaturesSection />
      <VideoTestimonials />

      {/* Home Banner replacing Pricing */}
      <div className="w-full relative">
        <img
          src="/home-banner.jpg"
          alt="Ravono Empowering The Future"
          className="w-full h-auto object-cover"
        />
      </div>

      <HowItWorks />
      <CTABanner />
    </motion.div>
  );
}
