import { render, screen } from "@testing-library/react"
import { ProblemSection } from "@/components/landing/problem-section"

describe("ProblemSection", () => {
  it("renders the section heading", () => {
    render(<ProblemSection />)
    expect(
      screen.getByRole("heading", { name: /Mengapa Pendampingan Itu Penting/i })
    ).toBeInTheDocument()
  })

  it("renders the first stat card with correct stat value", () => {
    render(<ProblemSection />)
    expect(screen.getByText("19.9 Juta")).toBeInTheDocument()
  })

  it("renders the second stat card with correct ratio", () => {
    render(<ProblemSection />)
    expect(screen.getByText("1 : 300.000")).toBeInTheDocument()
  })

  it("renders both card titles", () => {
    render(<ProblemSection />)
    expect(screen.getByText(/Orang Dengan Gangguan Mental/i)).toBeInTheDocument()
    expect(screen.getByText(/Rasio Psikolog vs Penduduk/i)).toBeInTheDocument()
  })
})
