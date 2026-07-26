function normalize(text: string): string {
  return text.toLowerCase()
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text))
}

export function buildTurnGuidance(latestUserMessage: string): string {
  const text = normalize(latestUserMessage)

  const anxious = hasAny(text, [/cemas/, /panik/, /khawatir/, /gelisah/, /takut/, /deg-?degan/])
  const sad = hasAny(text, [/sedih/, /nangis/, /capek/, /lelah/, /hancur/, /kosong/, /berat/])
  const angry = hasAny(text, [/marah/, /kesal/, /jengkel/, /muak/, /dongkol/])
  const ashamed = hasAny(text, [/malu/, /gagal/, /bodoh/, /nggak berguna/, /tidak berguna/, /menyusahkan/])

  const lines = [
    'PANDUAN GILIRAN:',
    '- Tetap utamakan validasi emosi, lalu beri ruang, lalu satu pertanyaan lembut, lalu satu langkah kecil bila memang membantu.',
  ]

  if (anxious) {
    lines.push('- Pesan terakhir terdengar cemas/panik. Jangan bilang "tenang"; akui dulu rasa tidak nyamannya.')
  }

  if (sad) {
    lines.push('- Pesan terakhir terdengar sedih/berat. Jaga jawaban tetap singkat, hangat, dan tidak buru-buru memberi solusi.')
  }

  if (angry) {
    lines.push('- Pesan terakhir terdengar marah/kesal. Validasi dulu kemarahannya; jangan minta memaafkan atau menenangkan diri terlalu cepat.')
  }

  if (ashamed) {
    lines.push('- Pesan terakhir terdengar malu/tidak berharga. Jangan langsung memuji; akui keberaniannya bercerita dan beri dukungan yang lembut.')
  }

  if (!anxious && !sad && !angry && !ashamed) {
    lines.push('- Balas dengan hangat dan natural; jangan lompat ke solusi sebelum menunjukkan bahwa kamu sudah mendengar.')
  }

  return lines.join('\n')
}
