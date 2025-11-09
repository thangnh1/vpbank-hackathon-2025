"use client"

import { useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useReturnTo(defaultPath = "/") {
  const searchParams = useSearchParams()
  const returnTo = searchParams?.get("returnTo")

  const isValidPath = useCallback((path: string): boolean => {
    return path?.startsWith("/") && !path.startsWith("//")
  }, [])

  const getReturnPath = useCallback((): string => {
    if (returnTo && isValidPath(returnTo)) {
      return returnTo
    }
    return defaultPath
  }, [returnTo, isValidPath, defaultPath])

  return { returnTo: getReturnPath(), setReturnTo: (path: string) => path }
}
