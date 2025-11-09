"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pause, Play, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminLayout from "@/components/admin-layout"

interface Campaign {
  id: string
  name: string
  goal: number
  raised: number
  milestones: number
  status: "Draft" | "Live" | "Paused" | "Completed"
  lastUpdate: string
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Clean Water for Africa",
    goal: 200000,
    raised: 145000,
    milestones: 4,
    status: "Live",
    lastUpdate: "2 hours ago",
  },
  {
    id: "2",
    name: "Education & Scholarships",
    goal: 150000,
    raised: 89000,
    milestones: 3,
    status: "Live",
    lastUpdate: "1 day ago",
  },
  {
    id: "3",
    name: "Renewable Energy Initiative",
    goal: 300000,
    raised: 220000,
    milestones: 5,
    status: "Live",
    lastUpdate: "3 hours ago",
  },
  {
    id: "4",
    name: "Healthcare Access Program",
    goal: 180000,
    raised: 156000,
    milestones: 4,
    status: "Paused",
    lastUpdate: "5 days ago",
  },
]

const statusColors = {
  Draft: "bg-gray-500/20 text-gray-300",
  Live: "bg-green-500/20 text-green-300",
  Paused: "bg-yellow-500/20 text-yellow-300",
  Completed: "bg-blue-500/20 text-blue-300",
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const tabs = ["All", "Draft", "Live", "Paused", "Completed"]
  const filteredCampaigns = activeTab === "all" ? campaigns : campaigns.filter((c) => c.status === activeTab)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Campaigns</h1>
            <p className="text-gray-400">Manage all your campaigns</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold gap-2">
            <Plus size={20} />
            Create Campaign
          </Button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.toLowerCase()
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-300/40"
                  : "bg-white/5 text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Campaigns Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-cyan-300/20 rounded-xl overflow-hidden backdrop-blur-md"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-300/10">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Goal</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Raised</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Milestones</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Last Update</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-cyan-300/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">{campaign.name}</td>
                  <td className="px-6 py-4 text-gray-300">${campaign.goal.toLocaleString()}</td>
                  <td className="px-6 py-4 text-cyan-300 font-semibold">${campaign.raised.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-300">{campaign.milestones}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[campaign.status]}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{campaign.lastUpdate}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View">
                      <Eye size={16} className="text-cyan-300" />
                    </button>
                    {campaign.status === "Live" && (
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Pause">
                        <Pause size={16} className="text-yellow-300" />
                      </button>
                    )}
                    {campaign.status === "Paused" && (
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Resume">
                        <Play size={16} className="text-green-300" />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
