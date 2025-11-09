"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Donation {
  id: string
  campaignId: string
  amount: number
  userName?: string
  message?: string
  createdAt: Date
  status: string
}

// Mock real-time donations data
const MOCK_DONATIONS: Donation[] = [
  {
    id: "1",
    campaignId: "camp-1",
    amount: 100000,
    userName: "Nguyen Van A",
    message: "Great cause!",
    createdAt: new Date(Date.now() - 60000),
    status: "COMPLETED",
  },
  {
    id: "2",
    campaignId: "camp-1",
    amount: 50000,
    userName: null,
    message: "Tài khoản ẩn danh",
    createdAt: new Date(Date.now() - 120000),
    status: "COMPLETED",
  },
  {
    id: "3",
    campaignId: "camp-1",
    amount: 250000,
    userName: "Tran Thi B",
    message: "Supporting education",
    createdAt: new Date(Date.now() - 300000),
    status: "COMPLETED",
  },
]

export function DonationFeed({ campaignId }: { campaignId: string }) {
  const [donations, setDonations] = useState(MOCK_DONATIONS)

  useEffect(() => {
    // Simulate real-time donations arriving
    const interval = setInterval(() => {
      const randomAmount = Math.floor(Math.random() * 400000) + 10000
      const newDonation: Donation = {
        id: `don-${Date.now()}`,
        campaignId,
        amount: randomAmount,
        userName: Math.random() > 0.3 ? `Donor ${Math.floor(Math.random() * 1000)}` : null,
        message: "Thank you for your work",
        createdAt: new Date(),
        status: "COMPLETED",
      }

      setDonations((prev) => [newDonation, ...prev.slice(0, 9)])
    }, 5000)

    return () => clearInterval(interval)
  }, [campaignId])

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {donations.map((donation, index) => (
        <motion.div
          key={donation.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
            {donation.userName?.charAt(0) || "A"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{donation.userName || "Tài khoản ẩn danh"}</p>
            <p className="text-xs text-gray-400 truncate">{donation.message}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-cyan-300 font-bold">₫{donation.amount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">
              {Math.round((Date.now() - donation.createdAt.getTime()) / 1000)}s ago
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
