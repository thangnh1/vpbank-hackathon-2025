"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"

interface Donation {
  id: string
  date: string
  campaign: string
  amount: number
  status: "Pending" | "Verified" | "Released" | "Refunded"
  txid: string
  evidence: boolean
  receipt: boolean
}

const donations: Donation[] = [
  {
    id: "1",
    date: "2024-11-15",
    campaign: "Ủng hộ lũ lụt",
    amount: 500,
    status: "Verified",
    txid: "0x2f5e...c3a2",
    evidence: true,
    receipt: true,
  },
  {
    id: "2",
    date: "2024-11-10",
    campaign: "Ủng hộ trẻ em vùng cao",
    amount: 1200,
    status: "Released",
    txid: "0x8b4f...a7c1",
    evidence: true,
    receipt: true,
  },
  {
    id: "3",
    date: "2024-11-05",
    campaign: "Ủng hộ Thái Nguyên",
    amount: 750,
    status: "Pending",
    txid: "0x3c9d...f2e5",
    evidence: false,
    receipt: false,
  },
]

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  Verified: "bg-green-500/20 text-green-300 border-green-400/30",
  Released: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
  Refunded: "bg-red-500/20 text-red-300 border-red-400/30",
}

export default function DonationsPage() {
  const [filters, setFilters] = useState({
    timeRange: "all",
    campaign: "all",
    status: "all",
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">My Donations</h1>
          <p className="text-gray-400">Track all your contributions and verify transactions</p>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.timeRange}
            onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
          >
            <option value="all" className="bg-slate-900">
              All Time
            </option>
            <option value="month" className="bg-slate-900">
              This Month
            </option>
            <option value="quarter" className="bg-slate-900">
              This Quarter
            </option>
            <option value="year" className="bg-slate-900">
              This Year
            </option>
          </select>

          <select
            value={filters.campaign}
            onChange={(e) => setFilters({ ...filters, campaign: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
          >
            <option value="all" className="bg-slate-900">
              All Campaigns
            </option>
            <option value="clean-water" className="bg-slate-900">
              Clean Water
            </option>
            <option value="education" className="bg-slate-900">
              Education
            </option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
          >
            <option value="all" className="bg-slate-900">
              All Status
            </option>
            <option value="pending" className="bg-slate-900">
              Pending
            </option>
            <option value="verified" className="bg-slate-900">
              Verified
            </option>
            <option value="released" className="bg-slate-900">
              Released
            </option>
          </select>
        </div>

        {/* Donations Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-cyan-300/20 rounded-xl overflow-hidden backdrop-blur-md"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-300/10">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Campaign</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">TXID</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <motion.tr
                  key={donation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-cyan-300/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white">{donation.date}</td>
                  <td className="px-6 py-4 text-white">{donation.campaign}</td>
                  <td className="px-6 py-4 text-cyan-300 font-semibold">${donation.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[donation.status]}`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-sm">{donation.txid}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View on explorer">
                      <ExternalLink size={16} className="text-cyan-300" />
                    </button>
                    {donation.evidence && (
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View evidence">
                        <Eye size={16} className="text-green-300" />
                      </button>
                    )}
                    {donation.receipt && (
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Download receipt">
                        <Download size={16} className="text-teal-300" />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Empty State Message */}
        {donations.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-gray-400 mb-4">No donations found with selected filters</p>
            <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
              Explore Campaigns
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
