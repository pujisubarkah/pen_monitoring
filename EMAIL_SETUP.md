# Setup Email untuk Notifikasi

Sistem ini menggunakan Gmail untuk mengirim notifikasi kepada user baru saat registrasi.

## ✅ Status: SUDAH BERFUNGSI

Email notifikasi sudah berhasil dikonfigurasi dan berfungsi dengan baik!

## Konfigurasi Email

### File `.env` (Sudah Dikonfigurasi)

```env
GMAIL_USER=direkjarasn@gmail.com
GMAIL_PASS=qjvcguphawhgkqrc
SMTP_FROM="PEN Notifikasi LAN <no-reply@lan.go.id>"

DATABASE_URL=postgresql://makarti:SuperRahasia123%21@172.236.154.243:5432/makarti
```

### Cara Mendapatkan App Password Gmail

1. **Buka** [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. **Login** dengan akun Gmail Anda (direkjarasn@gmail.com)
3. **Pilih** "Mail" dan "Other (Custom name)"
4. **Copy** password 16 karakter (tanpa spasi)
5. **Paste** ke `GMAIL_PASS` di file `.env`

## Email yang Dikirim

Sistem mengirim email otomatis untuk:
- ✅ **Welcome Email** - Saat user baru registrasi
- 🔐 **Password Reset** - Saat user lupa password
- 📋 **Action Plan Notification** - Saat ada rencana aksi baru

## Testing

Untuk test email, daftar user baru di halaman registrasi. Email welcome akan otomatis dikirim ke inbox user.

## Troubleshooting

### Email tidak terkirim
1. Pastikan App Password Gmail benar (16 karakter tanpa spasi)
2. Restart server setelah mengubah `.env`
3. Cek log terminal untuk error message
4. Pastikan koneksi internet stabil

### Email masuk ke Spam
- Ini normal karena menggunakan `no-reply@lan.go.id` sebagai sender
- Untuk production, gunakan email server sendiri

## Development Mode

Konfigurasi sudah siap untuk development dan production! 🚀

### Email masuk ke Spam
- Ini normal karena menggunakan `no-reply@lan.go.id` sebagai sender padahal mengirim dari Gmail
- Untuk production, gunakan email server sendiri atau setup SPF/DKIM records

## Development Mode

Konfigurasi sudah siap:
- ✅ Email akan dikirim saat user registrasi
- ✅ Error akan di-log tapi tidak mengganggu proses registrasi
- ✅ User tetap bisa login meskipun email gagal terkirim

**Restart server** agar perubahan diterapkan!
