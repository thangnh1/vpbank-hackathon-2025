"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  fallbackHref?: string
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ label: string; href?: string }>
  className?: string
}

export function BackButton({
  fallbackHref = "/",
  showBreadcrumb = true,
  breadcrumbItems = [],
  className = "",
}: BackButtonProps) {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Check if browser history is available
    setCanGoBack(window.history.length > 1)
  }, [])

  const handleBack = () => {
    if (canGoBack) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleBack}
        className={`flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors ${className}`}
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-cyan-300 transition-colors">
            Home
          </Link>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-cyan-300 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}
