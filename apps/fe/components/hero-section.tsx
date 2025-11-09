"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "@/components/sparkles"

interface HeroSectionProps {
  onDonateClick?: () => void
}

export function HeroSection({ onDonateClick }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { clientX, clientY } = e
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (clientX - left) / width
      const y = (clientY - top) / height

      containerRef.current.style.setProperty("--mouse-x", `${x * 100}%`)
      containerRef.current.style.setProperty("--mouse-y", `${y * 100}%`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 px-4"
      style={{
        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 211, 238, 0.1) 0%, transparent 50%)`,
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating Glass Cards */}
      <div className="absolute top-32 left-8 md:left-20">
        <motion.div
          className="bg-white/5 backdrop-blur-md border border-cyan-300/20 rounded-2xl p-4 w-48 md:w-56"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-cyan-300 text-sm font-semibold mb-1">Transactions Verified</div>
          <div className="text-white text-2xl md:text-3xl font-bold">12,847</div>
          <div className="text-gray-400 text-xs mt-2">On blockchain</div>
        </motion.div>
      </div>

      <div className="absolute bottom-32 right-8 md:right-20">
        <motion.div
          className="bg-white/5 backdrop-blur-md border border-teal-300/20 rounded-2xl p-4 w-48 md:w-56"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        >
          <div className="text-teal-300 text-sm font-semibold mb-1">Auditors Involved</div>
          <div className="text-white text-2xl md:text-3xl font-bold">384</div>
          <div className="text-gray-400 text-xs mt-2">Active worldwide</div>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div className="relative z-10 text-center max-w-4xl mx-auto">
        <Sparkles />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-400/20 to-teal-400/20 border border-cyan-400/40 rounded-full px-4 py-2 mb-6">
            <span className="text-cyan-300 text-sm font-semibold">Radical Transparency at Scale</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-green-300 bg-clip-text text-transparent">
            Radical transparency
          </span>
          <br />
          for real-world impact.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Laladulara bridges intention and action by removing friction while maintaining accountability at every step.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => onDonateClick?.()}
            className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-bold text-base px-8"
          >
            Get a Demo
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("campaigns")?.scrollIntoView({ behavior: "smooth" })}
            className="border-cyan-300/50 text-cyan-300 hover:bg-cyan-300/10 font-bold text-base px-8 bg-transparent"
          >
            Explore Campaigns
          </Button>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="outline"
              className="border-teal-300/50 text-teal-300 hover:bg-teal-300/10 font-bold text-base px-8 bg-transparent"
            >
              Create Campaign
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 text-gray-400 text-sm"
        >
          <p>Trusted by foundations, NGOs, and global partners</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
