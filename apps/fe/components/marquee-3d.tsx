"use client"

import { motion } from "framer-motion"

const partners = [
  "🏦 Global Bank",
  "🎓 Unity Foundation",
  "🌍 World Partners",
  "💡 Impact Labs",
  "🔐 Trust Audit",
  "📊 Data Analytics",
  "🤝 Community Corps",
  "🌟 Vision Fund",
]

export function Marquee3D() {
  return (
    <div className="relative w-full overflow-hidden bg-white/5 border border-cyan-300/10 rounded-xl p-8">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: [-1000, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {[...partners, ...partners].map((partner, idx) => (
          <div
            key={idx}
            className="text-lg font-semibold text-gray-400 hover:text-cyan-300 transition-colors px-6 py-3 bg-white/5 rounded-lg border border-cyan-300/10 hover:border-cyan-300/40 flex-shrink-0"
          >
            {partner}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
