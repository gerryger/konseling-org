import { render, screen } from "@testing-library/react"
import { HeroSection } from "@/components/landing/hero-section"

describe("HeroSection", () => {
  it("renders the main headline with correct text", () => {
    render(<HeroSection />)
    expect(
      screen.getByRole("heading", { level: 1, name: /Pendampingan Setia/i })
    ).toBeInTheDocument()
  })

  it("renders the subtitle text", () => {
    render(<HeroSection />)
    expect(screen.getByText(/kejelasan mental/i)).toBeInTheDocument()
  })

  it("renders primary CTA linking to /check-in", () => {
    render(<HeroSection />)
    const link = screen.getByRole("link", { name: "Mulai Check-in" })
    expect(link).toHaveAttribute("href", "/check-in")
  })

  it("renders secondary CTA linking to #process", () => {
    render(<HeroSection />)
    const link = screen.getByRole("link", { name: /Pelajari Program/i })
    expect(link).toHaveAttribute("href", "#process")
  })
})
