"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AceternitySidebar } from "@/components/aceternity-sidebar"

const adminItems = [
  { name: "Overview", href: "/admin" },
  { name: "Campaigns", href: "/admin/campaigns" },
  { name: "Campaign Requests", href: "/admin/campaign-requests" },
  { name: "Disbursements", href: "/admin/disbursements" },
  { name: "Evidence Manager", href: "/admin/evidence" },
  { name: "Audit Status", href: "/admin/audit" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Team & Roles", href: "/admin/team" },
  { name: "Settings", href: "/admin/settings" },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AceternitySidebar items={adminItems} title="Laladulara" subtitle="Admin Dashboard" />

      {/* Main Content */}
      <main className="ml-72 p-8">
        <div className="max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage campaigns, verify disbursements, and monitor fraud</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Funds Raised", value: "$1.2M", color: "from-cyan-500" },
              { label: "In Escrow", value: "$450K", color: "from-blue-500" },
              { label: "Released", value: "$750K", color: "from-green-500" },
              { label: "Active Campaigns", value: "24", color: "from-purple-500" },
              { label: "Pending Approvals", value: "5", color: "from-orange-500" },
              { label: "Anomalies", value: "2", color: "from-red-500" },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-gradient-to-br ${card.color}/10 border border-${card.color.split("-")[1]}-300/20 rounded-lg p-4 backdrop-blur-md hover:border-opacity-40 transition-colors`}
              >
                <p className="text-gray-400 text-xs mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
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
            <h2 className="text-2xl font-bold text-white mb-6">Admin Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/campaign-requests">
                <Button className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-300 hover:to-red-400 text-white font-semibold h-12">
                  Review Campaign Requests (5)
                </Button>
              </Link>
              <Link href="/admin/disbursements">
                <Button className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold h-12">
                  Process Disbursements
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 text-slate-950 font-semibold h-12">
                  View Analytics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
