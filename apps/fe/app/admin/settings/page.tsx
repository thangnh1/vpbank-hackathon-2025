"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminLayout from "@/components/admin-layout"

export default function SettingsPage() {
  const [orgSettings, setOrgSettings] = useState({
    orgName: "My Organization",
    logo: "",
    description: "Making real-world impact through transparent giving",
  })

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Organization Settings</h1>
          <p className="text-gray-400">Configure your organization profile and integrations</p>
        </motion.div>

        {/* Organization Profile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-6">Organization Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name</label>
              <input
                type="text"
                value={orgSettings.orgName}
                onChange={(e) => setOrgSettings({ ...orgSettings, orgName: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={orgSettings.description}
                onChange={(e) => setOrgSettings({ ...orgSettings, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold gap-2">
              <Save size={18} />
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* Payout Accounts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-4">Payout Accounts</h2>
          <p className="text-gray-400 text-sm mb-4">Add bank account for fund disbursement</p>
          <Button className="bg-cyan-500/20 text-cyan-300 border border-cyan-300/40 hover:bg-cyan-500/30">
            Add Payout Account
          </Button>
        </motion.div>

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-4">Branding</h2>
          <p className="text-gray-400 text-sm mb-4">Customize the appearance of your campaign pages</p>
          <div className="space-y-3">
            <Button className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-300/40 hover:bg-cyan-500/30">
              Upload Logo
            </Button>
            <Button className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-300/40 hover:bg-cyan-500/30">
              Configure Colors
            </Button>
          </div>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-4">Integrations</h2>
          <p className="text-gray-400 text-sm mb-4">Connect external services and generate API keys</p>
          <div className="space-y-3">
            <Button className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-300/40 hover:bg-cyan-500/30">
              Manage Webhooks
            </Button>
            <Button className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-300/40 hover:bg-cyan-500/30">
              Generate API Key
            </Button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
