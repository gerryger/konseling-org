import { render, screen } from "@testing-library/react"
import { FeaturesSection } from "@/components/landing/features-section"

describe("FeaturesSection", () => {
  it("renders the section heading", () => {
    render(<FeaturesSection />)
    expect(
      screen.getByRole("heading", { name: /Fitur yang Mendukung/i })
    ).toBeInTheDocument()
  })

  it("renders all three feature titles", () => {
    render(<FeaturesSection />)
    expect(screen.getByText("Chatbot AI 24/7")).toBeInTheDocument()
    expect(screen.getByText("Pustaka Refleksi")).toBeInTheDocument()
    expect(screen.getByText("Komunitas Dukungan")).toBeInTheDocument()
  })

  it("renders the Mulai Percakapan CTA linking to /check-in", () => {
    render(<FeaturesSection />)
    const link = screen.getByRole("link", { name: "Mulai Percakapan" })
    expect(link).toHaveAttribute("href", "/check-in")
  })

  it("renders only one CTA button (on the chatbot card)", () => {
    render(<FeaturesSection />)
    expect(screen.getAllByRole("link", { name: "Mulai Percakapan" })).toHaveLength(1)
  })
})
