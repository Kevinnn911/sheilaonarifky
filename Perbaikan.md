# Log Perbaikan Bug

## Perbaikan Tautan Gambar Poster Hero

* **[PRIORITY]**: Medium
* **Location**: `index.html` (Hero Section - Komponen Vintage Poster Card)
* **Severity**: Medium
* **Status**: Resolved
* **Root Cause**: Atribut `src` pada elemen gambar utama mereferensikan `shiela.jpg`, sedangkan berkas media lokal yang tersedia di direktori root adalah `shiela.webp`, menyebabkan gambar gagal dimuat (*broken image*).
* **Solution**: Mengubah referensi path gambar pada tag `<img>` dari `shiela.jpg` menjadi `shiela.webp`.
* **Target Deadline**: Immediate (Selesai).

## Perbaikan ReferenceError toggleMobileMenu dan Malformed Onclick Attributes

* **[PRIORITY]**: High
* **Location**: `js/app.js` (baris 40-56) dan `index.html` (baris 597, 608, 619, 762-764)
* **Severity**: High (Blocking UI Initialization)
* **Status**: Resolved
* **Root Cause**: 
  1. Pada `js/app.js`, terdapat registrasi event listener `mobileMenuBtn.addEventListener('click', toggleMobileMenu)` pada lingkup global sebelum fungsi `toggleMobileMenu` yang berada di `js/ux.js` didefinisikan. Hal ini memicu `Uncaught ReferenceError: toggleMobileMenu is not defined`, menghentikan seluruh eksekusi `app.js` dan menyebabkan kegagalan inisialisasi antarmuka pada event `DOMContentLoaded`.
  2. Urutan pemuatan skrip pada `index.html` menempatkan `app.js` sebelum `ux.js`.
  3. Terdapat karakter escape backslash (`\"`) yang tidak valid pada atribut HTML `onclick` di tombol arsip konser pada `index.html`.
* **Solution**:
  1. Memindahkan registrasi event listener `mobileMenuBtn` dan `themeToggleBtn` ke dalam callback `DOMContentLoaded` pada `js/app.js`, serta membungkus pemanggilan `toggleMobileMenu` dalam anonymous function dengan pengecekan defensif `typeof toggleMobileMenu === 'function'`.
  2. Menyesuaikan urutan pemuatan skrip di `index.html` menjadi `data.js` -> `ux.js` -> `app.js`.
  3. Menghapus karakter backslash (`\"`) menjadi format atribut HTML standar `onclick="saveConcertReminder(...)"` pada tombol arsip konser.
* **Target Deadline**: Immediate (Selesai).

## Perbaikan Integrasi File Audio MP3 Nyata pada Pemutar Musik

* **[PRIORITY]**: High
* **Location**: `js/ux.js`, `js/data.js`, `js/app.js`, dan direktori `audio/`
* **Severity**: High (Audio Output Inoperative)
* **Status**: Resolved
* **Root Cause**: 
  1. Berkas audio MP3 yang ditambahkan ke repositori berada di luar direktori proyek (`Arifki/audio`) dan belum didaftarkan properti sumbernya (`src`) pada `tracksData`.
  2. Logika pemutar sebelumnya hanya mengandalkan simulasi osilator frekuensi Web Audio API (`playNote`), sehingga berkas audio MP3 asli tidak pernah dimuat dan tidak mengeluarkan suara lagu sesungguhnya.
* **Solution**:
  1. Menyalin dan menata berkas MP3 ke direktori `Arifki/audio/` dengan penamaan standar (`dan.mp3`, `sephia.mp3`, `melompat-lebih-tinggi.mp3`, `anugerah-terindah.mp3`, `lapang-dada.mp3`).
  2. Mendaftarkan properti `src` untuk masing-masing item pada `tracksData` di `js/data.js`.
  3. Mengimplementasikan HTML5 `Audio()` engine lengkap dengan event listener `timeupdate`, `ended`, `play`, `pause`, dan `error`, serta sinkronisasi durasi dan seek bar secara akurat.
* **Target Deadline**: Immediate (Selesai).

## Perbaikan Layout Shift dan Efek Bergoyang pada Pemutar Audio

* **[PRIORITY]**: Medium
* **Location**: `css/style.css` (baris 8-32, 90-95) dan `index.html` (baris 464-475)
* **Severity**: Medium (Visual Jitter / Layout Thrashing)
* **Status**: Resolved
* **Root Cause**: 
  1. Animasi bilah visualizer equalizer (`@keyframes eqBar`) menginterpolasi properti `height` (dari 4px ke 20px) di dalam kontainer fleksibel tanpa tinggi tetap (`h-auto`). Perubahan dimensi elemen secara kontinu memicu *layout reflow* pada setiap frame di browser.
  2. Perubahan tinggi baris visualizer menyebabkan elemen di bawahnya (*seek bar*, tombol putar, dan playlist) terdorong naik-turun secara berulang, sehingga antarmuka tampak bergoyang (*jittering*).
  3. Indikator durasi waktu (`current-time` dan `total-duration`) tidak memiliki lebar tetap dan pengaturan angka tabular (*tabular-nums*).
* **Solution**:
  1. Mengganti animasi `height` pada `@keyframes eqBar` dengan transformasi GPU `transform: scaleY()` berlabuh di bawah (`transform-origin: bottom`).
  2. Menetapkan tinggi tetap (`height: 20px` / `h-6`) pada kontainer `.eq-bars` dan baris informasi waktu agar dimensi vertikal kontainer konstan.
  3. Menambahkan kelas utilitas `w-12 tabular-nums` pada teks penunjuk durasi waktu untuk mencegah pergeseran horizontal.
  4. Menambahkan deklarasi `transform-origin: center; will-change: transform;` pada piringan hitam (`.vinyl-spin`) untuk rotasi yang stabil tanpa subpixel jitter.
* **Target Deadline**: Immediate (Selesai).
