"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardCampaignsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/following-campaign-details")
  }, [router])
  return null
}
