import Link from "next/link"
import { Globe, Mail } from "lucide-react"

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Crisis Resources", href: "#" },
  { label: "Contact Us", href: "#" },
]

export function Footer() {
  return (
    <footer className="w-full mt-20 bg-surface-container">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-12 gap-6 w-full max-w-[1200px] mx-auto">
        <div className="space-y-4 text-center md:text-left">
          <div className="text-2xl font-bold text-primary">konseling.org</div>
          <p className="text-base text-on-surface-variant max-w-[400px]">
            © 2026 konseling.org — Companion for your mental well-being.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-semibold tracking-wide text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer hover:bg-primary-fixed transition-all">
            <Globe className="w-5 h-5" aria-label="Website" />
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer hover:bg-primary-fixed transition-all">
            <Mail className="w-5 h-5" aria-label="Email" />
          </div>
        </div>
      </div>
    </footer>
  )
}
