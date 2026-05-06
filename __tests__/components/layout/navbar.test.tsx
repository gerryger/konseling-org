import { render, screen } from "@testing-library/react"
import { Navbar } from "@/components/layout/navbar"

describe("Navbar", () => {
  it("renders the brand logo", () => {
    render(<Navbar />)
    expect(screen.getByText("Konseling.org")).toBeInTheDocument()
  })

  it("renders the Check-in nav link pointing to /check-in", () => {
    render(<Navbar />)
    const link = screen.getByRole("link", { name: "Check-in" })
    expect(link).toHaveAttribute("href", "/check-in")
  })

  it("renders all four navigation links", () => {
    render(<Navbar />)
    expect(screen.getByRole("link", { name: "Check-in" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Crisis Help" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Psikolog" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Sumber Daya" })).toBeInTheDocument()
  })

  it("renders the Darurat emergency button", () => {
    render(<Navbar />)
    expect(screen.getByRole("button", { name: /Darurat/i })).toBeInTheDocument()
  })

  it("renders the Akun Saya account button", () => {
    render(<Navbar />)
    expect(screen.getByRole("button", { name: /Akun Saya/i })).toBeInTheDocument()
  })
})
