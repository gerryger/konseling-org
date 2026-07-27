# Keputusan commission psikolog — Phase 2

Tanggal: 2026-07-27

## Keputusan

Untuk Phase 2, Konseling.org memakai model **referral-link attribution** dulu.
Artinya:
- klik booking / kontak ke psikolog dicatat secara anonim,
- settlement komisi tetap manual di luar aplikasi,
- belum ada payment gateway atau invoice flow di product.

## Kenapa

- Kita belum punya integrasi Midtrans / Xendit / gateway pembayaran lain.
- Kita belum punya back office partner untuk settlement komisi otomatis.
- Tracking klik referral sudah cukup untuk mengukur demand per psikolog dan per surface.
- Model ini menjaga arsitektur tetap sederhana, anonim, dan mudah di-revert.

## Implikasi implementasi

- CTA booking tetap mengarah keluar dari app.
- Event referral disimpan ke tabel `referral_events` secara anonim.
- Penetapan tarif / komisi per partner bisa disepakati manual di tahap operasional berikutnya.
