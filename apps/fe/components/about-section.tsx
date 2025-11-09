"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const features = [
  {
    title: "Trust-First Design",
    description: "Every mechanism is designed with transparency as the foundation, not an afterthought.",
  },
  {
    title: "Blockchain + IPFS",
    description: "Immutable records and distributed storage ensure no single point of failure.",
  },
  {
    title: "AI Anomaly Detection",
    description: "Intelligent systems detect irregular patterns and flag potential issues automatically.",
  },
  {
    title: "Open Funnel Donation",
    description: "See where every dollar goes, from donation to impact on the ground.",
  },
]

export function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="about" ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why <span className="text-cyan-300">Laladulara</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built on principles of radical transparency and technological excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
              <div className="relative bg-white/5 backdrop-blur-md border border-cyan-300/20 rounded-2xl p-8 hover:border-cyan-300/40 transition-colors duration-300 h-full">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-cyan-300/40 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-300 to-teal-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
