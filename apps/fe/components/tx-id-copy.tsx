"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface TxIdCopyProps {
  txId: string
  label?: string
}

export function TxIdCopy({ txId, label = "Transaction ID" }: TxIdCopyProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(txId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg p-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="font-mono text-sm text-cyan-300 truncate">{txId}</p>
      </div>
      <button onClick={handleCopy} className="p-2 hover:bg-cyan-500/10 rounded transition-colors">
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
      </button>
    </div>
  )
}
