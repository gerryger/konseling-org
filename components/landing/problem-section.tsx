import { Users, Clock, AlertTriangle, ShieldCheck, TrendingUp, Sun, BarChart2 } from "lucide-react"

export function ProblemSection() {
  return (
    <section className="py-24" id="masalah">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="max-w-[720px] mb-12">
          <span className="k-eyebrow"><span className="dot" />Masalah Nyata di Indonesia</span>
          <h2 className="k-h2 mt-4">
            Kesehatan mental semakin meningkat,<br />tapi <span className="k-grad-text">bantuan sering datang terlambat.</span>
          </h2>
          <p className="text-[18px] mt-4 text-(--color-on-surface-variant) leading-[1.65]">
            Mayoritas tidak tahu harus mulai dari mana — atau takut mencari bantuan. Kami ingin menutup celah itu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users className="w-[22px] h-[22px]" />} num="54" unit="juta" title="Penduduk Indonesia" desc="mengalami gangguan mental emosional. Setara 20% populasi nasional." source="Riskesdas, Kemenkes" />
          <StatCard icon={<Clock className="w-[22px] h-[22px]" />} num="1 dari 3" title="Remaja Indonesia" desc="≈ 15,5 juta remaja mengalami masalah kesehatan mental (2025)." source="I-NAMHS, 2025" />
          <StatCard icon={<AlertTriangle className="w-[22px] h-[22px]" />} num="2.000" unit="+" title="Kasus Bunuh Diri" desc="setiap tahun. Estimasi sebenarnya bisa mencapai 10.000 karena under-reporting." source="Polri & WHO" />
          <StatCard icon={<ShieldCheck className="w-[22px] h-[22px]" />} num="8" unit="%" title="yang Mendapat Bantuan" desc="Mayoritas tidak tahu harus mulai dari mana, atau takut mencari bantuan profesional." source="Riskesdas" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <ProblemCard pillClass="k-pill-red" pillIcon={<TrendingUp className="w-3 h-3" />} pillLabel="Perundungan"
            title="Bullying yang tidak terlihat"
            stats={[{ big: "3.800", lbl: "Kasus (KPAI 2023)" }, { big: "573", lbl: "Kasus (KPAI 2024)" }]}
            desc="1 dari 4 korban mengalami depresi. 9% pernah mencoba bunuh diri." />
          <ProblemCard pillClass="k-pill-amber" pillIcon={<Sun className="w-3 h-3" />} pillLabel="Stres & cemas"
            title="Tekanan akademik & sosial"
            stats={[{ big: "10%", lbl: "Anak menunjukkan gejala cemas/depresi" }]}
            desc="Tekanan akademik, keluarga, sosial, dan ekonomi jadi pemicu utama." />
          <ProblemCard pillClass="k-pill-blue" pillIcon={<BarChart2 className="w-3 h-3" />} pillLabel="Dampak ekonomi"
            title="Beban produktivitas nasional"
            stats={[{ big: "Triliunan", lbl: "Rupiah hilang per tahun" }]}
            desc="Gangguan kesehatan mental menurunkan produktivitas dan kualitas hidup secara nasional." />
        </div>

        <div className="k-quote mt-6">
          <span className="marks">&ldquo;</span>
          <p className="text-white/85 text-[18px] leading-[1.5] m-0">
            <strong className="text-white font-bold">Banyak yang tidak mencari bantuan</strong> — sampai terlambat. Kami ingin menjadi langkah pertama yang lebih mudah dijangkau, sebelum semuanya terasa terlalu berat.
          </p>
        </div>
      </div>
    </section>
  )
}

function StatCard({ icon, num, unit, title, desc, source }: { icon: React.ReactNode; num: string; unit?: string; title: string; desc: string; source: string }) {
  return (
    <div className="k-stat">
      <span className="icon">{icon}</span>
      <div className="num">{num}{unit && <span className="unit">{unit}</span>}</div>
      <h4 className="text-[14px] font-bold">{title}</h4>
      <p className="text-[13px] leading-[1.5] text-(--color-on-surface-variant) m-0">{desc}</p>
      <span className="text-[11px] text-(--color-outline) font-medium mt-auto">{source}</span>
    </div>
  )
}

function ProblemCard({ pillClass, pillIcon, pillLabel, title, stats, desc }: { pillClass: string; pillIcon: React.ReactNode; pillLabel: string; title: string; stats: { big: string; lbl: string }[]; desc: string }) {
  return (
    <div className="k-problem">
      <div className="flex items-center gap-3 mb-3.5">
        <span className={`k-pill ${pillClass}`}>{pillIcon}{pillLabel}</span>
      </div>
      <h4 className="text-[17px] font-bold">{title}</h4>
      <div className="flex gap-[18px] my-3 flex-wrap">
        {stats.map(s => (
          <div key={s.lbl}>
            <span className="text-[24px] font-extrabold tracking-[-0.02em]">{s.big}</span>
            <span className="block text-[11px] text-(--color-on-surface-variant) font-medium mt-0.5">{s.lbl}</span>
          </div>
        ))}
      </div>
      <p className="text-[13px] text-(--color-on-surface-variant) m-0">{desc}</p>
    </div>
  )
}
