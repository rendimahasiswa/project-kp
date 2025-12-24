import React, { useEffect, useState } from "react";
// import { supabase } from "../supabase-client"; // HAPUS
import { decryptFile } from "../Crypto"; 
import { Lock, Unlock, Trash2, Download, Eye, X, Save, FileText } from "lucide-react"; // FileText ikon untuk docx

const DecryptFile = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  const [decrypting, setDecrypting] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State loading simpan
  const [decryptedBlobUrl, setDecryptedBlobUrl] = useState(null);
  const [decryptedFileType, setDecryptedFileType] = useState(null); // Menyimpan tipe file hasil decrypt

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/documents');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // const decryptedData = result.data.map((doc) => {
      //   let realName = "Unknown File";
        
      //   try {
      //       // --- PERBAIKAN DI SINI ---
      //       // 1. Ambil nama dari DB (yang mungkin mengandung '_')
      //       let safeName = doc.file_name;
            
      //       // 2. Kembalikan '_' menjadi '/' agar format Base64 kembali valid
      //       // Kita asumsikan saat upload kita ubah '/' jadi '_'
      //       // PENTING: Ini hanya memperbaiki ciphertext agar bisa didekripsi
      //       let originalCipher = safeName.replace(/_/g, '/');

      //       // 3. Dekripsi kode yang sudah diperbaiki
      //       realName = decryptText(originalCipher);
            
      //       // Cek: Jika hasil decrypt sama persis dengan input, berarti gagal decrypt
      //       // (karena decryptText mengembalikan input jika error)
      //       if (realName === originalCipher) {
      //            // Fallback tambahan: Mungkin memang namanya tidak mengandung '/' tapi gagal karena hal lain
      //            // Kita coba decrypt raw-nya jg
      //            realName = decryptText(safeName); 
      //       }

      //   } catch (e) {
      //       console.error("Gagal decrypt nama:", e);
      //       realName = doc.file_name; 
      //   }

      //   return {
      //     ...doc,
      //     display_name: realName || "Tanpa Nama", 
      //   };
      // });

      setDocuments(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDecryptModal = (doc) => {
    setSelectedDoc(doc);
    setDecryptedBlobUrl(null);
    setDecryptedFileType(null);
    setIsDecryptModalOpen(true);
  };

  const closeDecryptModal = () => {
    setIsDecryptModalOpen(false);
    setSelectedDoc(null);
    setDecryptedBlobUrl(null);
    if (decryptedBlobUrl) window.URL.revokeObjectURL(decryptedBlobUrl);
  };

  // --- REVISI FUNGSI DECRYPT ---
  const handleDecryptProcess = async () => {
    if (!selectedDoc) return;
    setDecrypting(true);

    try {
      const response = await fetch(selectedDoc.file_url);
      if (!response.ok) throw new Error("Gagal mengambil file.");
      
      const encryptedBlob = await response.blob();
      
      // decryptFile dari Crypto.js yang BARU sudah mengembalikan blob dengan Tipe yang benar
      const originalBlob = await decryptFile(encryptedBlob);

      // Simpan tipe file untuk pengecekan nanti
      setDecryptedFileType(originalBlob.type);

      const url = window.URL.createObjectURL(originalBlob);
      setDecryptedBlobUrl(url);

    } catch (error) {
      console.error(error);
      alert("Gagal mendekripsi file! File mungkin rusak.");
    } finally {
      setDecrypting(false);
    }
  };

// --- UPDATED SAVE FUNCTION ---
  const handleSaveDecrypted = async () => {
    if (!decryptedBlobUrl || !selectedDoc) return;
    setIsSaving(true);

    try {
      const response = await fetch(decryptedBlobUrl);
      const blob = await response.blob();

      // MEMBERSIHKAN NAMA FILE DARI TIMESTAMP
      // Format di DB: "17239283_Laporan.pdf" -> Kita mau ambil "Laporan.pdf" aja
      // Cari posisi underscore pertama
      const underscoreIndex = selectedDoc.file_name.indexOf('_');
      let cleanName = selectedDoc.file_name;
      
      if (underscoreIndex !== -1) {
          // Ambil string setelah underscore pertama
          cleanName = selectedDoc.file_name.substring(underscoreIndex + 1);
      }
      
      // Buat File Object
      const fileToUpload = new File([blob], cleanName, { type: blob.type });

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const uploadRes = await fetch('http://localhost:5000/api/save-decrypted', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) throw new Error("Gagal menyimpan ke server");

      alert(`Berhasil! File "${cleanName}" disimpan.`);
      
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Logic Hapus (Sama seperti sebelumnya)
  const openDeleteAlert = (doc) => { setSelectedDoc(doc); setIsDeleteOpen(true); };
  const handleDelete = async () => {
    if (!selectedDoc) return;
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${selectedDoc.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Gagal hapus");
      fetchDocuments(); setIsDeleteOpen(false);
    } catch (error) { alert("Error hapus."); }
  };

  // Logic Pagination (Sama)
  const filteredDocs = documents.filter((doc) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (doc.file_name || "").toLowerCase().includes(q) || (doc.user_id || "").toLowerCase().includes(q);
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Helper untuk cek apakah bisa dipreview di browser
  const canPreview = (type) => {
      if (!type) return false;
      return type.startsWith('image/') || type === 'application/pdf' || type === 'text/plain';
  };

  return (
    <div className="w-full pb-10">
      {/* HEADER & TABLE (Sama seperti sebelumnya, copas dari kode kamu yg terakhir) */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dekripsi File</h1>
            <p className="text-gray-500 mt-1">Total Dokumen Terenkripsi: <span className="font-semibold text-[#339609]">{filteredDocs.length}</span></p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-72">
            <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400"></i>
            <input type="search" placeholder="Cari file..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#339609]" />
          </div>
          <button onClick={fetchDocuments} className="bg-[#339609] text-white px-4 py-2.5 rounded-full shadow-md flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg><span className="hidden sm:inline">Refresh</span></button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-6">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                  <th className="px-6 py-4">No</th><th className="px-6 py-4">Nama File</th><th className="px-6 py-4">Uploader</th><th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDocs.map((doc, index) => (
                    <tr key={doc.id} className="hover:bg-green-50/30">
                        <td className="px-6 py-4 text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><Lock size={16} className="text-orange-500"/><span className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{doc.file_name}</span></div></td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.user_id}</td>
                        <td className="px-6 py-4 text-center">
                            <button onClick={() => openDecryptModal(doc)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-200 flex items-center justify-center gap-1 mx-auto"><Unlock size={14}/> Buka File</button>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
       {/* PAGINATION */}
        {!loading && documents.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredDocs.length)} dari {filteredDocs.length} dokumen</span>
            <div className="flex gap-2">
              <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Previous</button>
              <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DECRYPT */}
      {isDecryptModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Unlock size={20} className="text-[#339609]" /> Dekripsi File</h3>
              <button onClick={closeDecryptModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <div className="p-8 text-center">
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${decryptedBlobUrl ? 'bg-green-100 text-[#339609]' : 'bg-orange-50 text-orange-500'}`}>
                {decryptedBlobUrl ? (canPreview(decryptedFileType) ? <Eye size={40} /> : <FileText size={40} />) : <Lock size={40} />}
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-1 break-all px-2">
                {decryptedBlobUrl ? selectedDoc.file_name : selectedDoc.file_name}
              </h4>
              <p className="text-sm text-gray-500 mb-6">Uploaded by: <strong>{selectedDoc.user_id}</strong></p>

              {!decryptedBlobUrl ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 text-yellow-800 text-sm px-4 py-3 rounded-xl"><p>Status: Terenkripsi</p></div>
                  <button onClick={handleDecryptProcess} disabled={decrypting} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold flex justify-center gap-2">
                    {decrypting ? "Membuka..." : <><Unlock size={20}/> Dekripsi File Ini</>}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in-up">
                  <div className="bg-green-50 text-green-800 text-sm px-4 py-3 rounded-xl"><p>File berhasil didekripsi!</p></div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* LOGIC TOMBOL PREVIEW: Cek jika browser support */}
                    {canPreview(decryptedFileType) ? (
                        <a href={decryptedBlobUrl} target="_blank" rel="noreferrer" className="py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 rounded-xl font-medium flex justify-center gap-2"><Eye size={18} /> Preview</a>
                    ) : (
                        // Jika DOCX/XLSX, tombol preview dimatikan/diganti pesan
                        <button disabled className="py-3 px-4 bg-gray-100 text-gray-400 rounded-xl font-medium flex justify-center gap-2 cursor-not-allowed" title="Browser tidak support preview file Office"><Eye size={18} /> No Preview</button>
                    )}
                    
                    <a href={decryptedBlobUrl} download={selectedDoc.file_name} className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium flex justify-center gap-2"><Download size={18} /> Download</a>
                  </div>

                  <button onClick={handleSaveDecrypted} disabled={isSaving} className="w-full py-3 px-4 bg-[#339609] hover:bg-[#287a07] text-white rounded-xl font-medium shadow-md flex justify-center gap-2">
                    {isSaving ? "Menyimpan..." : <><Save size={18} /> Simpan ke File Terdekripsi</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecryptFile;