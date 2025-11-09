"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onDonateClick?: () => void
}

export function Header({ onDonateClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#how-we-work", label: "How We Work" },
    { href: "#campaigns", label: "Campaigns" },
    { href: "#impact", label: "Impact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-slate-950/70 backdrop-blur-lg border-b border-teal-500/20" : "bg-transparent",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center font-bold text-white">
              L
            </div>
            <span className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">Laladulara</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-cyan-300 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold"
              onClick={() => {
                onDonateClick?.()
                setIsOpen(false)
              }}
            >
              Donate Now
            </Button>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="px-6 mx-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-teal-500/20 bg-slate-950/50 rounded-lg p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-cyan-300 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              className="w-full mt-4 bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-semibold"
              onClick={() => {
                onDonateClick?.()
                setIsOpen(false)
              }}
            >
              Donate Now
            </Button>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="px-6 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                Đăng nhập
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
