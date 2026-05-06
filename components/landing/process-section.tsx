interface Step {
  number: string
  name: string
  description: string
  colorClass: string
}

const steps: Step[] = [
  {
    number: "01",
    name: "Check-in",
    description: "Identifikasi perasaan Anda saat ini.",
    colorClass: "border-primary text-primary",
  },
  {
    number: "02",
    name: "Refleksi",
    description: "Pahami pemicu emosional Anda.",
    colorClass: "border-secondary text-secondary",
  },
  {
    number: "03",
    name: "Edukasi",
    description: "Pelajari strategi koping yang tepat.",
    colorClass: "border-tertiary text-tertiary",
  },
  {
    number: "04",
    name: "Intervensi",
    description: "Langkah nyata untuk perubahan.",
    colorClass: "border-primary-container text-primary-container",
  },
  {
    number: "05",
    name: "Konseling",
    description: "Pendampingan ahli berkelanjutan.",
    colorClass: "border-secondary-container text-secondary-container",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-20 px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <h2 className="text-[32px] leading-[1.3] font-bold mb-4">
            5 Langkah Menuju Pemulihan
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Sebuah perjalanan yang dipandu, selangkah demi selangkah, untuk kesejahteraan emosional Anda.
          </p>
        </div>

        {/* Journey illustration placeholder */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-primary-fixed via-secondary-fixed to-tertiary-fixed aspect-[16/5] flex items-center justify-center">
          <p className="text-on-surface-variant text-sm font-medium">
            Illustration — 5-Step Journey Map
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map(({ number, name, description, colorClass }) => (
            <div
              key={number}
              className={`p-6 bg-surface-container rounded-2xl border-l-4 ${colorClass.split(" ")[0]}`}
            >
              <span className={`font-bold text-sm block mb-2 ${colorClass.split(" ")[1]}`}>
                {number}
              </span>
              <h4 className="font-bold mb-1">{name}</h4>
              <p className="text-xs text-on-surface-variant">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
