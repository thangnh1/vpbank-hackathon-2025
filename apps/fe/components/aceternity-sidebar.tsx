"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  name: string
  href: string
}

export function AceternitySidebar({
  items,
  title,
  subtitle,
}: { items: SidebarItem[]; title: string; subtitle: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-cyan-300/20 backdrop-blur-xl transition-all duration-300 ${
        isOpen ? "w-72" : "w-24"
      } z-50 overflow-y-auto`}
    >
      {/* Header */}
      <div className="p-6 border-b border-cyan-300/10">
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-1">
              Laladulara
            </h2>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {items.map((item, idx) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-400/30"
                    : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    isActive ? "bg-cyan-400 scale-100" : "bg-gray-600 scale-0"
                  }`}
                />
                {isOpen && <span className="text-sm font-medium">{item.name}</span>}
              </motion.button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-300/10 bg-gradient-to-t from-slate-950">
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full text-xs h-9 bg-transparent border-cyan-300/20 hover:border-cyan-300/40"
              >
                Back to Site
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}
