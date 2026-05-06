import Link from "next/link"
import { Bot, BookOpen, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  cta: { label: string; href: string } | null
}

const features: Feature[] = [
  {
    icon: Bot,
    title: "Chatbot AI 24/7",
    description:
      "Tersedia kapan saja, chatbot kami memberikan respons empatik berbasis evidence-based therapy untuk menemani Anda di momen sulit.",
    cta: { label: "Mulai Percakapan", href: "/check-in" },
  },
  {
    icon: BookOpen,
    title: "Pustaka Refleksi",
    description:
      "Ratusan artikel, panduan, dan latihan mindfulness yang dikurasi oleh psikolog berpengalaman Indonesia.",
    cta: null,
  },
  {
    icon: Users,
    title: "Komunitas Dukungan",
    description:
      "Bergabunglah dengan komunitas anonim yang saling mendukung, dipantau oleh moderator profesional.",
    cta: null,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-section bg-surface">
      <div className="container">
        <h2 className="text-headline-lg text-on-surface mb-12 text-center">
          Fitur yang Mendukung Perjalanan Anda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, cta }) => (
            <div
              key={title}
              className="bg-surface-lowest rounded-xl p-6 flex flex-col gap-4 shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-container" aria-hidden="true" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="font-bold text-on-surface text-base">{title}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </div>
              {cta && (
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary-container hover:bg-primary text-white font-semibold w-fit mt-2"
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
