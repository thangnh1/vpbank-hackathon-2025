"use client"

import { motion } from "framer-motion"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"

interface Receipt {
  id: string
  period: string
  amount: number
  campaign: string
  date: string
}

const receipts: Receipt[] = [
  { id: "1", period: "Q4 2024", amount: 2450, campaign: "Multiple", date: "2024-11-20" },
  { id: "2", period: "Q3 2024", amount: 3120, campaign: "Multiple", date: "2024-10-15" },
  { id: "3", period: "Q2 2024", amount: 1890, campaign: "Education", date: "2024-07-10" },
]

export default function ReceiptsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Receipts & Tax</h1>
          <p className="text-gray-400">Download your donation receipts for tax purposes</p>
        </motion.div>

        {/* Tax Guide Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-300/20 rounded-xl p-6"
        >
          <h3 className="text-white font-semibold mb-2">Tax Deduction Guide</h3>
          <p className="text-gray-400">
            All donations made through Laladulara are tax-deductible. Keep your receipts for your annual tax filing.
          </p>
        </motion.div>

        {/* Receipts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receipts.map((receipt, idx) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md hover:border-cyan-300/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText size={24} className="text-cyan-300" />
                <div>
                  <h3 className="font-bold text-white">{receipt.period}</h3>
                  <p className="text-sm text-gray-400">{receipt.date}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-cyan-300">${receipt.amount}</p>
              </div>
              <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
                <Download size={16} />
                Download PDF
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Create Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-cyan-300/20 rounded-xl p-6 text-center"
        >
          <h3 className="text-white font-semibold mb-2">Generate Tax Summary</h3>
          <p className="text-gray-400 mb-4">Create a comprehensive annual report for your tax return</p>
          <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
            Create Tax Summary
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
