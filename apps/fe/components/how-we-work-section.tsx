"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Globe } from "@/components/globe"

const steps = [
  {
    number: "01",
    title: "Intention",
    description: "Campaigns are created with clear goals and transparent metrics.",
    details: ["Define objectives", "Set measurable outcomes", "Document baseline data"],
  },
  {
    number: "02",
    title: "Funding",
    description: "Donors can track every contribution from pledge to deployment.",
    details: ["Real-time tracking", "Multi-signature approval", "Instant verification"],
  },
  {
    number: "03",
    title: "Execution",
    description: "Blockchain records ensure complete accountability at ground level.",
    details: ["On-chain execution", "Automated verification", "Real-time updates"],
  },
  {
    number: "04",
    title: "Impact",
    description: "Verified results delivered with detailed reports and proof of impact.",
    details: ["Impact metrics", "Audited releases", "Community verification"],
  },
]

export function HowWeWorkSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How We <span className="text-cyan-300">Work</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Four pillars of radical transparency and real-world accountability
          </p>
        </motion.div>

        {/* Timeline with Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left side - Steps */}
          <div className="lg:col-span-7">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="mb-8 last:mb-0"
              >
                <div className="flex gap-6">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border-2 border-cyan-400/40 flex items-center justify-center font-bold text-cyan-300 text-lg">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <motion.div
                        className="w-1 h-12 bg-gradient-to-b from-cyan-400/40 to-transparent mt-4"
                        initial={{ height: 0 }}
                        animate={inView ? { height: 48 } : {}}
                        transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 mb-4">{step.description}</p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                      className="flex flex-wrap gap-2"
                    >
                      {step.details.map((detail) => (
                        <span
                          key={detail}
                          className="text-xs px-3 py-1 bg-teal-500/10 border border-teal-400/30 text-teal-300 rounded-full"
                        >
                          {detail}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right side - Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="relative h-96 md:h-full min-h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-2xl backdrop-blur-md border border-cyan-300/20" />
              <div className="absolute inset-0 p-8 flex items-center justify-center">
                <Globe />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
