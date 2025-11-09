"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { HowWeWorkSection } from "@/components/how-we-work-section"
import { CampaignShowcase } from "@/components/campaign-showcase"
import { ImpactSection } from "@/components/impact-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()

  const handleDonateClick = () => {
    router.push("/campaigns")
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900">
      <Header onDonateClick={handleDonateClick} />
      <HeroSection onDonateClick={handleDonateClick} />
      <AboutSection />
      <HowWeWorkSection />
      <CampaignShowcase onDonateClick={handleDonateClick} />
      <ImpactSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
