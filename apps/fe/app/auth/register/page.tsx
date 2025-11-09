"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "individual",
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          userType: formData.userType,
          agreeTerms: formData.agreeTerms,
        }),
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Elements */}
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join us to make real impact</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-300/20 rounded-lg text-white focus:outline-none focus:border-cyan-300/40 transition-colors"
              >
                <option value="individual" className="bg-slate-900">
                  Individual Donor
                </option>
                <option value="organization" className="bg-slate-900">
                  Organization
                </option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/5 border border-cyan-300/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/40 transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-cyan-300/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/40 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-cyan-300/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300/40 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-white/10 border border-cyan-300/20"
                required
              />
              <span className="text-gray-400 text-sm">
                I agree to the{" "}
                <Link href="#" className="text-cyan-300 hover:text-cyan-200">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-cyan-300 hover:text-cyan-200">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading || !formData.agreeTerms}
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold py-3 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
