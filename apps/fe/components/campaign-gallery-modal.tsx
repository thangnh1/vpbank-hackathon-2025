"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Campaign {
  id: number
  title: string
  raised: number
  goal: number
  status: string
  image: string
  category: string
  description: string
  impact: string
}

const campaigns: Campaign[] = [
  {
    id: 1,
    title: "Clean Water for Africa",
    raised: 145000,
    goal: 200000,
    status: "Active",
    image: "/placeholder.svg?height=400&width=600",
    category: "Environment",
    description:
      "Providing access to clean water through well installation and maintenance programs in rural communities.",
    impact: "5,000+ people have access to clean water",
  },
  {
    id: 2,
    title: "Education & Scholarships",
    raised: 89000,
    goal: 150000,
    status: "Active",
    image: "/placeholder.svg?height=400&width=600",
    category: "Education",
    description: "Supporting underprivileged students with full scholarships and educational resources.",
    impact: "450 students receiving quality education",
  },
  {
    id: 3,
    title: "Renewable Energy Initiative",
    raised: 220000,
    goal: 300000,
    status: "Active",
    image: "/placeholder.svg?height=400&width=600",
    category: "Energy",
    description: "Installing solar panels in remote villages to provide sustainable energy access.",
    impact: "200 households powered by renewable energy",
  },
  {
    id: 4,
    title: "Healthcare Access Program",
    raised: 156000,
    goal: 180000,
    status: "Active",
    image: "/placeholder.svg?height=400&width=600",
    category: "Healthcare",
    description: "Building and staffing clinics in underserved areas with medical professionals.",
    impact: "50,000+ healthcare consultations delivered",
  },
  {
    id: 5,
    title: "Community Food Security",
    raised: 78000,
    goal: 120000,
    status: "Active",
    image: "/placeholder.svg?height=400&width=600",
    category: "Food",
    description: "Implementing sustainable farming and food distribution programs for vulnerable populations.",
    impact: "2,000+ families with reliable food sources",
  },
  {
    id: 6,
    title: "Women Empowerment Fund",
    raised: 112000,
    goal: 160000,
    status: "Active",
    image: "/placeholder.svg?height=400&width=600",
    category: "Social",
    description: "Providing skills training and microfinance to women entrepreneurs.",
    impact: "800 women-led businesses established",
  },
]

interface CampaignGalleryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CampaignGalleryModal({ isOpen, onClose }: CampaignGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentCampaign, setCurrentCampaign] = useState(campaigns[0])

  useEffect(() => {
    setCurrentCampaign(campaigns[currentIndex])
  }, [currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % campaigns.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-slate-950 border border-cyan-300/20 rounded-3xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Gallery Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                {/* Left - Image */}
                <motion.div className="relative aspect-video md:aspect-auto md:h-96 rounded-2xl overflow-hidden">
                  <img
                    src={currentCampaign.image || "/placeholder.svg"}
                    alt={currentCampaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {currentCampaign.category}
                    </span>
                  </div>
                </motion.div>

                {/* Right - Info */}
                <div className="flex flex-col justify-between">
                  <div>
                    <motion.h2
                      key={currentCampaign.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl md:text-3xl font-bold text-white mb-3"
                    >
                      {currentCampaign.title}
                    </motion.h2>

                    <motion.p
                      key={`desc-${currentCampaign.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-gray-300 mb-6 leading-relaxed"
                    >
                      {currentCampaign.description}
                    </motion.p>

                    {/* Impact */}
                    <motion.div
                      key={`impact-${currentCampaign.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-6"
                    >
                      <p className="text-sm text-gray-400 mb-1">Current Impact</p>
                      <p className="text-green-300 font-semibold">{currentCampaign.impact}</p>
                    </motion.div>

                    {/* Progress */}
                    <motion.div
                      key={`progress-${currentCampaign.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Funding Progress</span>
                        <span className="text-sm font-semibold text-cyan-300">
                          {Math.round((currentCampaign.raised / currentCampaign.goal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                          style={{ width: `${(currentCampaign.raised / currentCampaign.goal) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>${currentCampaign.raised.toLocaleString()}</span>
                        <span>Goal: ${currentCampaign.goal.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-8">
                    <Button className="flex-1 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold">
                      Donate Now
                    </Button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Heart size={20} className="text-cyan-300" />
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Share2 size={20} className="text-cyan-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-6 border-t border-cyan-300/10">
                <button onClick={handlePrev} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <ChevronLeft size={20} className="text-white" />
                </button>

                <div className="flex gap-2">
                  {campaigns.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex ? "bg-cyan-400 w-8" : "bg-white/20 w-2"
                      }`}
                      animate={{
                        width: index === currentIndex ? 32 : 8,
                        backgroundColor: index === currentIndex ? "#00e5ff" : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>

                <button onClick={handleNext} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>

              {/* Counter */}
              <div className="absolute bottom-6 left-6 text-sm text-gray-400">
                {currentIndex + 1} / {campaigns.length}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
