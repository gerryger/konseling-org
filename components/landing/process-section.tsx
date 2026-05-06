interface Step {
  number: number
  name: string
  description: string
}

const steps: Step[] = [
  {
    number: 1,
    name: "Check-in",
    description: "Ekspresikan perasaan Anda melalui panduan AI yang empatik",
  },
  {
    number: 2,
    name: "Refleksi",
    description: "Dapatkan wawasan dan pola dari jurnal emosi Anda",
  },
  {
    number: 3,
    name: "Edukasi",
    description: "Akses pustaka artikel kesehatan mental terkurasi",
  },
  {
    number: 4,
    name: "Intervensi",
    description: "Sistem deteksi krisis yang otomatis memberikan bantuan segera",
  },
  {
    number: 5,
    name: "Konseling",
    description: "Terhubung dengan psikolog profesional yang tepat untuk Anda",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-section bg-surface-lowest">
      <div className="container">
        <h2 className="text-headline-lg text-on-surface mb-16 text-center">
          5 Langkah Menuju Pemulihan
        </h2>
        <div className="relative">
          <div
            className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary-container to-secondary-container"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {steps.map(({ number, name, description }) => (
              <div key={number} className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-extrabold text-lg z-10 relative">
                  {number}
                </div>
                <div>
                  <p className="font-bold text-on-surface text-base mb-1">{name}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
