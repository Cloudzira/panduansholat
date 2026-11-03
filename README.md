# Panduan Sholat

Web app statis berbahasa Indonesia untuk belajar tata cara sholat dengan rujukan Al-Qur'an dan hadis. Dibangun dengan HTML, CSS, dan JavaScript murni sehingga dapat di-host di GitHub Pages.

## Isi proyek
- `index.html` — struktur halaman
- `styles.css` — desain glassmorphism responsif
- `data.js` — data tahapan dan bacaan
- `app.js` — jadwal sholat, pengingat, wudhu/tayammum, tahapan, tips, pelacak harian, tema, audio TTS
- `data-extra.js` — materi wudhu, tayammum, pembatal, tips harian

## Menjalankan di komputer
Buka `index.html` di browser modern. Untuk pengalaman terbaik gunakan server lokal atau GitHub Pages.

## Publikasi ke GitHub Pages
1. Buat repository baru di GitHub, misalnya `panduan-sholat-nabi`.
2. Pada halaman repository pilih **Add file → Upload files**.
3. Unggah keempat file proyek (`index.html`, `styles.css`, `data.js`, `app.js`) dan `README.md`.
4. Klik **Commit changes**.
5. Buka **Settings → Pages**.
6. Pada **Build and deployment**, pilih **Deploy from a branch**.
7. Pilih branch `main`, folder `/ (root)`, lalu klik **Save**.
8. Tunggu proses selesai. Alamat situs muncul pada bagian GitHub Pages, biasanya `https://USERNAME.github.io/panduan-sholat-nabi/`.

Jika memakai repository bernama `USERNAME.github.io`, alamatnya biasanya `https://USERNAME.github.io/`.

## Catatan audio
Audio memakai Web Speech API (`speechSynthesis`) dengan locale Arab. Ini adalah suara sintetis perangkat, bukan rekaman qari dan tidak menjamin makhraj/tajwid yang benar. Suara Arab mungkin tidak tersedia pada sebagian perangkat. Gunakan guru/rekaman qari tepercaya untuk belajar pelafalan.

## Catatan ilmiah penting
Konten di `data.js` adalah materi awal dan kerangka pembelajaran. Sebelum dipublikasikan sebagai panduan agama final, lakukan verifikasi takhrij untuk setiap redaksi bacaan, cek nomor hadis sesuai edisi, dan telaah bersama ustaz/ahli hadis/fikih. Perbedaan riwayat yang mu'tabar perlu diterangkan secara adil; jangan menyebut variasi yang berdalil sebagai kesalahan.

## Pengembangan tahap berikutnya
- Lengkapi bacaan doa iftitah, Al-Fatihah, surah, tasyahud lengkap, shalawat Ibrahimiyah, doa sebelum salam, dzikir setelah sholat.
- Tambahkan materi sholat wajib 2/3/4 rakaat dengan peta rakaat.
- Tambahkan pembahasan sholat sunnah, berjamaah, musafir, sakit, sujud sahwi, dan sholat jenazah.
- Tambahkan daftar variasi riwayat dengan takhrij dan catatan kualitas.
