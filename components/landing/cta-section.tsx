import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary-container to-secondary-container">
      <div className="container text-center space-y-8">
        <h2 className="text-headline-lg text-white">
          Bergabunglah dengan Ribuan Orang yang<br />
          Telah Memulai Perjalanan Mereka
        </h2>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-white text-primary-container hover:bg-white/90 px-8 font-bold"
        >
          <Link href="/check-in">Mulai Check-in Sekarang</Link>
        </Button>
      </div>
    </section>
  )
}
