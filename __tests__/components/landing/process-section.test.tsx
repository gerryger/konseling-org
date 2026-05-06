import { render, screen } from "@testing-library/react"
import { ProcessSection } from "@/components/landing/process-section"

describe("ProcessSection", () => {
  it("renders the section heading", () => {
    render(<ProcessSection />)
    expect(
      screen.getByRole("heading", { name: /5 Langkah Menuju Pemulihan/i })
    ).toBeInTheDocument()
  })

  it("renders all five step names", () => {
    render(<ProcessSection />)
    expect(screen.getByText("Check-in")).toBeInTheDocument()
    expect(screen.getByText("Refleksi")).toBeInTheDocument()
    expect(screen.getByText("Edukasi")).toBeInTheDocument()
    expect(screen.getByText("Intervensi")).toBeInTheDocument()
    expect(screen.getByText("Konseling")).toBeInTheDocument()
  })

  it("renders step numbers 1 through 5", () => {
    render(<ProcessSection />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })
})
