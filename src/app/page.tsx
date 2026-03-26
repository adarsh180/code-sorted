"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ParticleHero } from "@/components/ui/particle-hero";
import { ScrollytellingSection } from "@/components/ui/scrollytelling-section";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="relative" style={{ background: "var(--color-surface-dark)" }}>
      {/* Fixed navbar */}
      <LandingNavbar />

      {/* Hero section */}
      <ParticleHero />

      {/* Scrollytelling visual story sequence */}
      <ScrollytellingSection />

      {/* Content sections */}
      <FeaturesGrid />
      <CTASection />
      <Footer />
    </main>
  );
}
