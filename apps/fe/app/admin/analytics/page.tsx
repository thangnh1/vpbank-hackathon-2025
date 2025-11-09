"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, DollarSign } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Campaign performance and donor insights</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Visit → Donate Funnel", value: "12.4%", icon: Users, trend: "+2.3%" },
            { label: "Avg. Donation Size", value: "$425", icon: DollarSign, trend: "+8.1%" },
            { label: "Time to Disburse (P50)", value: "14 days", icon: TrendingUp, trend: "-2 days" },
          ].map((metric, idx) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={24} className="text-cyan-300" />
                  <span className="text-green-300 text-sm font-semibold">{metric.trend}</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: "Fundraising Funnel", desc: "Visit → Donate → Verified" },
            { title: "Donor Cohorts", desc: "Performance by acquisition channel" },
            { title: "Cost Breakdown", desc: "Admin vs Impact spending" },
            { title: "Time to Disburse", desc: "P50/P95 distribution" },
          ].map((chart, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-cyan-300/20 rounded-lg p-8 backdrop-blur-md h-64 flex flex-col items-center justify-center text-center"
            >
              <TrendingUp size={32} className="text-cyan-300 mb-3" />
              <h3 className="font-semibold text-white mb-1">{chart.title}</h3>
              <p className="text-gray-400 text-sm">{chart.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
