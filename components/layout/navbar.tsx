"use client"

import Link from "next/link"
import { Phone } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-saturate-150 backdrop-blur-md border-b border-(--color-outline-variant)" style={{ background: "color-mix(in srgb, var(--color-surface) 80%, transparent)" }}>
      <nav className="flex items-center justify-between px-8 py-4 max-w-[1200px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold text-[19px] tracking-tight text-(--color-on-surface)">
          <span className="w-8 h-8 rounded-[9px] grid place-items-center text-white" style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary-container) 100%)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <span>konseling<span className="text-(--color-secondary-container)">.org</span></span>
        </Link>
        <div className="hidden md:flex gap-8">
          {[["Masalah", "#masalah"], ["Cara Kerja", "#solusi"], ["Keamanan", "#safety"], ["Fitur", "#fitur"]].map(([l, h]) => (
            <Link key={h} href={h} className="text-[14px] font-medium text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors">{l}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:119" className="hidden sm:inline-flex k-btn k-btn-emergency"><Phone className="w-3.5 h-3.5" />119 SEJIWA</a>
          <Link href="/check-in" className="k-btn k-btn-primary">Coba Ngobrol Sekarang</Link>
        </div>
      </nav>
    </header>
  )
}
