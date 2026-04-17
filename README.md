# Full-Stack Recruitment Test Portal

Sebuah purwarupa aplikasi *Full-Stack* (Sistem Dompet Digital/E-Wallet ringan) yang dibangun eksklusif sebagai manifestasi penugasan *Technical Test*. Proyek ini mendemonstrasikan implementasi *Clean Architecture*, rutinitas isolasi basis data di Golang, pemrosesan antrean *Background Worker* secara asinkron, serta penataan *Frontend* interaktif nan rapi.

## ✨ Fitur-Fitur Utama

1. **Sistem Autentikasi**: *Register* dan *Login* pengguna terenskripsi dengan balasan JWT *Token*.
2. **Dasbor Profil & Kredensial**: Halaman manajemen untuk membaca (`GET`) dan menyimpan (`PUT`) informasi fisik alamat pengguna, lengkap dengan presentasi spesifik UUID _(Read-Only Copy)_.
3. **Mekanisme Transaksi**:
   - 💳 **Top Up (Isi Saldo)**: Fitur penambah saldo *Credit*.
   - 🛍️ **Payment (Pembayaran)**: Simulator belanja pos titik debet yang memotong dana dari akun tersebut.
   - 💸 **P2P Transfer (Kirim Saldo)**: Dirancang secara khusus mengirim saldo melintas akun _User ID_. Pengiriman dievaluasi tangguh melalui **_Background Worker / Transfer Queue_** berbasis _Goroutines_ untuk menjamin _Double Data Entries_ mutasi ke tabel penerima, sembari diproteksi transaksi isolasi aman menggunakan `DB.Begin()`, `Rollback()`, dan `Commit()`.
4. **Riwayat Mutasi & Laporan**: Daftar riwayat seluruh keluar-masuknya uang. Telah diimprovisasi (*Preload Eager Logic*) dapat mendeteksi "Kepada Siapa" (`"To: [Name]"`) dan "Dari Siapa" (`"From: [Name]"`) di dalam rincian *transfer* demi transparansi data.

---

## 🚀 Cara Menjalankan Berkas Secara Lokal

### 1. Prasyarat Basis Data (Database)
- Nyalakan sistem pangkalan data MySQL Lokal Anda (*Misal: XAMPP, Laragon, Docker*).
- Karena berkas `.env` dijaga kerahasiaannya di luar GitHub demi standar privasi, Anda wajib **membuat satu file bernama `.env`** secara manual di dalam map/direktori instalasi `/backend` dan mengisikan variabel mutlak berikut:

```env
DB_DSN=root:@tcp(localhost:3306)/test_api?charset=utf8mb4&parseTime=True&loc=Local
JWT_SECRET=rahasia-ku-1234
GIN_MODE=debug
```

*(Catatan: Anda dapat masuk ke phpMyAdmin untuk membuat skema basis data kosong bernama `test_api` terlebih dahulu. Struktur tabel sisanya akan *Auto-Migrate* otomatis).*

### 2. Menjalankan *Server Backend* API
Lakukan rutinitas berikut menggunakan jendela _terminal_/*command prompt*:
```bash
cd backend
go mod tidy
go run cmd/api/main.go
```
*(Server logika belakang layar akan mulai mendengarkan rutinitas di lintasan `http://localhost:8080`)*.

### 3. Menjalankan Skrip *Frontend* React
Pada jendela _terminal_ baru, luncurkan repositori di map UI:
```bash
cd frontend
npm install
npm run dev
```
