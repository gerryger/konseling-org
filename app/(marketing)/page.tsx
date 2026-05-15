import "./landing.css"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustStrip } from "@/components/landing/trust-strip"
import { ProblemSection } from "@/components/landing/problem-section"
import { ProcessSection } from "@/components/landing/process-section"
import { SafetySection } from "@/components/landing/safety-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CTASection } from "@/components/landing/cta-section"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ProblemSection />
      <ProcessSection />
      <SafetySection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
