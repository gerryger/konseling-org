import Link from "next/link"
import { Phone } from "lucide-react"

export function CrisisFab() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link
        href="/crisis"
        className="flex items-center gap-3 bg-error px-6 py-4 rounded-full text-white shadow-2xl hover:bg-error/90 transition-all active:scale-95"
      >
        <Phone className="w-5 h-5" aria-hidden="true" />
        <span className="font-bold tracking-wide">Butuh Bantuan Mendesak?</span>
      </Link>
    </div>
  )
}
