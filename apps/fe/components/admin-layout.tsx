"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { name: "Overview", href: "/admin" },
  { name: "Campaigns", href: "/admin/campaigns" },
  { name: "Disbursements", href: "/admin/disbursements" },
  { name: "Audit Status", href: "/admin/audit" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Team & Roles", href: "/admin/team" },
  { name: "Settings", href: "/admin/settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-950/50 border-r border-cyan-300/10 backdrop-blur-xl p-6 overflow-y-auto">
        <Link href="/" className="block mb-8">
          <h2 className="text-2xl font-bold text-white hover:text-cyan-300 transition-colors">Laladulara</h2>
          <p className="text-gray-400 text-sm">Admin Dashboard</p>
        </Link>

        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
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
          <Link href="/">
            <Button variant="outline" className="w-full border-cyan-300/40 bg-transparent">
              Back to Site
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
