# DAPRITA Wedding Invitation — Figma Workspace

Template ini dirancang sebagai titik awal desain undangan digital sebelum diimplementasikan ke HTML, CSS, dan JavaScript.

## Cara impor ke Figma

1. Buka Figma dan buat file baru.
2. Tarik `wedding-invitation-workspace.svg` ke canvas Figma.
3. Klik kanan setiap grup layar, lalu pilih **Frame selection** agar menjadi frame native.
4. Buat halaman Figma sesuai struktur di bawah dan pindahkan bagian yang relevan.
5. Ganti kotak gambar dengan foto menggunakan **Fill → Image**.

## Struktur halaman yang disarankan

- `00 — Cover & Notes`
- `01 — Foundations`
- `02 — Components`
- `03 — Mobile · 390`
- `04 — Desktop · 1440`
- `05 — Prototype`
- `06 — Assets`

## Struktur layer setiap undangan

```text
Invitation / [Nama Tema]
├── 01 Cover
├── 02 Hero & Countdown
├── 03 Couple
├── 04 Events
├── 05 Story
├── 06 Gallery
├── 07 Dress Code
├── 08 RSVP & Wishes
├── 09 Gift
└── 10 Footer
```

Gunakan nama layer tersebut agar proses konversi desain ke kode lebih akurat.

## Ukuran frame

| Perangkat | Lebar | Grid |
|---|---:|---|
| Mobile | 390 px | 4 kolom, margin 20, gutter 12 |
| Tablet | 768 px | 8 kolom, margin 32, gutter 16 |
| Desktop | 1440 px | 12 kolom, margin 80, gutter 24 |

## Spacing dan radius

- Spacing: `4, 8, 12, 16, 24, 32, 48, 64, 96, 120`
- Radius kecil: `8`
- Radius kartu: `16`
- Radius besar: `24`
- Pill/button: `999`

## Typography

- Display: **Cinzel** atau **Italiana**
- Body: **Manrope**
- Gunakan maksimal dua keluarga font dalam satu tema.
- Ukuran minimum body di mobile: `14 px`.

## Komponen yang perlu dibuat

- `Button / Primary / Default`
- `Button / Primary / Hover`
- `Button / Outline / Default`
- `Navigation / Floating`
- `Countdown / Item`
- `Event / Card`
- `Gallery / Thumbnail`
- `Form / Input`
- `Form / Select`
- `Wish / Card`
- `Gift / Bank Card`
- `Music / On` dan `Music / Off`

## Catatan prototipe

- Tombol **Buka Undangan** membuka frame Hero.
- Tombol galeri membuka overlay lightbox.
- Tombol musik memakai variant On/Off.
- Tombol RSVP menampilkan success state.
- Gunakan Smart Animate 500–800 ms untuk transisi lembut.
- Selalu sertakan frame mobile dan desktop untuk setiap tema final.

## Penyerahan desain untuk implementasi

Sertakan tautan Figma dengan akses view, seluruh aset SVG/PNG, nama font, animasi yang diinginkan, dan status final setiap frame. Hindari flatten text sebelum penyerahan.
