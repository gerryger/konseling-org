import Link from "next/link"

const groups = [
  { title: "Produk", items: [["Coba ngobrol", "/check-in"], ["Direktori psikolog", "/psikolog"], ["Perpustakaan refleksi", "#"], ["Komunitas", "#"]] },
  { title: "Bantuan", items: [["119 SEJIWA", "tel:119"], ["Crisis resources", "/crisis"], ["FAQ", "#"], ["Hubungi kami", "#"]] },
  { title: "Legal", items: [["Kebijakan privasi", "#"], ["Syarat & ketentuan", "#"], ["Disclaimer", "#"]] },
]

export function Footer() {
  return (
    <footer className="bg-(--color-surface-lowest) border-t border-(--color-outline-variant) pt-14 pb-8">
      <div className="max-w-[1200px] mx-auto px-8 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold text-[19px] tracking-tight">
            <span className="w-8 h-8 rounded-[9px] grid place-items-center text-white" style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary-container) 100%)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </span>
            <span>konseling<span className="text-(--color-secondary-container)">.org</span></span>
          </Link>
          <p className="text-[14px] max-w-[320px] mt-3.5 text-(--color-on-surface-variant) leading-[1.6]">
            Pendamping awal sebelum ke psikolog. Aman, empatik, dan mudah diakses untuk seluruh Indonesia.
          </p>
        </div>
        {groups.map(g => (
          <div key={g.title}>
            <h5 className="text-[13px] font-bold uppercase tracking-[0.05em] mb-4">{g.title}</h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {g.items.map(([l, h]) => (
                <li key={h}><Link href={h} className="text-[14px] text-(--color-on-surface-variant) hover:text-(--color-primary)">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-[1200px] mx-auto px-8 mt-12 pt-6 border-t border-(--color-outline-variant) flex justify-between gap-4 flex-wrap text-[12px] text-(--color-on-surface-variant)">
        <span>© 2026 Konseling.org · Pendamping kesehatan jiwa, bukan pengganti tenaga profesional.</span>
        <span>Dibuat dengan empati di Indonesia 🇮🇩</span>
      </div>
    </footer>
  )
}
