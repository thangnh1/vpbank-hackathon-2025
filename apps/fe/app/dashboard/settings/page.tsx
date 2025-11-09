"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Shield, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    publicName: true,
    anonymousDefault: false,
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your profile and account settings</p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield size={20} className="text-cyan-300" />
            Profile Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                className="w-full px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40 opacity-60 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.publicName}
                  onChange={(e) => setProfile({ ...profile, publicName: e.target.checked })}
                  className="w-4 h-4 rounded bg-white/10 border border-cyan-300/20"
                />
                <span className="text-gray-300">Show my name publicly on donations</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.anonymousDefault}
                  onChange={(e) => setProfile({ ...profile, anonymousDefault: e.target.checked })}
                  className="w-4 h-4 rounded bg-white/10 border border-cyan-300/20"
                />
                <span className="text-gray-300">Make donations anonymous by default</span>
              </label>
            </div>

            <Button className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold gap-2 mt-6">
              <Save size={18} />
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock size={20} className="text-cyan-300" />
            Security
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <input
                type="password"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
              Update Password
            </Button>
          </div>
        </motion.div>

        {/* VPBank Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-md"
        >
          <h3 className="font-bold text-white mb-3">Link VPBank Account</h3>
          <p className="text-gray-400 text-sm mb-4">Connect your VPBank account for direct receipt generation</p>
          <Button className="bg-cyan-500/20 text-cyan-300 border border-cyan-300/40 hover:bg-cyan-500/30">
            Link VPBank
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
