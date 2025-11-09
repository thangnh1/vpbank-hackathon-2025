"use client"

import { useEffect, useRef } from "react"

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadGlobe = async () => {
      if (!containerRef.current) return

      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/globe.js/2.1.66/globe.min.js"
      script.async = true
      script.onload = () => {
        // Create a simple globe visualization using CSS and SVG
        createGlobeVisualization()
      }
      document.body.appendChild(script)
    }

    const createGlobeVisualization = () => {
      if (!containerRef.current) return

      // Create SVG globe with animated dots
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("viewBox", "0 0 200 200")
      svg.setAttribute("className", "w-full h-full")

      // Add gradient definitions
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
      const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
      gradient.setAttribute("id", "globeGradient")
      gradient.innerHTML = `
        <stop offset="0%" style="stop-color:#00e5ff;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:0.1" />
      `
      defs.appendChild(gradient)
      svg.appendChild(defs)

      // Add sphere
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", "100")
      circle.setAttribute("cy", "100")
      circle.setAttribute("r", "95")
      circle.setAttribute("fill", "url(#globeGradient)")
      circle.setAttribute("stroke", "#00e5ff")
      circle.setAttribute("stroke-width", "0.5")
      circle.setAttribute("opacity", "0.3")
      svg.appendChild(circle)

      // Add animated connection points
      const points = [
        { x: 100, y: 30 },
        { x: 150, y: 60 },
        { x: 130, y: 140 },
        { x: 70, y: 130 },
        { x: 50, y: 70 },
      ]

      points.forEach((point, index) => {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        dot.setAttribute("cx", String(point.x))
        dot.setAttribute("cy", String(point.y))
        dot.setAttribute("r", "2")
        dot.setAttribute("fill", "#00e5ff")
        dot.setAttribute("style", `animation: pulse 2s ease-in-out ${index * 0.3}s infinite; opacity: 0.8;`)
        svg.appendChild(dot)
      })

      // Connect some points with lines
      const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line1.setAttribute("x1", "100")
      line1.setAttribute("y1", "30")
      line1.setAttribute("x2", "150")
      line1.setAttribute("y2", "60")
      line1.setAttribute("stroke", "#00e5ff")
      line1.setAttribute("stroke-width", "0.5")
      line1.setAttribute("opacity", "0.4")
      svg.appendChild(line1)

      containerRef.current.appendChild(svg)
    }

    loadGlobe()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
