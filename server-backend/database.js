const sqlite3 = require('sqlite3').verbose();

// Menentukan nama file database
const DBSOURCE = "ttd_elektronik.sqlite";

// Membuat koneksi ke database
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Jika error saat membuka database
      console.error(err.message);
      throw err;
    } else {
        console.log('Terhubung ke database SQLite.');
        
        // --- 1. BUAT TABEL USERS ---
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            nik TEXT,
            telephone TEXT,
            role TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        (err) => {
            if (err) {
                // Table sudah ada (tidak error, lanjut saja)
            } else {
                // Table baru dibuat, kita bisa insert data dummy admin jika mau
                // (Nanti kita handle registrasi manual saja)
            }
        });  

        // --- 2. BUAT TABEL DOCUMENTS ---
        db.run(`CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT, 
            file_name TEXT,
            file_url TEXT,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        (err) => {
            if (err) {
                // Table sudah ada
            }
        });

        // --- 3. BUAT TABEL DECRYPTED DOCUMENTS ---
        db.run(`CREATE TABLE IF NOT EXISTS decrypted_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_name TEXT,
            file_url TEXT,
            saved_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        (err) => {
            if (err) {
                // Table already created
            }
        });
    }
});

module.exports = db;