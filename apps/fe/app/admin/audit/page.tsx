"use client"

import { motion } from "framer-motion"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminLayout from "@/components/admin-layout"

interface AuditFinding {
  id: string
  campaign: string
  finding: string
  severity: "Low" | "Medium" | "High"
  owner: string
  dueDate: string
}

const findings: AuditFinding[] = [
  {
    id: "1",
    campaign: "Clean Water for Africa",
    finding: "Missing disbursement evidence for Phase 1",
    severity: "High",
    owner: "Jane Smith",
    dueDate: "2024-11-25",
  },
  {
    id: "2",
    campaign: "Education & Scholarships",
    finding: "Discrepancy in budget allocation",
    severity: "Medium",
    owner: "John Doe",
    dueDate: "2024-11-30",
  },
  {
    id: "3",
    campaign: "Renewable Energy Initiative",
    finding: "Receipt verification pending",
    severity: "Low",
    owner: "Alice Johnson",
    dueDate: "2024-12-05",
  },
]

const severityConfig = {
  Low: { icon: AlertCircle, color: "text-blue-300", bg: "bg-blue-500/20" },
  Medium: { icon: AlertTriangle, color: "text-yellow-300", bg: "bg-yellow-500/20" },
  High: { icon: AlertCircle, color: "text-red-300", bg: "bg-red-500/20" },
}

export default function AuditPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Audit Status</h1>
          <p className="text-gray-400">Review audit findings and verification status</p>
        </motion.div>

        {/* Audit Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Verified Campaigns", value: "18", color: "from-green-500" },
            { label: "Under Review", value: "4", color: "from-yellow-500" },
            { label: "Flagged Issues", value: "3", color: "from-red-500" },
            { label: "Verification Rate", value: "82%", color: "from-cyan-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${stat.color}/10 border border-${stat.color.split("-")[1]}-300/20 rounded-lg p-4`}
            >
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Findings Table */}
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
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Finding</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Severity</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Owner</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((finding) => {
                const severityCfg = severityConfig[finding.severity]
                const SeverityIcon = severityCfg.icon
                return (
                  <motion.tr
                    key={finding.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-cyan-300/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{finding.campaign}</td>
                    <td className="px-6 py-4 text-gray-300">{finding.finding}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${severityCfg.bg} ${severityCfg.color}`}
                      >
                        <SeverityIcon size={14} />
                        {finding.severity}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{finding.owner}</td>
                    <td className="px-6 py-4 text-gray-400">{finding.dueDate}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-cyan-300/20 rounded-xl p-6 text-center"
        >
          <p className="text-gray-400 mb-4">Generate audit reports for compliance and records</p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
              Export as CSV
            </Button>
            <Button className="bg-cyan-500/20 text-cyan-300 border border-cyan-300/40">Export as PDF</Button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
