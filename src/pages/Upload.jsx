import React, { useState, useEffect } from "react";
// HAPUS import encryptText, sisakan encryptFile saja
import { encryptFile } from "../Crypto"; 

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploaderName, setUploaderName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_session");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUploaderName(userData.name); 
      } catch (err) {
        console.error("Gagal parse user session");
      }
    }
  }, []);

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  // ==========================
  // UPLOAD FUNCTION (NO NAME ENCRYPTION)
  // ==========================
  const uploadOnly = async () => {
    if (!file) return alert("Pilih file dahulu.");
    if (!uploaderName) return alert("User belum teridentifikasi (Silakan Login ulang).");

    setIsLoading(true);

    try {
      // 1. ENKRIPSI ISI FILE SAJA (Client-Side)
      const encryptedFileBlob = await encryptFile(file);

      // 2. BUAT NAMA FILE UNIK (Tanpa Enkripsi)
      // Format: TIMESTAMP_NAMASLI (Contoh: 171928399_Laporan.pdf)
      // Replace spasi dengan underscore biar aman di URL
      const cleanName = file.name.replace(/\s+/g, '_'); 
      // const uniqueFileName = `${Date.now()}_${cleanName}`;

      // 3. SIAPKAN FORM DATA
      const formData = new FormData();
      
      // Param 3: Nama file fisik di folder uploads
      formData.append("file", encryptedFileBlob, cleanName); 
      formData.append("user_id", uploaderName);
      formData.append("file_name", cleanName); 

      // 4. KIRIM KE BACKEND LOKAL
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData, 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal upload ke server.");
      }

      alert("UPLOAD SUKSES! File terenkripsi disimpan.");
      setFile(null); 

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pb-10">
      <div className="mb-8 text-center mt-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Upload Dokumen</h1>
        <p className="text-gray-500 mt-1">Isi file akan dienkripsi, namun nama file tetap terbaca.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-[#339609] transition-all duration-300 group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <div className="mb-4 text-gray-400 group-hover:text-[#339609] transition-colors duration-300">
                 <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <p className="mb-2 text-lg font-semibold text-gray-700 group-hover:text-[#339609] transition-colors">Klik untuk memilih file</p>
              <p className="text-sm text-gray-500">PDF, DOCX, PNG, atau JPG (Maks. 10MB)</p>
            </div>
            <input type="file" onChange={handleFile} className="hidden" />
          </label>
        ) : (
          <div className="w-full h-64 border-2 border-solid border-[#339609] bg-green-50 rounded-2xl flex flex-col items-center justify-center relative p-6">
            <button onClick={removeFile} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm" title="Hapus file">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center text-3xl mb-3">📄</div>
            <h3 className="text-lg font-bold text-gray-800 break-all text-center max-w-full px-4">{file.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-green-600 font-medium text-sm mt-4 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>File siap diupload (sebagai: {uploaderName})</p>
          </div>
        )}

        <div className="mt-8">
          <button onClick={uploadOnly} disabled={!file || isLoading} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${!file ? "bg-gray-300 text-gray-500 cursor-not-allowed" : isLoading ? "bg-[#287a07] text-white cursor-wait" : "bg-[#339609] hover:bg-[#2c8208] text-white hover:shadow-xl hover:-translate-y-1"}`}>
            {isLoading ? "Mengupload File..." : "Upload & Enkripsi Isi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;