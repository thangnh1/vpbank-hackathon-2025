"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="contact" className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in <span className="text-cyan-300">Touch</span>
          </h2>
          <p className="text-gray-400 text-lg">Ready to join our mission? Reach out to learn more.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-cyan-300/20 rounded-2xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-cyan-300/20 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/10 border-cyan-300/20 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Organization</label>
              <Input
                type="text"
                placeholder="Your organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="bg-white/10 border-cyan-300/20 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Message</label>
              <Textarea
                placeholder="Tell us about your interest..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/10 border-cyan-300/20 text-white placeholder:text-gray-500 min-h-32"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-bold py-6 text-base"
            >
              {submitted ? "✓ Message Sent!" : "Send Message"}
            </Button>
          </form>

          <div className="mt-12 pt-12 border-t border-cyan-300/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-cyan-300/20 hover:border-cyan-300/40 rounded-lg p-4 text-left transition-colors"
            >
              <div className="font-semibold text-white mb-1">Book a Demo</div>
              <div className="text-sm text-gray-400">Schedule a personalized walkthrough</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-cyan-300/20 hover:border-cyan-300/40 rounded-lg p-4 text-left transition-colors"
            >
              <div className="font-semibold text-white mb-1">Email Us</div>
              <div className="text-sm text-gray-400">hello@laladulara.io</div>
            </motion.button>

            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-teal-500/20 to-green-500/20 border border-teal-300/40 hover:border-teal-300/60 rounded-lg p-4 text-left transition-colors w-full"
              >
                <div className="font-semibold text-teal-300 mb-1">Create a Campaign</div>
                <div className="text-sm text-gray-400">Launch your fundraiser today</div>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Mini FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 space-y-4"
        >
          <h3 className="text-white font-semibold text-center mb-6">Common Questions</h3>
          {[
            {
              q: "How does the verification process work?",
              a: "All transactions are recorded on blockchain and verified by our network of independent auditors within 24 hours.",
            },
            {
              q: "What makes Laladulara different?",
              a: "We combine blockchain immutability with AI anomaly detection and a distributed auditor network for unprecedented transparency.",
            },
            {
              q: "How do I get started?",
              a: "Contact our team for a personalized demo. We can have you live in less than a week.",
            },
          ].map((item, index) => (
            <details
              key={index}
              className="group bg-white/5 border border-cyan-300/20 rounded-lg p-4 hover:border-cyan-300/40 transition-colors cursor-pointer"
            >
              <summary className="text-white font-semibold flex justify-between items-center">
                {item.q}
                <span className="text-cyan-300 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">{item.a}</p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
