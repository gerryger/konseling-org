import { TrendingUp, BarChart2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ProblemCard {
  icon: LucideIcon
  stat: string
  title: string
  description: string
}

const problems: ProblemCard[] = [
  {
    icon: TrendingUp,
    stat: "19.9 Juta",
    title: "Orang Dengan Gangguan Mental",
    description:
      "Berdasarkan data Kemenkes 2023, hampir 20 juta penduduk Indonesia mengalami gangguan mental serius, namun lebih dari 90% tidak mendapatkan penanganan yang tepat.",
  },
  {
    icon: BarChart2,
    stat: "1 : 300.000",
    title: "Rasio Psikolog vs Penduduk",
    description:
      "Indonesia hanya memiliki sekitar 3.500 psikolog klinis untuk populasi 270 juta jiwa — jauh di bawah standar WHO yang merekomendasikan 1 psikolog per 30.000 penduduk.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-section bg-surface">
      <div className="container">
        <h2 className="text-headline-lg text-on-surface mb-12 text-center">
          Mengapa Pendampingan Itu Penting?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map(({ icon: Icon, stat, title, description }) => (
            <div
              key={title}
              className="rounded-xl bg-surface-container p-6 flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-container" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">{stat}</p>
                <p className="text-base font-bold text-on-surface">{title}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
