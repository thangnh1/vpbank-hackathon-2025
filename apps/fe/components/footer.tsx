"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-cyan-300/10 bg-gradient-to-t from-slate-950 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center font-bold text-white">
                L
              </div>
              <span className="font-bold text-lg text-white">Laladulara</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Radical transparency for real-world impact. Building trust through technology.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Campaigns", "Pricing", "Security"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Impact", "Team", "Careers"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4 mb-6">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.2 }}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-cyan-300/20 flex items-center justify-center text-gray-400 hover:text-cyan-300 hover:border-cyan-300/40 transition-colors"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:hello@laladulara.io" className="hover:text-cyan-300 transition-colors">
                  laladulara.contact@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+1234567890" className="hover:text-cyan-300 transition-colors">
                  +84 (234) 567-890
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-300/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {currentYear} Laladulara. All rights reserved. Building transparency at scale.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-cyan-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-cyan-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
