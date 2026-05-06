"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

const navLinks = [
  { label: "Check-in", href: "/check-in" },
  { label: "Crisis Help", href: "/crisis" },
  { label: "Psikolog", href: "/psikolog" },
  { label: "Sumber Daya", href: "#sumber-daya" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-nav"
          : "bg-surface"
      )}
    >
      <nav className="container flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-extrabold text-primary tracking-tight"
        >
          Konseling.org
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Akun Saya
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-error-container text-on-error-container hover:bg-error-container/80 font-semibold text-sm px-4"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
            Darurat
          </Button>
        </div>
      </nav>
    </header>
  )
}
