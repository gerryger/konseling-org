import { Smile, Brain, MessageSquare, ShieldAlert, UserPlus, ShieldCheck } from "lucide-react"

const steps = [
  { n: 1, icon: <Smile className="w-[26px] h-[26px]" strokeWidth={1.8} />, title: "Check-in perasaan", desc: "Ungkapkan kondisi emosi dengan emoji atau kata sederhana — tidak ada jawaban yang salah." },
  { n: 2, icon: <Brain className="w-[26px] h-[26px]" strokeWidth={1.8} />, title: "Refleksi empatik", desc: "AI merespons dengan empati, memahami konteks tanpa menggurui atau menghakimi." },
  { n: 3, icon: <MessageSquare className="w-[26px] h-[26px]" strokeWidth={1.8} />, title: "Lanjut cerita", desc: "Lanjutkan percakapan sesuai kenyamanan. Berhenti kapan pun — semua kendali ada di kamu." },
  { n: 4, icon: <ShieldAlert className="w-[26px] h-[26px]" strokeWidth={1.8} />, title: "Deteksi risiko", desc: "Sistem mendeteksi tanda-tanda krisis secara aman dan menampilkan dukungan tambahan." },
  { n: 5, icon: <UserPlus className="w-[26px] h-[26px]" strokeWidth={1.8} />, title: "Rujuk ke profesional", desc: "Hubungkan ke psikolog, hotline, atau orang terdekat — sumber bantuan yang terpercaya." },
]

export function ProcessSection() {
  return (
    <section className="py-24 bg-(--color-surface-low)" id="solusi">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="max-w-[720px] mb-12">
          <span className="k-eyebrow"><span className="dot" />Cara Kerja</span>
          <h2 className="k-h2 mt-4">
            Dari <em className="not-italic text-(--color-on-surface-variant)">&ldquo;bingung dan sendirian&rdquo;</em><br />
            menjadi <span className="k-grad-text">dipahami dan punya arah.</span>
          </h2>
          <p className="text-[18px] mt-4 text-(--color-on-surface-variant) leading-[1.65]">
            Lima langkah lembut yang dirancang sebagai pendamping awal — bukan pengganti psikolog, tapi tempat refleksi pertama yang aman.
          </p>
        </div>

        <div className="relative pt-2">
          <div className="k-steps-line" aria-hidden />
          <div className="k-steps">
            {steps.map(s => (
              <div key={s.n} className="flex flex-col items-center text-center gap-3">
                <div className="k-step-num">{s.n}</div>
                <div className="k-step-icon">{s.icon}</div>
                <h4 className="text-[16px] font-bold">{s.title}</h4>
                <p className="text-[13px] text-(--color-on-surface-variant) max-w-[200px] leading-[1.55] m-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 bg-(--color-surface-lowest) border border-(--color-outline-variant) rounded-3xl p-7 flex gap-[18px] items-center k-shadow-card">
          <span className="w-12 h-12 rounded-2xl bg-(--color-secondary-fixed) text-(--color-secondary) grid place-items-center flex-shrink-0">
            <ShieldCheck className="w-[22px] h-[22px]" />
          </span>
          <div>
            <h4 className="text-[17px] font-bold">AI bukan pengganti psikolog — tetapi membantu refleksi awal.</h4>
            <p className="text-[14px] mt-1 text-(--color-on-surface-variant) leading-[1.55] m-0">
              Konseling.org dirancang sebagai pendamping pertama. Untuk diagnosis dan terapi, kami selalu mengarahkan kamu ke tenaga profesional bersertifikat.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
