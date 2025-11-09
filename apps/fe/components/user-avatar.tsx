"use client"

export function UserAvatar({ name, src, size = 32 }: { name: string; src?: string; size?: number }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("")

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} width={size} height={size} className="rounded-full object-cover border border-white/20" />
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 text-slate-950 border border-white/20 flex items-center justify-center text-xs font-bold"
      title={name}
    >
      {initials || "U"}
    </div>
  )
}
