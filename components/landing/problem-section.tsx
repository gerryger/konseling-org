import { TrendingUp, BarChart2 } from "lucide-react"

export function ProblemSection() {
  return (
    <section className="py-20 px-12 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] leading-[1.3] font-bold mb-4">
            Mengapa Pendampingan Itu Penting?
          </h2>
          <p className="text-on-surface-variant max-w-[720px] mx-auto text-base leading-relaxed">
            Kondisi kesehatan mental di Indonesia memerlukan perhatian serius dan tindakan yang terukur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Scale */}
          <div className="bg-surface-lowest p-8 rounded-3xl shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-surface-container-high flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-error">
                <TrendingUp className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold">Skala Masalah</h3>
            </div>
            <div className="rounded-xl w-full aspect-video bg-gradient-to-br from-primary-fixed/40 to-error-container/40 flex items-center justify-center">
              <p className="text-on-surface-variant text-sm font-medium text-center px-4">
                Data visualization — 54 juta penduduk Indonesia
              </p>
            </div>
            <p className="text-on-surface-variant text-base leading-relaxed">
              Lebih dari 54 juta masyarakat Indonesia saat ini sedang berjuang dengan masalah emosional
              yang memerlukan penanganan khusus.
            </p>
          </div>

          {/* Card 2: Gap */}
          <div className="bg-surface-lowest p-8 rounded-3xl shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-surface-container-high flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                <BarChart2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold">Kesenjangan Layanan</h3>
            </div>
            <div className="rounded-xl w-full aspect-video bg-gradient-to-br from-secondary-fixed/40 to-primary-fixed/40 flex items-center justify-center">
              <p className="text-on-surface-variant text-sm font-medium text-center px-4">
                Infographic — Gap antara kebutuhan dan aksesibilitas
              </p>
            </div>
            <p className="text-on-surface-variant text-base leading-relaxed">
              Terdapat kesenjangan yang lebar antara kebutuhan layanan kesehatan mental dengan
              kenyataan aksesibilitas profesional saat ini.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
