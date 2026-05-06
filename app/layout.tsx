import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Konseling.org — Pendampingan Setia dalam Krisis",
  description:
    "Temukan kejelasan mental melalui check-in perasaan yang dipandu AI dan dukungan profesional psikolog bersertifikat Indonesia.",
  keywords: ["konseling", "psikolog", "kesehatan mental", "Indonesia", "check-in perasaan"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={manrope.variable}>
      <body className="bg-surface text-on-surface font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
