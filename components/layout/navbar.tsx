"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Check-in", href: "/check-in", active: true },
  { label: "Crisis Help", href: "/crisis", active: false },
  { label: "Psychologists", href: "/psikolog", active: false },
  { label: "Resources", href: "#sumber-daya", active: false },
]

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 shadow-sm bg-surface">
      <nav className="flex justify-between items-center px-12 py-4 max-w-[1200px] mx-auto">
        <Link
          href="/"
          className="font-extrabold text-2xl text-primary tracking-tight"
        >
          konseling.org
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={
                active
                  ? "text-primary border-b-2 border-primary font-bold pb-1 text-sm tracking-wide hover:text-primary transition-colors duration-200"
                  : "text-on-surface-variant font-medium text-sm tracking-wide hover:text-primary transition-colors duration-200"
              }
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hidden lg:flex rounded-full border-primary text-primary hover:bg-primary-fixed px-6"
          >
            My Account
          </Button>
          <Button className="rounded-full bg-primary text-on-primary hover:bg-primary/90 shadow-md px-6">
            Emergency Call
          </Button>
        </div>
      </nav>
    </header>
  )
}
