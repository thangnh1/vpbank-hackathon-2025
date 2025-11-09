"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AceternitySidebar } from "@/components/aceternity-sidebar"

const dashboardItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "My Donations", href: "/dashboard/donations" },
  { name: "Receipts & Tax", href: "/dashboard/receipts" },
  { name: "Impact & Badges", href: "/dashboard/impact" },
  { name: "Following Campaigns", href: "/dashboard/campaigns" },
  { name: "My Campaigns", href: "/dashboard/my-campaigns" },
  { name: "Notifications", href: "/dashboard/notifications" },
  { name: "Settings", href: "/dashboard/settings" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AceternitySidebar items={dashboardItems} title="Laladulara" subtitle="Donor Dashboard" />

      {/* Main Content */}
      <main className="ml-72 p-8">
        <div className="max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Donor</h1>
            <p className="text-gray-400">Here's your impact summary</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Donated", value: "$24,500", change: "+12.5%" },
              { label: "Campaigns Supported", value: "8", change: "+2" },
              { label: "Verified Transactions", value: "87%", change: "+5%" },
              { label: "Avg. Time to Disburse", value: "14 days", change: "-2 days" },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-cyan-300/20 rounded-xl p-6 backdrop-blur-md hover:border-cyan-300/40 transition-colors"
              >
                <p className="text-gray-400 text-sm mb-2">{card.label}</p>
                <p className="text-3xl font-bold text-white mb-3">{card.value}</p>
                <p className="text-green-300 text-sm font-semibold">{card.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-300/20 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/my-campaigns">
                <Button className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold h-12">
                  Create Campaign
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button className="w-full bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-semibold h-12">
                  Explore Campaigns
                </Button>
              </Link>
              <Link href="/dashboard/donations">
                <Button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 text-slate-950 font-semibold h-12">
                  View Donations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
