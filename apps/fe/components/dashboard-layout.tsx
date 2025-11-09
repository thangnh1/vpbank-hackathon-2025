"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "My Donations", href: "/dashboard/donations" },
  { name: "Receipts & Tax", href: "/dashboard/receipts" },
  { name: "Impact & Badges", href: "/dashboard/impact" },
  { name: "Following Campaigns", href: "/dashboard/campaigns" },
  { name: "Notifications", href: "/dashboard/notifications" },
  { name: "Settings", href: "/dashboard/settings" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-950/50 border-r border-cyan-300/10 backdrop-blur-xl p-6 overflow-y-auto">
        <Link href="/" className="block mb-8">
          <h2 className="text-2xl font-bold text-white hover:text-cyan-300 transition-colors">Laladulara</h2>
          <p className="text-gray-400 text-sm">Donor Dashboard</p>
        </Link>

        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-300/40"
                    : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="space-y-2 pt-8 border-t border-cyan-300/10">
          <Link href="/campaigns">
            <Button className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold">
              Explore Campaigns
            </Button>
          </Link>
          <button className="w-full px-4 py-3 text-gray-400 hover:text-red-300 transition-colors flex items-center justify-center gap-2 rounded-lg hover:bg-white/5">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl">
          {children}
        </motion.div>
      </main>
    </div>
  )
}
