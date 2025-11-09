"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

// Demo users for development
const DEMO_USERS = [
  { email: "donor@demo.dev", password: "demo123", role: "DONOR" },
  { email: "org@demo.dev", password: "demo123", role: "ORG_ADMIN" },
  { email: "auditor@demo.dev", password: "demo123", role: "AUDITOR" },
  { email: "admin@demo.dev", password: "demo123", role: "SUPERADMIN" },
]

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams?.get("returnTo") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDemoUsers, setShowDemoUsers] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      const destination = new URL(returnTo, window.location.origin).pathname
      router.push(destination)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* ... existing background elements ... */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-slate-950/50 border border-cyan-300/20 rounded-2xl backdrop-blur-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your Laladulara account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... existing email input ... */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-cyan-300/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/40 transition-colors"
                required
              />
            </div>

            {/* ... existing password input ... */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-cyan-300/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/40 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* ... existing remember me and submit ... */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border border-cyan-300/20" />
                <span className="text-gray-400">Remember me</span>
              </label>
              <Link href="#" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold py-3 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* ... existing divider ... */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-cyan-300/10" />
            <span className="text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 h-px bg-cyan-300/10" />
          </div>

          {/* ... existing social login ... */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="px-4 py-2 bg-white/5 border border-cyan-300/10 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors">
              Google
            </button>
            <button className="px-4 py-2 bg-white/5 border border-cyan-300/10 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors">
              VPBank
            </button>
          </div>

          {/* ... existing sign up link ... */}
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
              Sign up
            </Link>
          </p>

          <button
            onClick={() => setShowDemoUsers(!showDemoUsers)}
            className="mt-4 w-full text-xs text-gray-500 hover:text-gray-400 transition-colors"
          >
            {showDemoUsers ? "Hide demo credentials" : "Show demo credentials"}
          </button>

          {showDemoUsers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 bg-slate-800/50 border border-cyan-500/20 rounded-lg space-y-2 text-xs"
            >
              <p className="text-gray-400 font-semibold">Demo Users (password: demo123)</p>
              {DEMO_USERS.map((user) => (
                <p key={user.email} className="text-cyan-300">
                  → {user.email} ({user.role})
                </p>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
