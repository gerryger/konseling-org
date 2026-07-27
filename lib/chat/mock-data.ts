import type { HistoryGroup, Psikolog } from './types';

const buildBookingUrl = (name: string, id: string) =>
  `mailto:booking@konseling.org?subject=${encodeURIComponent(`Booking untuk ${name}`)}&body=${encodeURIComponent(`Halo, aku ingin lanjut booking dengan ${name}.\n\nID psikolog: ${id}\n\nAku ketemu profil ini di Konseling.org dan ingin diarahkan ke langkah berikutnya.`)}`;

export const MOCK_HISTORY: HistoryGroup[] = [
  {
    day: 'Hari ini',
    items: [
      { id: 'today-1', emoji: '😔', title: 'Lagi capek banget hari ini', time: 'Sekarang', active: true },
    ],
  },
  {
    day: 'Kemarin',
    items: [
      { id: 'y1', emoji: '😟', title: 'Cemas soal kerjaan', time: 'Kemarin · 21:14' },
      { id: 'y2', emoji: '🙂', title: 'Hari yang biasa aja', time: 'Kemarin · 09:32' },
    ],
  },
  {
    day: 'Sebelumnya',
    items: [
      { id: 'e1', emoji: '😢', title: 'Berantem sama keluarga', time: '5 hari lalu' },
      { id: 'e2', emoji: '😊', title: 'Cerita hal yang bikin senang', time: '1 minggu lalu' },
      { id: 'e3', emoji: '😔', title: 'Kehilangan yang masih terasa', time: '2 minggu lalu' },
    ],
  },
];

export const MOCK_PSIKOLOG: Psikolog[] = [
  {
    id: 'dr-rina-pertiwi',
    initial: 'DR',
    gradient: 'linear-gradient(135deg, #335ef7, #7858f5)',
    name: 'Dr. Rina Pertiwi, M.Psi',
    tags: ['Klinis Dewasa', 'Jakarta Selatan', '0.9 km'],
    price: 'Rp 280rb / sesi',
    bookingUrl: buildBookingUrl('Dr. Rina Pertiwi, M.Psi', 'dr-rina-pertiwi'),
    bio: 'Cocok buat kamu yang lagi butuh ruang aman untuk menata ulang beban pikiran, relasi, atau stres kerja.',
  },
  {
    id: 'adi-kusumawardhana',
    initial: 'AK',
    gradient: 'linear-gradient(135deg, #18b663, #0e9252)',
    name: 'Adi Kusumawardhana, M.Psi',
    tags: ['Trauma & Krisis', 'Jakarta Pusat', '2.4 km'],
    price: 'Rp 250rb / sesi',
    bookingUrl: buildBookingUrl('Adi Kusumawardhana, M.Psi', 'adi-kusumawardhana'),
    bio: 'Bisa jadi pilihan kalau kamu butuh pendamping yang hangat untuk isu trauma, krisis, atau pulih pelan-pelan.',
  },
  {
    id: 'maya-wulandari',
    initial: 'MW',
    gradient: 'linear-gradient(135deg, #f97316, #b34719)',
    name: 'Maya Wulandari, M.Psi',
    tags: ['Remaja & Dewasa Muda', 'Online', 'Telekonsultasi'],
    price: 'Rp 220rb / sesi',
    bookingUrl: buildBookingUrl('Maya Wulandari, M.Psi', 'maya-wulandari'),
    bio: 'Pas kalau kamu pengin ngobrol lebih ringan lewat sesi online dan butuh ritme yang fleksibel.',
  },
];
