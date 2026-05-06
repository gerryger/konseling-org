import { render, screen } from "@testing-library/react"
import { SafetySection } from "@/components/landing/safety-section"

describe("SafetySection", () => {
  it("renders the pull-quote", () => {
    render(<SafetySection />)
    expect(
      screen.getByText(/Kenyamanan Anda adalah prioritas utama/i)
    ).toBeInTheDocument()
  })

  it("renders all three safety points", () => {
    render(<SafetySection />)
    expect(screen.getByText("Anonimitas Terjaga")).toBeInTheDocument()
    expect(screen.getByText("Filter Krisis AI")).toBeInTheDocument()
    expect(screen.getByText("Enkripsi End-to-End")).toBeInTheDocument()
  })

  it("renders the Baca Selengkapnya link", () => {
    render(<SafetySection />)
    expect(
      screen.getByRole("link", { name: /Baca Selengkapnya/i })
    ).toBeInTheDocument()
  })
})
