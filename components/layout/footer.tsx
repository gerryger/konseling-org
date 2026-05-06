import Link from "next/link"
import { Globe, Mail, Phone } from "lucide-react"

const serviceLinks = [
  { label: "Check-in Perasaan", href: "/check-in" },
  { label: "Crisis Help", href: "/crisis" },
  { label: "Direktori Psikolog", href: "/psikolog" },
  { label: "Sumber Daya", href: "#sumber-daya" },
]

const legalLinks = [
  { label: "Privasi", href: "#" },
  { label: "Ketentuan", href: "#" },
  { label: "Sumber Krisis", href: "#" },
]

const bottomLinks = ["Kebijakan Privasi", "Syarat & Ketentuan", "Kontak"]

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <p className="text-xl font-extrabold text-white mb-3">Konseling.org</p>
            <p className="text-sm text-outline leading-relaxed">
              Pendampingan setia dalam setiap langkah perjalanan kesehatan mental Anda.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Layanan
            </p>
            <ul className="space-y-2">
              {serviceLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-outline-variant hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Legal
            </p>
            <ul className="space-y-2">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-outline-variant hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Kontak
            </p>
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-outline hover:text-white cursor-pointer transition-colors" aria-label="Website" />
              <Mail className="w-5 h-5 text-outline hover:text-white cursor-pointer transition-colors" aria-label="Email" />
              <Phone className="w-5 h-5 text-outline hover:text-white cursor-pointer transition-colors" aria-label="Telepon" />
            </div>
          </div>
        </div>

        <div className="border-t border-surface-dim/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-outline">© 2026 Konseling.org. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            {bottomLinks.map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-outline hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
