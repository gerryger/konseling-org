const partners = [
  { glyph: "119", name: "SEJIWA · Kemenkes RI" },
  { glyph: "KP", name: "KPAI" },
  { glyph: "HI", name: "HIMPSI" },
  { glyph: "PD", name: "PDSKJI" },
  { glyph: "WHO", name: "WHO Mental Health" },
]

export function TrustStrip() {
  return (
    <section className="k-trust">
      <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-between gap-8 flex-wrap">
        <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-(--color-on-surface-variant) max-w-[220px] leading-snug">
          Selaras dengan referensi resmi kesehatan jiwa di Indonesia
        </div>
        <div className="flex gap-9 flex-wrap items-center">
          {partners.map(p => (
            <span key={p.glyph} className="k-trust-logo">
              <span className="glyph">{p.glyph}</span>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
