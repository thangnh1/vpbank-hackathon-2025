"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AceternitySidebar } from "@/components/aceternity-sidebar"

const dashboardItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "My Donations", href: "/dashboard/donations" },
  { name: "Following Campaigns", href: "/dashboard/campaigns" },
  { name: "My Campaigns", href: "/dashboard/my-campaigns" },
  { name: "Notifications", href: "/dashboard/notifications" },
  { name: "Settings", href: "/dashboard/settings" },
]

interface CampaignForm {
  title: string
  description: string
  goal: string
  category: string
  location: string
  timeline: string
  image: string
}

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Clean Water for Africa",
      goal: 200000,
      raised: 145000,
      status: "approved",
      createdAt: "2024-01-15",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CampaignForm>({
    title: "",
    description: "",
    goal: "",
    category: "",
    location: "",
    timeline: "",
    image: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCampaign = {
      id: campaigns.length + 1,
      title: formData.title,
      goal: Number.parseInt(formData.goal) || 0,
      raised: 0,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCampaigns([...campaigns, newCampaign])
    setFormData({ title: "", description: "", goal: "", category: "", location: "", timeline: "", image: "" })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AceternitySidebar items={dashboardItems} title="Laladulara" subtitle="Donor Dashboard" />

      <main className="ml-72 p-8">
        <div className="max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">My Campaigns</h1>
                <p className="text-gray-400">Create and manage your campaigns</p>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold h-12 px-6"
              >
                {showForm ? "Cancel" : "Create Campaign"}
              </Button>
            </div>
          </motion.div>

          {/* Campaign Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-cyan-300/20 rounded-xl p-8 mb-8 backdrop-blur-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Campaign</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/10 border border-cyan-300/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/60"
                      placeholder="e.g., Clean Water Initiative"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal ($)</label>
                    <input
                      type="number"
                      required
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full bg-white/10 border border-cyan-300/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/60"
                      placeholder="e.g., 200000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/10 border border-cyan-300/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-300/60"
                    >
                      <option value="">Select Category</option>
                      <option value="environment">Environment</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="food">Food Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white/10 border border-cyan-300/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/60"
                      placeholder="e.g., Kenya, Uganda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timeline</label>
                    <input
                      type="text"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-white/10 border border-cyan-300/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/60"
                      placeholder="e.g., 24 months"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/10 border border-cyan-300/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/60 resize-none h-32"
                    placeholder="Describe your campaign, goals, and impact..."
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="bg-transparent border-cyan-300/20 text-gray-300 hover:border-cyan-300/40"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold"
                  >
                    Submit for Review
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Campaigns List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Your Campaigns ({campaigns.length})</h3>
            {campaigns.map((campaign, idx) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-cyan-300/20 rounded-xl p-6 backdrop-blur-md hover:border-cyan-300/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">{campaign.title}</h4>
                    <p className="text-gray-400 text-sm">Created on {campaign.createdAt}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === "approved"
                        ? "bg-green-500/20 text-green-300"
                        : campaign.status === "pending"
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Raised</p>
                    <p className="text-2xl font-bold text-cyan-300">${campaign.raised.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Goal</p>
                    <p className="text-2xl font-bold text-white">${campaign.goal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Progress</p>
                    <p className="text-2xl font-bold text-teal-300">
                      {Math.round((campaign.raised / campaign.goal) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold">
                      View Campaign
                    </Button>
                  </Link>
                  <Link href={`/dashboard/my-campaigns/${campaign.id}/edit`}>
                    <Button
                      variant="outline"
                      className="bg-transparent border-cyan-300/20 text-gray-300 hover:border-cyan-300/40"
                    >
                      Manage
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
