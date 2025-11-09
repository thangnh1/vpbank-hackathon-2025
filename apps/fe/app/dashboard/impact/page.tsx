"use client"

import { motion } from "framer-motion"
import { Share2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"

interface Badge {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

const badges: Badge[] = [
  { id: "1", title: "First Donor", description: "Made your first donation", icon: "🎯", unlocked: true },
  { id: "2", title: "Century Supporter", description: "$100+ total donated", icon: "💯", unlocked: true },
  { id: "3", title: "Impact Champion", description: "$1000+ total donated", icon: "🏆", unlocked: false },
  { id: "4", title: "Verified Trust", description: "100% verified donations", icon: "✅", unlocked: true },
  { id: "5", title: "Time Keeper", description: "Donated within first month of campaign", icon: "⏰", unlocked: true },
  { id: "6", title: "Impact Multiplier", description: "Supported 5+ campaigns", icon: "🌟", unlocked: false },
]

export default function ImpactPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Your Impact & Badges</h1>
          <p className="text-gray-400">Track your achievements and real-world impact</p>
        </motion.div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Donated", value: "$24,500", color: "from-cyan-500" },
            { label: "Campaigns Supported", value: "8", color: "from-teal-500" },
            { label: "Lives Impacted (Est.)", value: "12,400+", color: "from-green-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${stat.color}/10 border border-${stat.color.split("-")[1]}-300/20 rounded-lg p-6`}
            >
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-lg p-6 backdrop-blur-md transition-all ${
                  badge.unlocked
                    ? "bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-300/40"
                    : "bg-white/5 border border-gray-500/20 opacity-60"
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-white mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-400">{badge.description}</p>
                {badge.unlocked && <div className="mt-3 text-xs text-green-300 font-semibold">Unlocked</div>}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Share Impact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-cyan-300/20 rounded-xl p-8 text-center"
        >
          <Trophy size={48} className="mx-auto mb-4 text-cyan-300" />
          <h3 className="text-2xl font-bold text-white mb-2">Share Your Impact</h3>
          <p className="text-gray-400 mb-6">Inspire others by sharing your contribution journey</p>
          <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold gap-2">
            <Share2 size={18} />
            Share on Social
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
