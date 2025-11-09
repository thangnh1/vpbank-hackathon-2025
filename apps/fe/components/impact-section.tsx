"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Marquee3D } from "@/components/marquee-3d"

const stats = [
  { label: "Total Donations", value: "$2.4M", suffix: "verified" },
  { label: "Audited Releases", value: "847", suffix: "campaigns" },
  { label: "Avg. Time to Disburse", value: "2.3", suffix: "days" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    org: "Global Foundation",
    text: "Laladulara transformed how we manage our charitable giving. Complete transparency from day one.",
  },
  {
    name: "Marcus Johnson",
    org: "Impact Ventures",
    text: "The accountability measures are unprecedented. Our donors feel truly empowered.",
  },
  {
    name: "Elena Rodriguez",
    org: "Community Leaders Network",
    text: "Finally, a platform that treats us as partners, not just recipients. Trust rebuilt.",
  },
]

export function ImpactSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="impact" ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300 font-semibold mb-1">{stat.label}</div>
              <div className="text-gray-500 text-sm">{stat.suffix}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Marquee Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <h3 className="text-center text-gray-400 text-sm font-semibold mb-8 uppercase tracking-widest">
            Trusted Partners & Auditors
          </h3>
          <Marquee3D />
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
            Voices of <span className="text-teal-300">Impact</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-teal-300/20 rounded-2xl p-6 hover:border-teal-300/40 transition-colors"
              >
                <p className="text-gray-300 mb-4 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="border-t border-teal-300/10 pt-4">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-teal-300 text-sm">{testimonial.org}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
