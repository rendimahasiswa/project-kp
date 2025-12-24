import React, { useEffect, useState } from "react";
// HAPUS SUPABASE
// import { supabase } from "../supabase-client";
// import { decryptText } from "../Crypto";
import { useNavigate } from "react-router-dom";
import { Trash2, Unlock, Search, RefreshCw, ExternalLink, Download } from "lucide-react";

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [userRole, setUserRole] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // 1. AMBIL ROLE DARI LOCAL STORAGE SAAT LOAD
    const storedUser = localStorage.getItem("user_session");
    if (storedUser) {
        try {
            const session = JSON.parse(storedUser);
            setUserRole(session.role); // 'admin' atau 'user'
        } catch (e) {
            console.error("Error parsing session");
        }
    }

    fetchDocs();
  }, []);

  // --- 1. FETCH DARI API LOKAL ---
  async function fetchDocs() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/documents');
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Gagal memuat data");

      setDocs(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat dokumen.");
    } finally {
      setLoading(false);
    }
  }

  const openDeleteAlert = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteOpen(true);
  };

  // --- 2. DELETE VIA API LOKAL ---
  const handleDelete = async () => {
    if (!selectedDoc) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/documents/${selectedDoc.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal menghapus");
      }

      // Refresh data setelah hapus sukses
      fetchDocs();
      setIsDeleteOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- 3. FUNGSI: MEMBUKA RAW FILE SEBAGAI TEXT (PREVIEW ENKRIPSI) ---
  const handleOpenRaw = async (url) => {
    try {
      // 1. Ambil file dari server
      const response = await fetch(url);
      const blob = await response.blob();

      // 2. Ubah tipe blob menjadi 'text/plain' agar browser mau merender teksnya
      const textBlob = new Blob([blob], { type: "text/plain" });

      // 3. Buat URL sementara dan buka di tab baru
      const objectUrl = window.URL.createObjectURL(textBlob);
      window.open(objectUrl, "_blank");
      
    } catch (err) {
      console.error("Gagal membuka file raw:", err);
      alert("Gagal membuka file.");
    }
  };

  // --- 4. FUNGSI BARU: FORCE DOWNLOAD (FIX JPG OPEN IN NEW TAB) ---
  const handleForceDownload = async (url, filename) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Gagal download");
        
        const blob = await response.blob();
        
        // Buat link virtual
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename; // Paksa nama file
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Bersihkan memori
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download error:", error);
        alert("Gagal mendownload file.");
    }
  };

  const filtered = docs.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (d.file_name || "").toLowerCase().includes(q) ||
      (d.user_id || "").toLowerCase().includes(q)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Documents</h1>
          <p className="text-gray-500 mt-1">List of uploaded documents ({filtered.length})</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="search" placeholder="Cari nama file..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#339609]" />
          </div>
          <button onClick={fetchDocs} className="bg-[#339609] hover:bg-[#287a07] text-white px-4 py-2.5 rounded-full shadow-md flex items-center gap-2">
            <RefreshCw size={16} /> <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">{[...Array(5)].map((_, i) => (<div key={i} className="h-10 bg-gray-100 rounded-lg w-full"></div>))}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">No</th>
                  <th className="px-6 py-4 font-semibold">Uploader</th>
                  <th className="px-6 py-4 font-semibold">Nama File</th>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDocs.length > 0 ? (
                  currentDocs.map((doc, index) => {
                    const nomorUrut = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr key={doc.id} className="hover:bg-green-50/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{nomorUrut}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{doc.user_id || "-"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center text-lg shrink-0">📄</div>
                            <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px]" title={doc.file_name}>{doc.file_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* BUTTON COMMON: PREVIEW RAW (ENKRIPSI) */}
                            <button
                              onClick={() => handleOpenRaw(doc.file_url)}
                              className="py-1.5 px-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Buka File Mentah (Bukti Enkripsi)"
                            >
                              <ExternalLink size={18} />
                            </button>

                            {/* BUTTON KHUSUS ADMIN - Hapus */}
                            {userRole === 'admin' && (
                                <button onClick={() => openDeleteAlert(doc)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hapus File">
                                    <Trash2 size={18} />
                                </button>
                            )}

                            {/* BUTTON KHUSUS USER - Download Mentah */}
                            {userRole === 'user' && (
                                <button
                                    onClick={() => handleForceDownload(doc.file_url, doc.file_name)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" 
                                    title="Download File Mentah"
                                >
                                    <Download size={18} />
                                </button>
                            )}
                            
                            {/* DECRYPT BUTTON (Untuk Semua) */}
                            {/* <button onClick={() => navigate("/dashboard/decrypt")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-xs font-medium transition-colors" title="Ke Halaman Dekripsi">
                                <Unlock size={14} /> Decrypt
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No documents found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filtered.length)} dari {filtered.length} data</span>
            <div className="flex gap-2">
              <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Previous</button>
              <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Next</button>
            </div>
          </div>
        )}
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in-up overflow-hidden">
            
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <Trash2 size={32} className="text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Dokumen?</h3>
            <div className="text-sm text-gray-500 mb-8 leading-relaxed">
              <p>Anda akan menghapus file:</p>
              <strong className="block truncate mt-1 text-gray-800 px-2" title={selectedDoc?.file_name}>
                "{selectedDoc ? selectedDoc.file_name : '...'}"
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsDeleteOpen(false)} 
                disabled={isDeleting} 
                className="py-3 px-4 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              
              <button 
                onClick={handleDelete} 
                disabled={isDeleting} 
                className={`py-3 px-4 rounded-xl text-sm font-semibold shadow-lg shadow-red-200 flex items-center justify-center gap-2 text-white transition-all ${isDeleting ? "bg-red-400 cursor-wait" : "bg-red-600 hover:bg-red-700"}`}
              >
                {isDeleting ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Menghapus...</span>
                    </>
                ) : (
                    "Hapus"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;