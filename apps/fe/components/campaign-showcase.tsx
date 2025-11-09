"use client"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const campaigns = [
  {
    id: 1,
    title: "Clean Water for Africa",
    raised: 145000,
    goal: 200000,
    status: "Active",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "Education & Scholarships",
    raised: 89000,
    goal: 150000,
    status: "Active",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    title: "Renewable Energy Initiative",
    raised: 220000,
    goal: 300000,
    status: "Active",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    title: "Healthcare Access Program",
    raised: 156000,
    goal: 180000,
    status: "Active",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    title: "Community Food Security",
    raised: 78000,
    goal: 120000,
    status: "Active",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 6,
    title: "Women Empowerment Fund",
    raised: 112000,
    goal: 160000,
    status: "Active",
    image: "/placeholder.svg?height=300&width=400",
  },
]

interface CampaignShowcaseProps {
  onDonateClick?: () => void
}

export function CampaignShowcase({ onDonateClick }: CampaignShowcaseProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="campaigns" className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="text-teal-300">Campaigns</span>
          </h2>
          <p className="text-gray-400 text-lg">Transparent, audited, and making real impact</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {campaigns.map((campaign) => (
            <motion.div key={campaign.id} variants={itemVariants} className="group cursor-pointer">
              <Card className="overflow-hidden bg-white/5 border-cyan-300/20 hover:border-cyan-300/40 transition-all duration-300 h-full flex flex-col backdrop-blur-md">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
                  <img
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <span className="inline-block bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {campaign.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {campaign.title}
                  </h3>

                  <div className="mt-auto space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-semibold text-cyan-300">
                          {Math.round((campaign.raised / campaign.goal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(campaign.raised / campaign.goal) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: 0.3 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">${campaign.raised.toLocaleString()} raised</span>
                      <span className="text-gray-500">of ${campaign.goal.toLocaleString()}</span>
                    </div>

                    <Button
                      onClick={() => onDonateClick?.()}
                      className="w-full mt-3 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-semibold text-sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
