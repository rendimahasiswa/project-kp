const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer'); // <--- Untuk Upload File
const fs = require('fs');         // <--- Untuk Hapus File Fisik
const db = require('./database.js'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Akses folder uploads lewat URL (misal: http://localhost:5000/uploads/namafile.enc)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/decrypted', express.static(path.join(__dirname, 'uploads/decrypted')));

// ==========================================
// KONFIGURASI MULTER (PENYIMPANAN FILE)
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Simpan di folder 'uploads'
    },
    filename: (req, file, cb) => {
        // Gunakan nama asli yang dikirim dari React (karena React sudah mengenkripsi namanya)
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

// MULTER KHUSUS DECRYPTED
const storageDecrypted = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/decrypted/'); // Simpan di folder decrypted
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Nama file sudah bersih dari frontend
    }
});
const uploadDecrypted = multer({ storage: storageDecrypted });

// ==========================================
// API AUTH (YANG SUDAH KITA BUAT SEBELUMNYA)
// ==========================================
app.post('/api/register', (req, res) => {
    const { name, email, password, nik, telephone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Data tidak lengkap" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userRole = role || 'user';

    const sql = `INSERT INTO users (name, email, password, nik, telephone, role) VALUES (?,?,?,?,?,?)`;
    db.run(sql, [name, email, hashedPassword, nik, telephone, userRole], function (err) {
        if (err) return res.status(400).json({ error: "Email sudah terdaftar/Error lain" });
        res.json({ message: "Registrasi berhasil", data: { id: this.lastID } });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Email/Password salah" });
        
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Email/Password salah" });

        res.json({
            message: "Login sukses",
            user: { id: user.id, name: user.name, email: user.email, role: user.role, nik: user.nik, telephone: user.telephone }
        });
    });
});

// ==========================================
// API USER & PROFILE
// ==========================================
// Ambil data user berdasarkan ID
app.get('/api/users/:id', (req, res) => {
    db.get("SELECT id, name, email, telephone, nik, role FROM users WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: row });
    });
});

// Update Profile
app.put('/api/users/:id', (req, res) => {
    const { name, telephone, nik } = req.body;
    const sql = "UPDATE users SET name = ?, telephone = ?, nik = ? WHERE id = ?";
    db.run(sql, [name, telephone, nik, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Profile updated" });
    });
});

// ==========================================
// API DOCUMENTS (UPLOAD, LIST, DELETE)
// ==========================================

// 1. UPLOAD FILE (Penting!)
// 'file' adalah nama field dari FormData di React nanti
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Tidak ada file yang diupload" });

    // Ambil data tambahan dari body (dikirim user lewat FormData)
    const { user_id, file_name } = req.body; 
    
    // URL File Lokal
    // req.protocol = http, req.get('host') = localhost:5000
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const sql = `INSERT INTO documents (user_id, file_name, file_url) VALUES (?,?,?)`;
    db.run(sql, [user_id, file_name, fileUrl], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Upload berhasil", url: fileUrl });
    });
});

// 2. LIST DOCUMENTS
app.get('/api/documents', (req, res) => {
    // Urutkan dari yang terbaru (uploaded_at DESC)
    db.all("SELECT * FROM documents ORDER BY uploaded_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// 3. DELETE DOCUMENT
app.delete('/api/documents/:id', (req, res) => {
    const docId = req.params.id;

    // Langkah 1: Cari dulu nama filenya di DB biar bisa hapus fisik filenya
    db.get("SELECT file_name FROM documents WHERE id = ?", [docId], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Dokumen tidak ditemukan" });

        const fileName = row.file_name;
        const filePath = path.join(__dirname, 'uploads', fileName);

        // Langkah 2: Hapus File Fisik
        fs.unlink(filePath, (fsErr) => {
            if (fsErr && fsErr.code !== 'ENOENT') { 
                // ENOENT = Error No Entry (File gak ada). Kalau errornya file gak ada, cuekin aja.
                console.error("Gagal hapus file fisik:", fsErr);
            }

            // Langkah 3: Hapus Data di DB
            db.run("DELETE FROM documents WHERE id = ?", [docId], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Dokumen berhasil dihapus" });
            });
        });
    });
});

// ==========================================
// API DECRYPTED FILES (BARU)
// ==========================================

// A. SIMPAN FILE YANG SUDAH DIDEKRIPSI
app.post('/api/save-decrypted', uploadDecrypted.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Gagal menyimpan file" });

    // URL file bersih
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/decrypted/${req.file.filename}`;
    const fileName = req.file.filename;

    const sql = `INSERT INTO decrypted_documents (original_name, file_url) VALUES (?,?)`;
    db.run(sql, [fileName, fileUrl], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "File berhasil disimpan di folder Decrypted", url: fileUrl });
    });
});

// B. LIST FILE YANG SUDAH DIDEKRIPSI
app.get('/api/decrypted-documents', (req, res) => {
    db.all("SELECT * FROM decrypted_documents ORDER BY saved_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// C. HAPUS FILE DECRYPTED
app.delete('/api/decrypted-documents/:id', (req, res) => {
    const docId = req.params.id;
    db.get("SELECT original_name FROM decrypted_documents WHERE id = ?", [docId], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "File tidak ditemukan" });

        const filePath = path.join(__dirname, 'uploads/decrypted', row.original_name);
        
        // Hapus fisik
        fs.unlink(filePath, (fsErr) => {
            if (fsErr && fsErr.code !== 'ENOENT') console.error("Gagal hapus fisik:", fsErr);
            
            // Hapus DB
            db.run("DELETE FROM decrypted_documents WHERE id = ?", [docId], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "File berhasil dihapus" });
            });
        });
    });
});

// --- JALANKAN SERVER ---
app.listen(PORT, () => {
    console.log(`Server Backend Lokal berjalan di http://localhost:${PORT}`);
});