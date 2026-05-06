import { render, screen } from "@testing-library/react"
import { Footer } from "@/components/layout/footer"

describe("Footer", () => {
  it("renders the brand name", () => {
    render(<Footer />)
    expect(screen.getByText("Konseling.org")).toBeInTheDocument()
  })

  it("renders the copyright notice", () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Konseling.org/)).toBeInTheDocument()
  })

  it("renders the Layanan section heading", () => {
    render(<Footer />)
    expect(screen.getByText("Layanan")).toBeInTheDocument()
  })

  it("renders the Check-in Perasaan service link", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Check-in Perasaan" })).toBeInTheDocument()
  })

  it("renders the Privasi legal link", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Privasi" })).toBeInTheDocument()
  })
})
