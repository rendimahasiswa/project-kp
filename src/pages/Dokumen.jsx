import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // <-- penting!

const initialDocuments = [
  { id: 1, nama: 'Kontrak Kemitraan Q4', pengirim: 'Legal Dept.', tanggal: '15 Nov 2025', status: 'Menunggu Saya' },
  { id: 2, nama: 'Memo Internal Proyek Alpha', pengirim: 'Finance', tanggal: '14 Nov 2025', status: 'Selesai' },
  { id: 3, nama: 'Formulir Cuti Tahunan', pengirim: 'HRD', tanggal: '10 Nov 2025', status: 'Menunggu Pihak Lain' },
  { id: 4, nama: 'Perjanjian Kerahasiaan (NDA)', pengirim: 'Budi Santoso', tanggal: '05 Nov 2025', status: 'Selesai' },
  { id: 5, nama: 'Proposal Penawaran Baru', pengirim: 'Marketing', tanggal: '01 Nov 2025', status: 'Ditolak' },
];

const Dokumen = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filter, setFilter] = useState('Semua');

  const navigate = useNavigate(); // <-- digunakan untuk pindah halaman

  // Fungsi untuk mendapatkan warna badge berdasarkan status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu Saya':
        return 'bg-yellow-100 text-yellow-800';
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Menunggu Pihak Lain':
        return 'bg-blue-100 text-blue-800';
      case 'Ditolak':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler tombol aksi
  const handleAction = (id, action) => {
    if (action === "Unggah Dokumen Baru") {
      navigate("/dashboard/ttdelektronik");  // <-- buka halaman TtdElektronik
      return;
    }

    alert(`Aksi: ${action} untuk Dokumen ID: ${id}`);
  };

  // Logika filter
  const filteredDocuments = documents.filter(doc =>
    filter === 'Semua' ? true : doc.status === filter
  );

  const filterOptions = ['Semua', 'Menunggu Saya', 'Selesai', 'Menunggu Pihak Lain', 'Ditolak'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-6 flex justify-between items-center border-b pb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Dokumen</h1>
          <p className="text-gray-500">Kelola dokumen yang masuk, keluar, dan yang perlu ditandatangani.</p>
        </div>

        {/* Tombol Unggah Baru → pindah ke TtdElektronik */}
        <button
          onClick={() => handleAction(0, 'Unggah Dokumen Baru')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-200 shadow-md hidden sm:block"
        >
          + Unggah Baru
        </button>
      </header>

      {/* Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition duration-200 
                ${filter === option 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Dokumen */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokumen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.pengirim}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.tanggal}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {doc.status === 'Menunggu Saya' ? (
                      <button 
                        onClick={() => handleAction(doc.id, 'Tanda Tangan')}
                        className="text-yellow-600 hover:text-yellow-800 transition duration-150"
                      >
                        Tanda Tangan
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAction(doc.id, 'Lihat Detail')}
                        className="text-blue-600 hover:text-blue-800 transition duration-150"
                      >
                        Lihat Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                  Tidak ada dokumen dengan status '{filter}'.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dokumen;
