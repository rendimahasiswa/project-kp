import React, { useEffect, useState } from "react";
import { Search, RefreshCw, ExternalLink, Trash2, Download } from "lucide-react";

const DecryptedList = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/decrypted-documents');
      const result = await response.json();
      if (response.ok) setDocs(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // --- DELETE HANDLERS ---
  const openDeleteAlert = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    setIsDeleting(true);
    
    try {
        const res = await fetch(`http://localhost:5000/api/decrypted-documents/${selectedDoc.id}`, { method: 'DELETE'});
        if(res.ok) {
            fetchDocs();
            setIsDeleteOpen(false);
        } else {
            alert("Gagal hapus");
        }
    } catch(err) {
        alert("Error server");
    } finally {
        setIsDeleting(false);
    }
  }

  // --- FORCE DOWNLOAD HANDLER ---
  const handleDownload = async (url, filename) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Buat link temporary untuk download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename; // Paksa nama file & download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
        alert("Gagal mendownload file.");
    }
  };

  // --- PREVIEW HANDLER ---
  const handlePreview = (url) => {
      window.open(url, "_blank");
  };

  // --- FILTER & PAGINATION ---
  const filtered = docs.filter(d => d.original_name.toLowerCase().includes(search.toLowerCase()));
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };


  return (
    <div className="w-full pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">File Terbuka</h1>
          <p className="text-gray-500 mt-1">File yang sudah didekripsi dan disimpan ({filtered.length})</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-72">
                <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={18} />
                <input type="search" placeholder="Cari file..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#339609]" />
             </div>
             <button onClick={fetchDocs} className="bg-[#339609] hover:bg-[#287a07] text-white px-4 py-2.5 rounded-full shadow-md flex items-center gap-2"><RefreshCw size={16}/><span className="hidden sm:inline">Refresh</span></button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {loading ? <div className="p-6">Loading...</div> : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">No</th>
                            <th className="px-6 py-4 font-semibold">Nama File</th>
                            <th className="px-6 py-4 font-semibold">Disimpan Pada</th>
                            <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentDocs.length > 0 ? (
                            currentDocs.map((doc, index) => {
                                const nomorUrut = (currentPage - 1) * itemsPerPage + index + 1;
                                return (
                                    <tr key={doc.id} className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 font-medium">{nomorUrut}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{doc.original_name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(doc.saved_at).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                {/* PREVIEW BUTTON */}
                                                <button 
                                                    onClick={() => handlePreview(doc.file_url)} 
                                                    className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100" 
                                                    title="Preview"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                                
                                                {/* DOWNLOAD BUTTON (FORCE) */}
                                                <button 
                                                    onClick={() => handleDownload(doc.file_url, doc.original_name)} 
                                                    className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100" 
                                                    title="Download"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                
                                                {/* DELETE BUTTON */}
                                                <button 
                                                    onClick={() => openDeleteAlert(doc)} 
                                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100" 
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Belum ada file yang disimpan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

        {/* PAGINATION FOOTER */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filtered.length)} dari {filtered.length} file</span>
            <div className="flex gap-2">
              <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Previous</button>
              <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50"><Trash2 size={32} className="text-red-500" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus File Terbuka?</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Anda akan menghapus file <strong>"{selectedDoc ? selectedDoc.original_name : '...'}"</strong> dari daftar ini. File di menu Enkripsi tidak akan terhapus.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsDeleteOpen(false)} disabled={isDeleting} className="py-3 px-4 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50">Batal</button>
              <button onClick={handleDelete} disabled={isDeleting} className={`py-3 px-4 rounded-xl text-sm font-semibold shadow-lg shadow-red-200 flex items-center justify-center gap-2 text-white transition-all ${isDeleting ? "bg-red-400 cursor-wait" : "bg-red-600 hover:bg-red-700"}`}>
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DecryptedList;