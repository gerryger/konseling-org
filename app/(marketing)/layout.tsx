import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CrisisFab } from "@/components/layout/crisis-fab"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CrisisFab />
    </>
  )
}
