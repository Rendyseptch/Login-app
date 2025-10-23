#  Simple Login Application — Node.js & React.js (Full Stack Authentication)

##  Deskripsi Tugas

Project ini bertujuan untuk membuat aplikasi web sederhana dengan fitur **login dan autentikasi menggunakan Node.js dan React.js**. 
> Membuat halaman login dengan sistem autentikasi sederhana, validasi form, dan proteksi halaman menggunakan JWT.

---

##  Fitur Utama

 **Form Login:**
- Input **Email/Username** dan **Password**

 **Validasi Form:**
- Field wajib diisi
- Email harus valid (regex)
- Password minimal 6 karakter

 **Autentikasi Login:**
- Hash password menggunakan **bcrypt**
- Penggunaan **JWT + HttpOnly Cookie**
- Sesi login aman dan terenkripsi

 **Protected Route:**
- `/dashboard` hanya bisa diakses jika JWT valid
- Jika tidak login → redirect otomatis ke `/login`

 **UI & UX:**
- Tombol **Show/Hide Password**
- Animasi loading saat login
- Dark Mode Toggle
- Responsif (mobile & desktop)
- Desain menggunakan **TailwindCSS**

 **Logout:**
- Endpoint untuk menghapus sesi JWT

 **Tambahan:**
- Rate limit login (maks. 5 percobaan/menit/IP)


---

##  Arsitektur Aplikasi

Aplikasi ini terdiri dari dua bagian utama:

### 🔹 **Frontend (React.js + Vite)**
- Menyediakan halaman login & dashboard
- Validasi form dan interaksi UI
- Mengirim request ke backend API
- Menyimpan status login via context (`useAuth`)
- Teknologi: React Router, Axios, TailwindCSS

### 🔹 **Backend (Node.js + Express)**
- Menangani autentikasi login
- Hash password dengan bcrypt
- Generate JWT dan simpan ke cookie HttpOnly
- Verifikasi token di middleware `verifyJWT`
- Teknologi: Express.js, MySQL, JWT, bcrypt

---

## Tech Stack

| Layer | Teknologi | Deskripsi |
|-------|------------|-----------|
| **Frontend** | React.js (Vite) | UI interaktif dan responsif |
| **Backend** | Node.js + Express.js | REST API Authentication |
| **Database** | MySQL | Menyimpan data user |
| **Auth** | JWT + bcrypt | Token login |
| **Styling** | TailwindCSS | Desain modern & clean |

---

## Cara Menjalankan Project di Lokal

### 1️ Clone Repository
1. Clone project ke lokal:
 -bash
git clone https://github.com/Rendyseptch/Login-app.git
cd fullstack-login-app

2. Masuk ke folder Backend 
cd backend
npm install

3. Buat file .env sesuai dengan .env.example
4. Jalankan server backend:
   npm run dev

5. Buat Db di mysql dengan nama sesuai di env misal login-app
6. Setup Frontend (React)
   cd ../frontend
   npm install
7.  Buat file .env
   VITE_API_URL=http://localhost:3000

8. Jalankan frontend:
   npm start


Screenshot Aplikasi
Halaman Login
<p align="center">
<img src="/frontend/public/Login1.png" width="300" alt="Login"/>
<img src="/frontend/public/Login-light.png" width="300" alt="Login"/>
<img src="/frontend/public/Login-Mobile1.png" width="300" alt="Login"/>
</p>

Halaman Register
<p align="center">
<img src="/frontend/public/Register-light.png" width="400" alt="Register"/>
<img src="/frontend/public/register1.png" width="400" alt="Register"/>
<img src="/frontend/public/Register-Mobile.png" width="400" alt="Register"/>
</p>

Dashboard 
Dashboard
<p align="center">
<img src="/frontend/public/Dashboard.png" width="400" alt="Dashboard "/>
<img src="/frontend/public/Dashboard-mobile.png" width="400" alt="Dashboard "/>
<img src="/frontend/public/Dashboard-black.png" width="400" alt="Dashboard "/>
</p>

Fungsionalitas Arsip
<p align="center">
<img src="dokumentasi/add surat.png" width="300" alt="Create Surat"/>
<img src="dokumentasi/view_surat.png" width="300" alt="Lihat Surat"/>
</p>

Manajemen Kategori
<p align="center">
<img src="dokumentasi/Table kategori.png" width="400" alt="Index Kategori"/>
<img src="dokumentasi/create_Category.png" width="400" alt="Create Kategori"/>
<img src="dokumentasi/edit_kategori.png" width="400" alt="Lihat Kategori"/>
</p>




