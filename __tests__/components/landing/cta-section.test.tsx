import { render, screen } from "@testing-library/react"
import { CTASection } from "@/components/landing/cta-section"

describe("CTASection", () => {
  it("renders the headline text", () => {
    render(<CTASection />)
    expect(screen.getByRole("heading", { name: /Bergabunglah dengan Ribuan Orang/i })).toBeInTheDocument()
  })

  it("renders the CTA button linking to /check-in", () => {
    render(<CTASection />)
    const link = screen.getByRole("link", { name: "Mulai Check-in Sekarang" })
    expect(link).toHaveAttribute("href", "/check-in")
  })
})
