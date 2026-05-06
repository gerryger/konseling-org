import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="pt-24 pb-20 bg-surface">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-4rem)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-headline-xl text-on-surface">
                Pendampingan Setia<br />dalam Krisis
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-[480px]">
                Temukan kejelasan mental melalui check-in perasaan yang dipandu AI
                dan dukungan profesional psikolog bersertifikat Indonesia.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary-container hover:bg-primary text-white px-8 font-semibold"
              >
                <Link href="/check-in">Mulai Check-in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-primary-container text-primary-container hover:bg-primary-container/5 px-8 font-semibold"
              >
                <Link href="#process">
                  Pelajari Program
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full aspect-square max-w-[480px] rounded-2xl bg-gradient-to-br from-primary-fixed to-secondary-fixed flex items-center justify-center">
              <p className="text-on-surface-variant text-sm font-medium">
                Illustration placeholder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
