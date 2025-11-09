"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminLayout from "@/components/admin-layout"

interface Disbursement {
  id: string
  campaign: string
  milestone: string
  amount: number
  attachments: number
  status: "Pending" | "Approved" | "Rejected"
  updated: string
}

const disbursements: Disbursement[] = [
  {
    id: "1",
    campaign: "Clean Water for Africa",
    milestone: "Phase 1 - Well Installation",
    amount: 50000,
    attachments: 5,
    status: "Pending",
    updated: "2 hours ago",
  },
  {
    id: "2",
    campaign: "Education & Scholarships",
    milestone: "Semester 1 Distribution",
    amount: 35000,
    attachments: 8,
    status: "Approved",
    updated: "1 day ago",
  },
  {
    id: "3",
    campaign: "Renewable Energy Initiative",
    milestone: "Solar Panel Installation",
    amount: 75000,
    attachments: 12,
    status: "Pending",
    updated: "3 hours ago",
  },
  {
    id: "4",
    campaign: "Healthcare Access Program",
    milestone: "Clinic Setup",
    amount: 45000,
    attachments: 6,
    status: "Rejected",
    updated: "2 days ago",
  },
]

const statusConfig = {
  Pending: { icon: Clock, color: "text-yellow-300", bg: "bg-yellow-500/20" },
  Approved: { icon: CheckCircle, color: "text-green-300", bg: "bg-green-500/20" },
  Rejected: { icon: XCircle, color: "text-red-300", bg: "bg-red-500/20" },
}

export default function DisbursementsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Disbursement Queue</h1>
          <p className="text-gray-400">Review and approve fund releases to campaigns</p>
        </motion.div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Pending Approvals", value: "2", color: "from-yellow-500" },
            { label: "Total Escrow", value: "$500K", color: "from-cyan-500" },
            { label: "Released This Month", value: "$180K", color: "from-green-500" },
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

        {/* Disbursements Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-cyan-300/20 rounded-xl overflow-hidden backdrop-blur-md"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-300/10">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Campaign</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Milestone</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Attachments</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disbursements.map((disburse) => {
                const statusCfg = statusConfig[disburse.status]
                const StatusIcon = statusCfg.icon
                return (
                  <motion.tr
                    key={disburse.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-cyan-300/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{disburse.campaign}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{disburse.milestone}</td>
                    <td className="px-6 py-4 text-cyan-300 font-semibold">${disburse.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-300">{disburse.attachments} files</td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}
                      >
                        <StatusIcon size={14} />
                        {disburse.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {disburse.status === "Pending" && (
                        <div className="flex gap-2">
                          <Button className="bg-green-500/20 text-green-300 border border-green-300/40 hover:bg-green-500/30 text-xs">
                            Approve
                          </Button>
                          <Button className="bg-red-500/20 text-red-300 border border-red-300/40 hover:bg-red-500/30 text-xs">
                            Reject
                          </Button>
                        </div>
                      )}
                      {disburse.status !== "Pending" && (
                        <Button className="bg-cyan-500/20 text-cyan-300 border border-cyan-300/40 text-xs">
                          View Details
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
